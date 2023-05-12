/**
 * * 封装接口api的 hook 函数
 **/

// 引入封装的 axios 的 hook 函数
import useAxios from './useAxios';


/* *
 * * 接口函数
 * */

export default function useRequest() {
	// 初始化axios实例
	const axios = useAxios();

	return {
		// 手机号登录
		mobileLogin<T>(params: T) {
			return axios.post('/login', params)
		}
	}
}
