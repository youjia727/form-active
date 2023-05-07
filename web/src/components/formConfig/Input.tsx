import { useState, memo } from 'react';
import RuleInput from '../modal/RuleInput';
import { PlusCircleOutlined } from '@ant-design/icons';
import { baseProps } from '@/assets/utils/formConfig/editorConfig';

type ruleProps = {
	pattern: string,
	message: string
}

type ruleObj = {
	max: number | null,
	min: number | null,
	rules: ruleProps[]
}

type propsTypes = {
	item: baseProps,
	tag: string
}

/* 输入类型组件配置 */
function View(props: propsTypes) {
	
	const { item, tag } = props;

	const [open, setOpen] = useState(false);

	/* 编辑规则弹框隐藏回调 */
	const cancelCallback = (visable: boolean, ruleParm?: ruleObj) => {
		if (ruleParm) {
			item.max = ruleParm?.max;
			item.min = ruleParm?.min;
			item.rules = ruleParm?.rules;
		}
		setOpen(visable);
	};

	return (
		<>
			{/* multiline 代表多行输入 */}
			<div className={`placeholder-info ${tag === 'textarea' ? 'multiline' : ''}`}>填写者回答区</div>
			<div className="form-item-setting">
				<div className='setting-block opacity' onClick={() => setOpen(true)}>
					<PlusCircleOutlined className='icon-block' />
					<span>编辑规则</span>
				</div>
			</div>
			<RuleInput rules={item.rules} max={item.max} min={item.min} open={open} cancel={cancelCallback} />
		</>
	)
}

export default memo(View);