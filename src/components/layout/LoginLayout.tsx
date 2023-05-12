import { Navigate } from 'react-router-dom';
import styles from '@/assets/style/loginLayout.module.less';

export default function LoginLayout(props: {children: JSX.Element}) {
	// 判断是否登录
	let token: string = '';

	const content: JSX.Element = <div className={styles.login_layout}>
		<div className={styles.content}>
			{/* 页面显示切换区域 */}
			<div className={`${styles.inner} login`}>
				<h2 style={{textAlign: 'center', marginBottom: 32 }}>LRT表单设计</h2>
				{props.children}
			</div>
		</div>
		{/* 底部联系信息 */}
		<div className={styles.contact}>
			<p>Copyright © 2023 表单设计</p>
			<p>
				<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noreferrer">京ICP备2023000500号-1</a>
			</p>
		</div>
	</div>

	// 判断是否已经有登录权限
	if (token) {
		return <Navigate to="/forms" />
	} else {
		return content;
	}
}