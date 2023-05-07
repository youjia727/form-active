import { memo, useState } from 'react';
import { Modal, Input, Divider, Button, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import IconFont from '../IconFont';
import '@/assets/style/modal.less';

type ruleProps = {
	pattern: string,
	message: string
}

type propTypes = {
	open: boolean,
	cancel: Function,
	rules: Array<ruleProps>,
	max: number | null,
	min: number | null
}

/* 这是输入框的验证规则 */
function RuleInput(props: propTypes) {

	const { open, cancel, rules, max, min } = props;

	const [maxlength, setMaxlength] = useState(max);
	const [minlength, setMinlength] = useState(min);
	// 初始规则列表
	const [newRules, setNewRules] = useState(() => {
		if (rules.length) {
			return rules;
		} else {
			let ruleItem = {
				pattern: '',
				message: ''
			};
			return [ruleItem]
		}
	});
	/* 输入框变化内容 */
	const inputChange = (e: any, idx: number, key: string) => {
		let arr = [...newRules];
		let ruleItem = arr[idx];
		ruleItem[key as keyof typeof ruleItem] = e.target?.value;
		setNewRules(arr);
	};
	/* 添加验证规则 */
	const handleAddRule = () => {
		let ruleItem = {
			pattern: '',
			message: ''
		};
		let arr = [...newRules, ruleItem];
		setNewRules(arr);
	};
	/* 删除验证规则 */
	const handleDeleteRule = (idx: number) => {
		let arr = [...newRules];
		arr.splice(idx, 1);
		setNewRules(arr);
	};
	/* 点击确认操作 */
	const handleOk = () => {
		const ruleList = newRules.filter((rule: ruleProps) => rule.pattern.length || rule.message.length);
		let ruleObj = {
			max: maxlength,
			min: minlength,
			rules: ruleList
		}
		// 关闭弹框，并且传递数据
		cancel(false, ruleObj);
	};

	return (
		<Modal
			centered
			title="验证规则"
			maskClosable={false}
			open={open}
			width={560}
			onOk={handleOk}
			onCancel={() => cancel(false)}
		>
			<div className='rule-wrapper'>
				<div className='rule-boxs'>
					<div className='rule-box'>
						<span>最多输入：</span>
						<InputNumber
							value={maxlength}
							min={1}
							max={99999}
							onChange={value => setMaxlength(value)}
							placeholder="请输入"
							style={{ width: 116 }}
						/>
						<span className='end-text'>个字符</span>
					</div>
					<div className='rule-box'>
						<span>最少输入：</span>
						<InputNumber
							value={minlength}
							min={1}
							max={99999}
							onChange={value => setMinlength(value)}
							placeholder="请输入"
							style={{ width: 116 }}
						/>
						<span className='end-text'>个字符</span>
					</div>
				</div>
				<Divider>校验规则</Divider>
				<div className='rule-item'>
					{newRules.map((rule: ruleProps, idx: number) => (
						<div className='rule-box' key={'rule-' + idx}>
							<span>验证规则：</span>
							<Input
								value={rule.pattern}
								onChange={e => inputChange(e, idx, 'pattern')}
								placeholder="正则表达式"
							/>
							<Input
								value={rule.message}
								onChange={e => inputChange(e, idx, 'message')}
								placeholder="出错提示语"
							/>
							<IconFont
								onClick={e => handleDeleteRule(idx)}
								className='rule-icon opacity hover-error'
								title='删除'
								type='icon-shanchu'
							/>
						</div>
					))}
				</div>
				{newRules.length >= 6 ? null :
					<div style={{ textAlign: 'center', paddingTop: 10 }}>
						<Button onClick={handleAddRule} icon={<PlusOutlined />}>添加验证规则</Button>
					</div>
				}
			</div>

		</Modal>
	)
}

export default memo(RuleInput);