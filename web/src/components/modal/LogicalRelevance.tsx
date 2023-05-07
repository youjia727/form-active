import { memo, useState, useContext, useMemo, useRef } from 'react';
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


/* 逻辑关联的弹框 */
function LogicalRelevance(props: propTypes) {

	const domRef = useRef<HTMLDivElement>(null);

	const { id, open, cancel, options } = props;

	const state = useContext(StateContext);

	const [show, setShow] = useState(open);
	const [btnType, setBtnType] = useState('cancel');
	/* 深拷贝一份选项数组，以免关联操作影响原数据 */
	const [relevanceOpts, setRelevanceOpts] = useState(() => utils.deepClone(options));
	// 下拉关联选中
	const [checkedList, setCheckedList] = useState<Array<string>>([]);
	// 下拉选择关联的列表
	const renderPopover = useMemo(() => {
		const index = state?.list.findIndex((item: baseProps) => item.id === id);
		let list = index !== -1 ? state?.list.slice(index + 1) : [];
		return {
			index: index + 1,
			list
		};
	}, [open])


	/**
	 * * 自定义函数
	 *  */
	/* 选择关联数组的变化 */
	const onChange = (values: Array<string>) => {
		setCheckedList(values);
	};
	/* 点击下拉展示框 确认, 取消所有关联 操作 */
	const bindRelevance = (visible: boolean, idx: number) => {
		let jumpToList = [...checkedList];
		if (jumpToList.length) {
			// 给关联的数据排序，可能存在选择4，3，2 排序成2，3，4
			let sortList = jumpToList.map(id => ({ id, idx: renderPopover.list.findIndex((el: baseProps) => el.id === id) }))
			sortList = sortList.sort((a, b) => a.idx - b.idx);
			jumpToList = sortList.map(item => item.id);
		};
		const opts = [...relevanceOpts];
		opts[idx].jumpTo = visible ? jumpToList : [];
		setRelevanceOpts(opts);
		const { current } = domRef;
		// 关闭选择关联的下拉框
		queueMicrotask(() => {
			current && current?.click();
		})
	};
	/* 展示选中关联的数据 */
	const renderCheckedText = (checkedId: string) => {
		const formItem = renderPopover.list.find((item: baseProps) => item.id === checkedId);
		if (!formItem) return '请设置关联题目';
		const idx = state?.list.findIndex((item: baseProps) => item.id === checkedId);
		const index = idx + 1;
		return index + '.' + (formItem.title || '未设置题名');
	};
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

	/* 关联题目选择列表 */
	const RelevanceContent = (param: { index: number }) => (
		<ul className='relevance-component-content' onClick={e => e.stopPropagation()}>
			{renderPopover.list.length ?
				<>
					<Checkbox.Group onChange={values => onChange(values as Array<string>)} value={checkedList}>
						{renderPopover.list.map((col: baseProps, idx: number) => (
							<div className='relevance-check-item' key={'relevance-' + col.id}>
								<Checkbox value={col.id} className='relevance-checkbox'>
									<span className='relevance-text'>{renderPopover.index + idx + 1}. {col.title || '未设置题名'}</span>
								</Checkbox>
							</div>
						))}
					</Checkbox.Group>
					<div className='relevance-foother'>
						<Space size={10}>
							<Button onClick={() => bindRelevance(false, param.index)} size='small'
								disabled={!checkedList.length}
							>取消所有关联</Button>
							<Button onClick={() => bindRelevance(true, param.index)} size='small' type="primary">确定</Button>
						</Space>
					</div>
				</>
				: <Empty style={{ fontSize: 12, marginBottom: 10 }} />
			}
		</ul>
	);

	return (
		<Modal
			centered
			title="设置题目关联"
			maskClosable={false}
			open={show}
			width={680}
			afterClose={afterClose}
			onOk={handleOk}
			onCancel={() => setShow(false)}
		>
			<div className='checkbox-relevance-wrapper'>
				<div className='notice' ref={domRef}>
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
							{relevanceOpts.map((item: optionProps, idx: number) => (
								<tr key={item.id}>
									<td>
										<div className='relevance-option-title'>
											{item.label ? item.label : (item.mode === 0 ? '其他' : '选项' + (idx + 1))}
										</div>
									</td>
									<td>
										<Popover
											title='选择题目'
											arrow={false}
											placement='bottom'
											content={<RelevanceContent index={idx} />}
											overlayClassName='relevance-check-wrapper'
											trigger='click'
										>
											<div className='attch-box'
												onClick={() => setCheckedList(relevanceOpts[idx].jumpTo)}
											>
												<div className='attch-select'>
													{item.jumpTo.length ?
														<>
															{item.jumpTo.map((jumpId: string) => (
																<p key={'relevance-check-render-' + jumpId} >{renderCheckedText(jumpId)}</p>
															))}
														</> : <p>请设置关联题目</p>
													}
												</div>
												<CaretDownOutlined className='caret-down-icon' />
											</div>
										</Popover>
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