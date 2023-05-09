import { useRef, memo } from 'react';
import { Input } from 'antd';
import { useUpdate } from '@/hooks/useUpdate';
import { PlusCircleOutlined } from '@ant-design/icons';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { baseProps } from '@/assets/utils/formConfig/editorConfig';

const { TextArea } = Input;


function View(props: { item: baseProps }) {

	const { item } = props;

	const update = useUpdate();
	const textareaRef = useRef<TextAreaRef>(null);

	/* 问题输入变化 */
	const onChange = (e: any) => {
		update(() => {
			item.question = e.target.value;
		})
	};
	/* 添加填空符 */
	const handleAddOperator = () => {
		const operator = '＿＿＿＿'; //填空符
		const { current } = textareaRef;
		const elInput = current?.resizableTextArea?.textArea;
		let startPos = elInput?.selectionStart ?? 0;
		let endPos = elInput?.selectionEnd ?? 0;
		if (startPos === undefined || endPos === undefined) return;
		let value = elInput?.value;
		let result = value?.substring(0, startPos) + operator + value?.substring(endPos);
		update(() => {
			item.question = result;
		})
		elInput?.focus();
		queueMicrotask(() => {
			if (elInput) {
				elInput.selectionStart = startPos + operator.length;
				elInput.selectionEnd = startPos + operator.length;
			}
		})
	};

	return (
		<>
			<div className='multip-input'>
				<TextArea
					ref={textareaRef}
					placeholder='请输入问题(请在需要作答部分插入填空符)'
					autoSize
					onChange={onChange}
					value={item.question}
					className="form-item-input description-input mult-input"
				/>
			</div>
			<div className="form-item-setting">
				<div onClick={handleAddOperator} className='setting-block opacity'>
					<PlusCircleOutlined className='icon-block' />
					<span>添加填空符</span>
				</div>
			</div>
		</>
	)
}

export default memo(View);