import { useState, useCallback } from "react";
import { Layout, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Menu from '@/components/Menu';
import queryString from 'query-string';
import { useLocation } from "react-router-dom";
import Mycreate from './Mycreate';
import Trash from './Trash';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import '@/assets/style/home.css';

// 动态导入页面的路由地址
// const modules = import.meta.glob('./dynamic/*.tsx');

const { Content, Sider } = Layout;

const iconStyle = {
	fontSize: 18
}

/**
 * * 显示表单列表数据
 *  */
export default function Home() {
	/**
	 * * 定义数据
	 *  **/
	const location = useLocation();
	// 获取浏览器参数
	const query = queryString.parse(location.search);
	// 当前页面显示内容的标签名
	const [activeKey, setActiveKey] = useState(query.type ? query.type + '' : 'mycreate');
	//控制左侧菜单栏折叠
	const [collapsed, setCollapsed] = useState(false);

	const items: TabsProps['items'] = [{
		key: 'mycreate',
		label: '',
		children: <Mycreate />,
	}, {
		key: 'trash',
		label: '',
		children: <Trash />,
	}];

	/**
	 * * 自定义函数
	 *  */
	// 左侧菜单栏切换监听菜单栏类型
	const hashCallBack = useCallback((value: string) => {
		setActiveKey(value)
	}, []);

	return (
		<Layout hasSider>
			<Sider width={180} className='sider-wrapper' theme='light' collapsible collapsed={collapsed} breakpoint="sm"
				trigger={collapsed ? <MenuUnfoldOutlined className="opacity" style={iconStyle} title='展开' /> :
					<MenuFoldOutlined className="opacity" style={iconStyle} title='收起' />}
				collapsedWidth={60} onCollapse={(value) => setCollapsed(value)}>
				{/* 菜单栏 */}
				<Menu callBack={hashCallBack} />
			</Sider>
			<Content style={{ margin: '14px 14px 4px' }}>
				<Tabs activeKey={activeKey} items={items} />
			</Content>
		</Layout>
	)
};