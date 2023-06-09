import { Navigate, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Layout, Dropdown, Button } from 'antd';
import { DoubleLeftOutlined, PlusOutlined } from '@ant-design/icons';
import IconFont from "../IconFont";
// 个人信息下拉显示内容样式
import styles from '@/assets/style/header.module.css';

const { Header, Content, Footer } = Layout;

// 个人信息内容
const UserNav = ():JSX.Element => {
	return (
		<ul className={styles.menu}>
			<div className={styles.userinfo}>
				<p className={styles.name}>大师傅</p>
				<div className={styles.user_id}>账号ID：112312321323123</div>
			</div>
			<li className={`${styles.link_logout} hover-color`}>退出登录</li>
		</ul>
	)
}

// 后台整体布局
function AdminLayout() {
	// 初始化路由实例
	const navigate = useNavigate();
	const { pathname } = useLocation();

	// 获取登录权限的凭证
	let token = 'asasdasdasasd';


	const content: JSX.Element = <Layout>
		{/* 头部显示内容 */}
		<Header className={styles.header_wrapper}>
			{/* logo显示区域 */}
			<div className={styles.logo_wrapper}>
				{/* 是否显示返回按钮 */}
				{/* {location.pathname !== '/forms' ?
					<DoubleLeftOutlined
						onClick={() => navigate(-1)}
						title='返回'
						className='opacity'
						style={{ marginRight: 10 }}
					/> : null
				} */}
				<img src='/vite.svg' />
				<h2>LRT表单设计</h2>
				{/* 是否显示新增表单按钮 */}
				{location.pathname === '/forms' ?
					<Button className={styles.add_btn} type='primary' icon={<PlusOutlined />} onClick={() => navigate('/create')}>新建表单</Button> : null
				}
			</div>
			<div className={styles.user_wrapper}>
				<a className={styles.link_target} href="https://github.com/youjia727/form-web-react" target="_blank" rel="noreferrer">
					<span>查看源码</span>
					<IconFont type="icon-fenxiang" />
				</a>
				{/* 个人信息 */}
				{/* <Dropdown dropdownRender={() => <UserNav />} overlayClassName={styles.user_menu_wrapper}
					placement="bottomRight" trigger={['hover', 'click']}>
					<div className={`${styles.user} user-nav hover-color`}>
						<span>大师傅</span>
						<img src="/image/avatar.jpg" alt="" />
					</div>
				</Dropdown> */}
			</div>
		</Header>
		<Content style={{ marginTop: 52 }}>
			<div className="layout-container">
				{/* 页面窗口路由显示区域 */}
				<Outlet />
			</div>
			{/* 底部商标显示 */}
			<Footer style={{
				textAlign: 'center',
				padding: '14px 14px 10px',
				fontSize: 12,
				color: '#666'
			}}
			>
				Copyright © 2023 LRT表单设计
			</Footer>
		</Content>
	</Layout>
	// 判断是否有登录权限
	if (token) {
		return content;
	} else {
		// 没有登录权限跳转登录页
		return <Navigate to="/login" />
	}
}

export default AdminLayout;