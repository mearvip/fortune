"use client"

import { useEffect } from "react"

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 添加一个小延迟确保子组件已经渲染
    setTimeout(() => {
      document.documentElement.classList.add('loaded');
    }, 100);

    return () => {
      document.documentElement.classList.remove('loaded');
    }
  }, []);

  return <>{children}</>;
}