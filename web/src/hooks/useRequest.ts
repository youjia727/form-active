/**
 * * 封装接口api的 hook 函数
 **/

// 引入封装的 axios 的 hook 函数
import useAxios from './useAxios';


/* *
 * * 接口函数
 * */

type objProps = {
	[key: string]: any
}

export default function useRequest() {
	// 初始化axios实例
	const axios = useAxios();

	return {
		// 手机号登录
		mobileLogin(params: objProps) {
			return axios.post('/login', params)
		}
	}
}
