import { RefObject, useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLDivElement>(
  handler: undefined | (() => void),
  node: RefObject<T | undefined>
) {
  const handlerRef = useRef<undefined | (() => void)>(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (node.current?.contains(e.target as Node) ?? false) {
        // 点击了dom区域
        // console.log('点击了dom区域')
        return;
      }
      if (handlerRef.current) handlerRef.current();
        // 点击了dom之外区域
        // console.log('点击了dom区域之外')
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [node])
}

