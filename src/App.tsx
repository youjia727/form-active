import { App } from 'antd';
import { useLocation, useRoutes } from 'react-router-dom';
import router from '@/router';
import LoginLayout from '@/components/layout/LoginLayout';
import { ReactElement } from 'react';

export default function View() {
	// 解析路由配置表对象
	const outlet = useRoutes(router) as ReactElement;
	// 初始化location对象实例
	const location = useLocation();

	return (
		<App>
			{/* outlet 占位符，类似于窗口， 有点像vue中的router-view */}
			{location.pathname === '/login' ?
				<LoginLayout>{outlet}</LoginLayout> : 
				<>{outlet}</>
			}
		</App>
	)
};
