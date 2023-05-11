import { memo } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useMessage from "@/hooks/useMessage";
import { useRouter } from '@/hooks/useRouter';

function Login() {
	// 提示语
	const message = useMessage();

	/**
	* * 定义数据
	* */
	// 定义路由对象
	const router = useRouter();
	// 定义form组件里的方法
	const [form] = Form.useForm();

	/**
	 * * 定义函数
	 * * */
	//按回车键，聚焦下一个input。
	function nextFocus(e: any, name?: string) {
		if (e.keyCode === 13) {
			name ? form.getFieldInstance(name).focus() : form.submit();
		}
	};
	// 登录提交点击
	function handleSubmit(values: any) {
		// 点击登录跳转路由
		// router.push()
		console.log('Success:', values)
	};
	// 表单验证失败的方法
	function onFinishFailed(error: any) {
		console.log('Failed:', error)
	};

	return (
		<Form form={form} initialValues={{ remember: false }} onFinish={handleSubmit}
			onFinishFailed={onFinishFailed} scrollToFirstError={true} autoComplete="off">
			<Form.Item name="user" rules={[{ required: true, message: '请输入账号' }]}>
				<Input onKeyUp={e => nextFocus(e, 'password')} placeholder="请输入账号" prefix={<UserOutlined className="login_icon" />} />
			</Form.Item>
			<Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
				<Input.Password onKeyUp={e => nextFocus(e)} placeholder="请输入密码" prefix={<LockOutlined className="login_icon" />} />
			</Form.Item>
			<Form.Item>
				<Button type="primary" style={{ height: 38, fontSize: 15, width: '100%' }} onClick={e => form.submit()}>
				密码登录
				</Button>
			</Form.Item>
		</Form>
	)
}

export default memo(Login);