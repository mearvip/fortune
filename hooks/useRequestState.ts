import { useState, useEffect } from 'react';

interface RequestState {
  pendingRequest: Promise<Response> | null;
  controller: AbortController | null;
  isActive: boolean;
}

interface UseRequestStateOptions {
  keepAlive?: boolean;
  storageKey?: string;
}

// 添加请求状态过期检查
const checkRequestExpiration = (timestamp: number) => {
  const currentTime = Date.now();
  const timeElapsed = currentTime - timestamp;
  // 如果请求状态保存超过5分钟，认为已过期
  return timeElapsed > 5 * 60 * 1000;
};

export const useRequestState = ({ keepAlive = false, storageKey = 'default' }: UseRequestStateOptions = {}) => {
  const [state, setState] = useState<RequestState>(() => {
    if (keepAlive && typeof window !== 'undefined') {
      const savedState = localStorage.getItem(`requestState_${storageKey}`);
      if (savedState) {
        try {
          const { isActive, hasPendingRequest, timestamp } = JSON.parse(savedState);
          if (!checkRequestExpiration(timestamp)) {
            return {
              pendingRequest: hasPendingRequest ? null : null,
              controller: null,
              isActive
            };
          }
        } catch (error) {
          console.error('恢复请求状态失败:', error);
          localStorage.removeItem(`requestState_${storageKey}`);
        }
      }
    }
    return {
      pendingRequest: null,
      controller: null,
      isActive: true
    };
  });

  useEffect(() => {
    return () => {
      if (keepAlive && typeof window !== 'undefined') {
        localStorage.setItem(`requestState_${storageKey}`, JSON.stringify({
          isActive: state.isActive,
          hasPendingRequest: state.pendingRequest !== null,
          timestamp: Date.now()
        }));
      } else if (state.controller) {
        state.controller.abort();
        setState(prev => ({ ...prev, isActive: false }));
      }
    };
  }, [keepAlive, state, storageKey]);

  const setPendingRequest = (request: Promise<Response>) => {
    setState(prev => ({ ...prev, pendingRequest: request }));
    if (keepAlive && typeof window !== 'undefined') {
      localStorage.setItem(`requestState_${storageKey}`, JSON.stringify({
        isActive: true,
        hasPendingRequest: true,
        timestamp: Date.now()
      }));
    }
  };

  const cleanup = () => {
    setState(prev => ({
      ...prev,
      pendingRequest: null,
      controller: null
    }));
    if (keepAlive && typeof window !== 'undefined') {
      localStorage.setItem(`requestState_${storageKey}`, JSON.stringify({
        isActive: true,
        hasPendingRequest: false,
        timestamp: Date.now()
      }));
    }
  };

  const createController = () => {
    const controller = new AbortController();
    setState(prev => ({ ...prev, controller }));
    return controller;
  };

  return {
    isActive: state.isActive,
    createController,
    setPendingRequest,
    cleanup
  };
};