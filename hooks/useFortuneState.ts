import { useState, useEffect } from 'react';
import { useFortuneContext } from '../context/FortuneContext';

interface FortuneState {
  formData: any;
  result: string;
  loading: boolean;
}

interface UseFortuneStateOptions {
  storageKey: string;
  keepAlive?: boolean;
  initialState?: FortuneState | null;
}

export const useFortuneState = ({ storageKey, keepAlive = false, initialState = null }: UseFortuneStateOptions) => {
  const { state: globalState, updateState } = useFortuneContext();
  const [state, setState] = useState<FortuneState>(() => {
    // 首先检查是否有初始状态
    if (initialState) {
      return initialState;
    }
    // 然后检查全局状态
    if (globalState[storageKey as keyof typeof globalState]) {
      return globalState[storageKey as keyof typeof globalState];
    }
    // 最后使用默认状态
    return {
      formData: {},
      result: '',
      loading: false
    };
  });

  useEffect(() => {
    if (keepAlive) {
      updateState(storageKey, state);
    }
  }, [state, storageKey, keepAlive, updateState]);

  const setFormData = (formData: any) => {
    setState(prev => {
      const newState = { ...prev, formData };
      if (keepAlive) {
        updateState(storageKey, newState);
      }
      return newState;
    });
  };

  const setResult = (result: string) => {
    setState(prev => {
      const newState = { ...prev, result };
      if (keepAlive) {
        updateState(storageKey, newState);
      }
      return newState;
    });
  };

  const setLoading = (loading: boolean) => {
    setState(prev => {
      const newState = { ...prev, loading };
      if (keepAlive) {
        updateState(storageKey, newState);
      }
      return newState;
    });
  };

  return {
    state,
    setFormData,
    setResult,
    setLoading
  };
};