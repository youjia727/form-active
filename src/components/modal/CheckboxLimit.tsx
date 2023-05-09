import { memo, useState, useEffect } from 'react';
import { Modal, Select } from 'antd';
import useMessage from '@/hooks/useMessage';
import { CaretDownOutlined } from '@ant-design/icons';
import '@/assets/style/modal.less';
import { optionProps } from '@/assets/utils/formConfig/editorConfig';


const { Option } = Select;

type propTypes = {
	open: boolean,
	cancel: Function,
	max: number|null,
	min: number|null,
	options: Array<optionProps>
}

/* 限制多选题的选择数量 */
function CheckboxLimit(props: propTypes) {

	const { open, cancel, max, min, options } = props;

	const message = useMessage();

	const [show, setShow] = useState(open);
	const [maxLimit, setMaxLimit] = useState( max ?? 0);
	const [minLimit, setMinLimit] = useState(min ?? 0);

	useEffect(() => {
		setShow(open)
	}, [open])

	/* 选择最大与最小的选择 */
	const checkboxLimit = (value: number, type: string) => {
		type === 'max' ? setMaxLimit(value) : setMinLimit(value);
	};
	/* 点击确认操作 */
	const handleOk = () => {
		if (minLimit > maxLimit) {
			message.warning('最少选择项不能大于最多选择项');
			return false;
		}
		setShow(false);
	};
	/* modal框完全关闭之后 */
	const afterClose = () => {
		let limitObj = {
			max: maxLimit,
			min: minLimit
		}
		// 关闭弹框，并且传递数据
		cancel(false, limitObj);
	};

	return (
		<Modal
			centered
			title="选择数量限制"
			maskClosable={false}
			open={show}
			afterClose={afterClose}
			onOk={handleOk}
			onCancel={() => setShow(false)}
		>
			<div className='checkbox-limit-wrapper'>
				<div className='checkbox-limit-item'>
					<span>最多选择</span>
					<Select
						className='checkbox-select-limit'
						value={maxLimit}
						onChange={(value) => checkboxLimit(value, 'max')}
						suffixIcon={<CaretDownOutlined />}
					>
						<Option value={0} label={0}>未设置</Option>
						{options.map((col: optionProps, idx: number) => (
							<Option value={idx + 1} label={idx + 1} key={col.id}>{idx + 1}</Option>
						))}
					</Select>
					<span>个选项</span>
				</div>
				<div className='checkbox-limit-item'>
					<span>最少选择</span>
					<Select
						className='checkbox-select-limit'
						value={minLimit}
						onChange={(value) => checkboxLimit(value, 'min')}
						suffixIcon={<CaretDownOutlined />}
					>
						<Option value={0} label={0}>未设置</Option>
						{options.map((col: optionProps, idx: number) => (
							<Option value={idx + 1} label={idx + 1} key={col.id}>{idx + 1}</Option>
						))}
					</Select>
					<span>个选项</span>
				</div>
			</div>
		</Modal>
	)
}

export default memo(CheckboxLimit);