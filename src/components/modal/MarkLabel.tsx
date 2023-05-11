import { memo, useState } from 'react';
import { Modal, Divider, Button, Input } from 'antd';
import useMessage from '@/hooks/useMessage';
import { MinusCircleFilled, PlusOutlined } from '@ant-design/icons';
import '@/assets/style/modal.less';

type propTypes = {
	open: boolean,
	marks: Array<string>,
	cancel: Function
}

/* 这是打标签 */
function MarkLabel(props: propTypes) {

	const { open, marks, cancel } = props;

	const message = useMessage();

	//是否显示选择标签弹框
	const [show, setShow] = useState(open);
	// 是否显示编辑标签的删除按钮
	const [editLabel, setEditLabel] = useState(false);
	// 当前选中的标签
	const [checkedList, setCheckedList] = useState([...marks]);
	// 是否显示当前选中编辑标签删除按钮
	const [editCheckedLabel, setEditCheckedLabel] = useState(false);
	// 服务端返回的标签
	const [labelList, setLabelList] = useState(['和蔼可亲', '人美声甜', '高大帅气', '积极向上', '普通话好']);
	// 自定义标签
	const [customList, setCustomList] = useState<string[]>(['高大威猛']);
	// 控制自定义标签弹框
	const [customModalShow, setCustomModalShow] = useState(false);
	// 新标签输入
	const [newLabel, setNewLabel] = useState('');


	/* 合并标签 */
	const composeLabel = (arr1: string[], arr2: string[]) => {
		let arr = [...arr1, ...arr2];
		return arr;
	};
	/* 删除标签 */
	const deleteLabel = (e: any, idx: number) => {
		e.stopPropagation();
		let newList = [...customList];
		let index = idx - labelList.length;
		newList.splice(index, 1);
		setCustomList(newList);
	};
	/* 选中标签, 再次点击取消选中 */
	const handleSelectLabel = (label: string) => {
		let newCheckedList: string[] = [];
		if (checkedList.includes(label)) {
			// 是否已经存在选中标签
			newCheckedList = checkedList.filter(item => item !== label);
		} else {
			if (checkedList.length >= 10) {
				message.warning('每个选项最多添加 10 个标签');
				return false;
			}
			// 没有存在就直接放进去
			newCheckedList = [...checkedList];
			newCheckedList.push(label);
		}
		setCheckedList(newCheckedList);
	};
	/* 删除渲染选中的标签 */
	const deleteCheckedLabel = (label: string) => {
		let newList: string[] = checkedList.filter(item => item !== label);
		setCheckedList(newList);
	};
	/* 点击确认操作 */
	const handleOk = () => {
		setShow(false);
	};
	/* modal框完全关闭之后 */
	const afterClose = () => {
		// 关闭弹框，并且传递数据
		cancel(false, checkedList);
	};
	/* 自定义标签确认 */
	const customModalOk = () => {
		let str = newLabel.trim();
		if (!str.length) {
			message.warning('新标签不能为空');
			return false;
		}
		let newList = [...customList];
		newList.push(str);
		setCustomList(newList);
		setCustomModalShow(false);
	};
	/* 自定义标签modal完全关闭之后 */
	const customModalClose = () => {
		let str = newLabel.trim();
		if (!str.length) return;
		setNewLabel('');
	};

	return (
		<Modal
			centered
			title="请选择标签"
			maskClosable={false}
			open={show}
			afterClose={afterClose}
			onOk={handleOk}
			onCancel={() => setShow(false)}
		>
			<div className='label-wrapper'>
				<div className='mark-label-title'>
					<span>标签模板</span>
					<span className='edit-label hover-color'
						onClick={() => setEditLabel(!editLabel)}>{editLabel ? '完成' : '管理'}</span>
				</div>
				<ul className='label-box'>
					{composeLabel(labelList, customList).map((label: string, idx: number) => (
						<li key={'select-' + label} title={label} onClick={() => handleSelectLabel(label)}
							className={`${checkedList.includes(label) ? 'checked-label' : ''} cursor`}>
							<span className='label-text'>{label}</span>
							{customList.includes(label) && editLabel ?
								<MinusCircleFilled onClick={(e) => deleteLabel(e, idx)} className='delete-label-icon' title='删除' /> : null
							}
						</li>
					))}
				</ul>
				<Button
					className='add-label-btn'
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setCustomModalShow(true)}
				>自定义标签</Button>
				<Divider style={{ margin: '16px 0' }} />
				<div className='mark-label-title'>
					<span>已选中 <mark>{checkedList.length}</mark> 个标签</span>
					{checkedList.length ?
						<span className='edit-label hover-color'
							onClick={() => setEditCheckedLabel(!editCheckedLabel)}
						>
							{editCheckedLabel ? '完成' : '管理'}
						</span> : null
					}
				</div>
				<ul className='label-box'>
					{checkedList.map((label: string, idx: number) => (
						<li key={'checked-' + label} title={label} className='render-checked'>
							<span className='label-text'>{label}</span>
							{editCheckedLabel ?
								<MinusCircleFilled onClick={() => deleteCheckedLabel(label)} className='delete-label-icon cursor' title='删除' /> : null
							}
						</li>
					))}
				</ul>
			</div>

			{/* -------- 自定义标签弹框 ---------- */}
			<Modal
				centered
				width={360}
				title="新增标签"
				maskClosable={false}
				open={customModalShow}
				afterClose={customModalClose}
				onOk={customModalOk}
				onCancel={() => setCustomModalShow(false)}
			>
				<div className='add-label-box'>
					<Input
						onChange={e => setNewLabel(e.target.value)}
						value={newLabel}
						maxLength={16}
						placeholder="请输入新的标签"
					/>
				</div>
			</Modal>
		</Modal>
	)
}

export default memo(MarkLabel);