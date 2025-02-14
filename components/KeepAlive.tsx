"use client"

import React, { useRef, useEffect, useState } from 'react';

interface KeepAliveProps {
  id: string;
  children: React.ReactNode;
}

interface CacheItem {
  id: string;
  node: React.ReactNode;
  status: 'active' | 'inactive';
}

const cache = new Map<string, CacheItem>();

const KeepAlive: React.FC<KeepAliveProps> = ({ id, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const currentCache = cache.get(id);
    if (!currentCache) {
      cache.set(id, {
        id,
        node: children,
        status: 'active'
      });
    } else {
      currentCache.status = 'active';
      currentCache.node = children;
      forceUpdate({}); // 强制更新以确保状态变化反映在UI上
    }

    return () => {
      const item = cache.get(id);
      if (item) {
        item.status = 'inactive';
        forceUpdate({}); // 确保状态变化在卸载时也能反映
      }
    };
  }, [id, children]);

  const cacheItem = cache.get(id);

  if (!cacheItem) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: cacheItem.status === 'active' ? 'block' : 'none'
      }}
    >
      {cacheItem.node}
    </div>
  );
};

export default KeepAlive;
