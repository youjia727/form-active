import { memo, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import useMessage from '@/hooks/useMessage';
import '@/assets/style/modal.less';

type valueProps = {
	label: string,
	placeholder: string
}

type propTypes = {
	open: boolean,
	cancel: Function,
	initValues?: valueProps,
	cascaderList?: Array<valueProps>
}

/* 这是添加层级 */
function View(props: propTypes) {
	const { open, cancel, initValues, cascaderList = [] } = props;

	// 定义form组件里的方法
	const [form] = Form.useForm();

	const message = useMessage();

	const [show, setShow] = useState(open);

	const [value, setValue] = useState<valueProps | undefined>(undefined);

	const onFinish = (values: valueProps) => {
		let bool: boolean = cascaderList.some((item: valueProps) => item.label === values.label);
		if (bool) {
			message.warning('属性字段已被占用，请重新输入');
			return false;
		};
		setValue(values);
		setShow(false);
	};
	/* 点击确认操作 */
	const handleOk = () => {
		form.submit();
	};
	/* modal框完全关闭之后 */
	const afterClose = () => {
		// 关闭弹框，并且传递数据
		cancel(false, value);
	};


	return (
		<Modal
			centered
			width={420}
			title="层级属性配置"
			maskClosable={false}
			open={show}
			afterClose={afterClose}
			onOk={handleOk}
			onCancel={() => setShow(false)}
		>
			<Form
				form={form}
				name="addCascader"
				onFinish={onFinish}
				autoComplete="off"
				initialValues={initValues}
				style={{ marginTop: 26 }}
				validateTrigger={['onBlur']}
			>
				<Form.Item
					label="属性字段"
					name="label"
					rules={[{ required: true, message: '请输入属性字段' }, { pattern: /^[a-zA-Z][a-zA-Z_]/, message: '字段名为字母或下划线，且以字母开头，至少两位' }]}
				>
					<Input placeholder='请输入字段属性' maxLength={16} />
				</Form.Item>
				<Form.Item
					label="占位文本"
					name="placeholder"
					rules={[{ required: true, message: '请输入输入框占位文本' }]}
				>
					<Input placeholder='输入框占位文本' maxLength={16} />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default memo(View);