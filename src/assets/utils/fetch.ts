import sign from './sign';

type objTypes = {
	[key: string]: any
}

/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj: objTypes, arr: Array<any> = [], idx = 0) {
	for (let item in obj) {
		arr[idx++] = [item, obj[item]]
	}
	return new URLSearchParams(arr).toString()
}

/**
 * 真正的请求
 * @param url 请求地址
 * @param options 请求参数
 * @param method 请求方式
 */
function commonFetcdh(url: string, options: objTypes, method = 'GET') {
	const searchStr = obj2String(options)
	let initObj = {}
	if (method === 'GET') { // 如果是GET请求，拼接url
		url += '?' + searchStr
		initObj = {
			method: method,
			credentials: 'include'
		}
	} else {
		// 格式化参数
		let data: objTypes|string = sign.sign(options)
		data = obj2String(data)
		initObj = {
			method: method,
			credentials: 'include',
			headers: new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			}),
			body: data
		}
	}
	return new Promise((resolve, reject) => {
		fetch(url, initObj).then(res => res.text()).then(result => {
			resolve(result)
		}).catch(err => {
			reject(err);
		})
	})
}


/**
 * GET请求
 * @param url 请求地址
 * @param options 请求参数
 */
function GET(url: string, options: objTypes) {
	return commonFetcdh(url, options, 'GET')
}

/**
 * POST请求
 * @param url 请求地址
 * @param options 请求参数
 */
function POST(url: string, options: objTypes) {
	return commonFetcdh(url, options, 'POST')
}

export default {
	post: POST,
	get: GET
}
