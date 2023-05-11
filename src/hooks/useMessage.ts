/**
 * * 封装 message 的 hook 函数
 **/

import { App } from 'antd';
const key = 'update';
let hide: any;

export default function useMessage() {
	const { message } = App.useApp();
	// 基本提示信息
	function info(content: String) {
		message.info({
			content,
			key
		})
	};

	// 错误提示信息
	function error(content: String) {
		message.error({
			content,
			key
		})
	};

	// 成功的提示信息
	function success(content: String) {
		message.success({
			content,
			key
		})
	};

	// 警告的提示信息
	function warning(content: String) {
		message.warning({
			content,
			key
		})
	};

	// 加载中的信息
	function loading(content: String) {
		hide = message.loading({
			content,
			key,
			duration: 0
		})
	};

	// 关闭所有提示
	function close() {
		hide && hide()
	};

	return {
		info,
		error,
		success,
		warning,
		loading,
		close
	}
}
