import { memo, useState, useContext, useMemo } from 'react';
import { Modal, Popover, Checkbox, Space, Button, Empty } from 'antd';
import { StateContext } from '../stateContext';
import utils from '@/assets/utils';
import { CaretDownOutlined } from '@ant-design/icons';
import { optionProps, baseProps } from '@/assets/utils/formConfig/editorConfig';
import '@/assets/style/modal.less';

type propTypes = {
	open: boolean,
	cancel: Function,
	id: string,
	options: Array<optionProps>
}

type attrTypes = {
	option: optionProps,
	renderList: {
		index: number,
		list: Array<baseProps>
	}
}

/* 关联选项数据 */
const LogicalList = (attrs: attrTypes) => {

	const { option, renderList } = attrs;
	const state = useContext(StateContext);
	// 选中数据
	const [checkedValue, setCheckedValue] = useState<Array<string>>([]);
	// 是否展开popover
	const [open, setOpen] = useState(false);

	/* 点击下拉展示框 确认, 取消所有关联 操作 */
	const bindRelevance = (visible: boolean) => {
		let jumpToList = [...checkedValue];
		if (jumpToList.length) {
			// 给关联的数据排序，可能存在选择4，3，2 排序成2，3，4
			let sortList = jumpToList.map(id => ({ id, idx: renderList.list.findIndex((el: baseProps) => el.id === id) }))
			sortList = sortList.sort((a, b) => a.idx - b.idx);
			jumpToList = sortList.map(item => item.id);
		};
		option.jumpTo = visible ? jumpToList : [];
		setOpen(false);
	};
	/* 展示选中关联的数据 */
	const renderCheckedText = (checkedId: string) => {
		const formItem = renderList.list.find((item: baseProps) => item.id === checkedId);
		if (!formItem) return '请设置关联题目';
		const idx = state?.list.findIndex((item: baseProps) => item.id === checkedId);
		return idx + 1 + '.' + (formItem.title || '未设置题名');
	};

	// 关联题目内容
	const RelevanceContent = () => (
		<ul className='relevance-component-content'>
			{renderList.list.length ?
				<>
					<Checkbox.Group onChange={values => setCheckedValue(values as Array<string>)} value={checkedValue}>
						{renderList.list.map((col: baseProps, idx: number) => (
							<div className='relevance-check-item' key={'relevance-' + col.id}>
								<Checkbox value={col.id} className='relevance-checkbox'>
									<span className='relevance-text'>{renderList.index + idx + 1}. {col.title || '未设置题名'}</span>
								</Checkbox>
							</div>
						))}
					</Checkbox.Group>
					<div className='relevance-foother'>
						<Space size={10}>
							<Button onClick={() => bindRelevance(false)} size='small' disabled={!checkedValue.length}>
								取消所有关联
							</Button>
							<Button onClick={() => bindRelevance(true)} size='small' type="primary">确定</Button>
						</Space>
					</div>
				</> : <Empty style={{ fontSize: 12, marginBottom: 10 }} />
			}
		</ul>
	);

	return (
		<Popover title='选择题目' arrow={false} placement='bottom' trigger='click' open={open} onOpenChange={visible => setOpen(visible)}
			content={<RelevanceContent />} overlayClassName='relevance-check-wrapper'>
			<div className='attch-box' onClick={() => setCheckedValue(option.jumpTo)}>
				<div className='attch-select'>
					{option.jumpTo.length ?
						<>
							{option.jumpTo.map((jumpId: string) => (
								<p key={'relevance-check-render-' + jumpId} >{renderCheckedText(jumpId)}</p>
							))}
						</> : <p>请设置关联题目</p>
					}
				</div>
				<CaretDownOutlined className='caret-down-icon' />
			</div>
		</Popover>
	)
};

/* 逻辑关联的弹框 */
function LogicalRelevance(props: propTypes) {

	const { id, open, cancel, options } = props;
	const state = useContext(StateContext);

	const [show, setShow] = useState(open);
	const [btnType, setBtnType] = useState('cancel');
	/* 深拷贝一份选项数组，以免关联操作影响原数据 */
	const relevanceOpts = useMemo(() => utils.deepClone(options), []);
	// 下拉选择关联的列表
	const renderPopover = useMemo(() => {
		const index = state?.list.findIndex((item: baseProps) => item.id === id);
		let list = index !== -1 ? state?.list.slice(index + 1) : [];
		return {
			index: index + 1,
			list
		};
	}, []);

	/**
	 * * 自定义函数
	 *  */
	/* 点击确认操作 */
	const handleOk = () => {
		// 关闭弹框，并且传递数据
		setShow(false);
		setBtnType('ok');
	};
	/* modal框完全关闭之后 */
	const afterClose = () => {
		cancel(false, btnType === 'ok' ? relevanceOpts : undefined);
	};

	return (
		<Modal centered title="设置题目关联" maskClosable={false} open={show} width={680}
			afterClose={afterClose} onOk={handleOk} onCancel={() => setShow(false)}>
			<div className='checkbox-relevance-wrapper'>
				<div className='notice'>
					<p>1. 支持一个选项关联一个或多个题目；</p>
					<p>2. 设置关联的题目需要排序在被关联题目之前，否则无法设置关联题目；</p>
					<p>3. 当填写者选中指定项时，被关联题目才会展示；</p>
				</div>
				<div className='table-box'>
					<table className='attch-table'>
						<thead>
							<tr>
								<td>选项</td>
								<td>关联题目</td>
							</tr>
						</thead>
						<tbody>
							{relevanceOpts.map((option: optionProps, idx: number) => (
								<tr key={option.id}>
									<td>
										<div className='relevance-option-title'>
											{option.label ? option.label : (option.mode === 0 ? '其他' : '选项' + (idx + 1))}
										</div>
									</td>
									<td>
										<LogicalList option={option} renderList={renderPopover} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Modal>
	)
}

export default memo(LogicalRelevance);