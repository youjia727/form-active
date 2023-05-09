/**
 * * 封装 modal 弹框的 hook 函数
 **/

import { App } from 'antd';
let modalCallBack: any;

// 弹框确认操作hook
export default function useModal() {

	const { modal } = App.useApp();

	// 确认信息
	function confirm({
		title = '操作提示',
		content = '请确认信息是否正确？',
		onOk = (close?: Function) => {},
		onCancel = () => {},
		okButtonProps = {},
		className = 'modal-confirm-box'
	}) {
		modalCallBack = modal.confirm({
			title,
			centered: true,
			content,
			okButtonProps,
			onOk,
			onCancel,
			className
		})
	}

	// 提示信息
	function info({
		title = '操作提示',
		content = '请确认信息是否正确？',
		onOk = (close?: Function) => {},
	}) {
		modalCallBack = modal.info({
			title,
			centered: true,
			content,
			onOk
		})
	}

	// 错误信息
	function error({
		title = '操作提示',
		content = '请确认信息是否正确？',
		onOk = (close?: Function) => {},
	}) {
		modalCallBack = modal.error({
			title,
			centered: true,
			content,
			onOk
		})
	}

	// 警告信息
	function warning({
		title = '操作提示',
		content = '请确认信息是否正确？',
		onOk = (close?: Function) => {},
	}) {
		modalCallBack = modal.warning({
			title,
			centered: true,
			content,
			onOk
		})
	}

	// 加载状态
	function loading() {
		modalCallBack && modalCallBack.update({
			okButtonProps: {
				loading: true
			}
		})
	}

	return {
		confirm,
		info,
		error,
		warning,
		loading
	}
}
