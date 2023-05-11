/**
 * * 封装 倒计时的 hook 函数
 **/

import { useState, useRef, useEffect } from 'react';

// useCountDown(要倒计时的时间，倒计时结束后的回调函数)
export default function useCountDown(init: number = 60) {
	const [count, setCount] = useState(init);
	const refTime = useRef<NodeJS.Timer>();
	
	/**
	 * 开始倒计时
	 */
	function start() {
		clear();
		// 1.开始倒数
		setCount(init - 1);
		// 2.开启定时器
		refTime.current = setInterval(() => {
			setCount((count) => count - 1);
			if (count <= 0) {
				clear();
			};
		}, 1000)
	}
	
	/**
	 * 清除倒计时
	 */
	function clear() {
	  if (refTime.current) {
	    clearInterval(refTime.current);
		setCount(init);
	  }
	}

	// 副作用函数的清理函数，模拟 componentWillUnMount
	useEffect(() => {
		// 销毁定时器
		return () => {
			clearInterval(refTime.current);
		}
	}, [])

	return {
		count,
		start,
		clear
	}
}