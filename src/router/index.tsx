// 懒加载回调函数
import { lazy, Suspense } from "react";
// 重定向组件Navigate
import { Navigate } from "react-router-dom";
import Login from '@/views/Login';
import Nofind from '@/views/404';
// 懒加载模式需要我们增加一个loading组件
const Menu = lazy(() => import('@/components/layout/AdminLayout'));
const Home = lazy(() => import('@/views/Home'));
// const Create = lazy(() => import('@/views/Create'));
import Create from '@/views/Create';
const Test = lazy(() => import('@/views/Test'));



// 懒加载公共函数组件
function withLoadingComponent(ele: JSX.Element) {
	return <Suspense fallback={<div style={{ textAlign: 'center', paddingTop: 10 }}>加载中...</div>}>{ele}</Suspense>
};


const routes = [{
	path: '/',
	element: <Navigate to="/create" />
}, {
	path: '/login',
	element: <Login />
}, {
	path: '/',
	element: withLoadingComponent(<Menu />),
	children: [{
		path: '/forms',
		element: withLoadingComponent(<Home />),
		meta: {
			title: '首页'
		}
	}, {
		path: '/create',
		element: <Create />,
		meta: {
			title: '新建表单'
		}
	}, {
		path: '/list/test',
		element: withLoadingComponent(<Test />),
		meta: {
			title: '测试组件'
		}
	}]
}, {
	path: '/404',
	element: <Nofind />
}, {
	path: '*',
	element: <Navigate to="/404" />
}];

export default routes;