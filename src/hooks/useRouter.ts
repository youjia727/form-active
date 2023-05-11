import { useNavigate } from "react-router-dom";

type objProp = {
	[key: string]: any
}

export function useRouter() {
	const navigater = useNavigate();

	// 重写push方法
	function push(params: string | objProp, bool?: boolean) {
		switch (typeof params) {
			// 传入路径执行操作
			case 'string':
				navigater(params, {
					replace: bool
				});
				break;
			default:
				// 传入对象执行路由
				let pathname: string = params?.path ?? '';
				if (pathname) {
					let queryStr = '';
					// 判断是否有路由query参数；
					if (params.query && Object.values(params.query).length) {
						let query: objProp = params.query;
						for (let key in query) {
							queryStr += '&' + key + '=' + query[key as keyof typeof query];
						};
						queryStr = queryStr.slice(1);
					}
					// 组装路由参数
					let url = queryStr ? pathname + '?' + queryStr : pathname;
					navigater(url, {
						replace: bool
					});
				} else {
					console.error('请输入路由地址')
				}
				break;
		}
	};
	// 重写replace方法
	function replace(params: string | objProp) {
		push(params, true)
	};


	return {
		push,
		replace
	}
};