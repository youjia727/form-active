import { useRef, useState, useContext, memo, useCallback } from 'react';
import { Input, Checkbox } from 'antd';
import Upload from '../Upload';
import TextAreaComponent from '../TextArea';
import { StateContext } from '../stateContext';
import DragContext from '../DragContext';
import MarkLabel from '../modal/MarkLabel';
import CheckboxLimit from '../modal/CheckboxLimit';
import LogicalRelevance from '../modal/LogicalRelevance';
import RenderImg from '@/components/RenderImg';
import { useUpdate } from '@/hooks/useUpdate';
import { PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { TextAreaRef } from 'antd/es/input/TextArea';
import useMessage from '@/hooks/useMessage';
import { baseProps, optionProps, objProps } from '@/assets/utils/formConfig/editorConfig';
import utils from '@/assets/utils';

const { TextArea } = Input;

type propTypes = {
	modal?: boolean,
	item: baseProps,
	dragClassName?: string,
	tag?: string
}

interface selectTypes extends propTypes, objProps {
	dragItem: optionProps,
	deleteOptionCallBack: Function,
	index: number
}

/* 选择项列表 */
const SelectOption = DragContext(memo((props: selectTypes) => {

	const { item, dragItem, index, listeners, move, deleteOptionCallBack } = props;
	const message = useMessage();
	const state = useContext(StateContext);

	// 更新页面
	const update = useUpdate();
	// 其他输入框的ref
	const textareaRef = useRef<TextAreaRef>(null);
	// 点击设置其他选项
	const [editOther, setEditOther] = useState(false);
	// 设置标签的弹框显示
	const [markLabelOpen, setMarkLabelOpen] = useState(false);

	/* “其他” 选项输入内容变化 */
	const handleSetOther = () => {
		setEditOther(true);
		queueMicrotask(() => {
			const { current } = textareaRef;
			const ele = current?.resizableTextArea?.textArea;
			const length = ele?.value.length || 0;
			// 设置光标到最后
			ele && ele.setSelectionRange(length, length);
			current && current?.focus();
		})
	};
	/* 其他项输入内容失去焦点 */
	const otherInputBlur = (label: string) => {
		if (!label.length) {
			dragItem.label = '其他';
		}
		setEditOther(false)
	};
	/* 删除选项 */
	const handleDeleteOption = () => {
		if (item.options.length <= 2) {
			message.warning('最少设置两个选项');
			return false;
		};
		deleteOptionCallBack(index);
	};
	/* 根据组件切换不同显示题号 */
	const numberOrder = (tag: string): JSX.Element => {
		const compTag: objProps = {
			radio: <img src='/image/form/radio-icon.png' alt='' />,
			checkbox: <img src='/image/form/checkbox-icon.png' alt='' />,
			select: <span className='select-qs-number'>{index + 1}.</span>
		};
		return compTag[tag];
	};
	/* 上传图片的回调函数, 裁剪图片的回调 */
	const editImageCallback = useCallback((url: string) => {
		update(() => {
			item.options[index].imgUrl = url;
		})
	}, []);
	/* 渲染题目关联的文字显示 */
	const renderRelevanceText = (jumpList: Array<string>) => {
		let renderText = '', count = 0;
		const list: Array<baseProps> = state?.list || [];
		for (let i = 0; i < list.length; i++) {
			if (jumpList.includes(list[i].id)) {
				renderText += (i + 1) + '、';
				count++;
			};
			if (count === jumpList.length) break;
		};
		renderText = renderText.slice(0, renderText.length - 1);
		return '已关联第 ' + renderText + ' 题';
	};
	/* 渲染选择标签的文字显示 */
	const renderMarkLabelText = (marks: Array<string>) => {
		let str = marks.join('、');
		return '已选择「 ' + str + ' 」标签';
	};
	/* 设置标签的弹框显示回调函数 */
	const cancelMarkLabelCallback = useCallback((visible: boolean, marks?: string[]) => {
		marks ? item.options[index].marks = marks : null;
		setMarkLabelOpen(visible);
	}, []);

	return (
		<>
			<div className={`select-option ${item.options.length === index + 1 ? 'bottom-option' : ''}`}>
				{/* 移动图标 */}
				<div {...listeners} ref={move} className='select-option-item-move' title='移动'>
					<img src='/image/form/vertical-move.png' alt='' />
				</div>
				{/* 选择项的配置 */}
				<div className='select-option-item'>
					<div className='select-item-index'>{numberOrder(item.tag)}</div>
					<div className='select-item-detail'>
						<div className='select-item-title'>
							{dragItem.mode === 0 ?
								/*------ 其他输入框操作内容 --------*/
								<>{editOther ?
									<TextArea ref={textareaRef} placeholder="其他" autoSize value={dragItem.label}
										onChange={e => update(() => dragItem.label = e.target.value)}
										onBlur={e => otherInputBlur(dragItem.label)}
										className="form-item-input description-input option-input"
									/> :
									<div className='setting-other' onClick={handleSetOther}>
										<span className='other-title-input'>{dragItem.label}</span>
										<span className='other-input'>填写者回答区</span>
									</div>
								}</> :
								/*------ 正常输入框操作内容 --------*/
								<TextAreaComponent tip={'选项' + (index + 1)} item={dragItem} attr='label' className="description-input option-input" />
							}
							{/*  其他项设置 set-min-width 样式 */}
							<div className={`select-item-detail-setting ${dragItem.mode === 0 || item.tag === 'select' ? 'set-min-width' : null}`}>
								{dragItem.mode === 0 || item.tag === 'select' ? null :
									<Upload uploadCallback={editImageCallback}>
										<span className='add-text primary-color'>{dragItem.imgUrl ? '替换' : '添加'}图片</span>
									</Upload>
								}
								<span onClick={() => setMarkLabelOpen(true)} className='add-text primary-color opacity'>
									{dragItem.marks.length ? '编辑' : '设置'}标签
								</span>
								<CloseOutlined onClick={handleDeleteOption} className='delete-select-item hover-color' title='删除' />
							</div>
						</div>
						{/*------------ 图片展示区 --------------  */}
						{dragItem.imgUrl ? <RenderImg list={[dragItem.imgUrl]} align='left'
							deleteCallback={() => editImageCallback('')} cropCallback={editImageCallback}
						/> : null
						}
						{/* ----------------- 展示关联的信息 ------------------- */}
						{dragItem.jumpTo.length ?
							<div className='jump-info-text'>{renderRelevanceText(dragItem.jumpTo)}</div> : null
						}
						{/* ----------------- 展示标签的信息 ------------------- */}
						{dragItem.marks.length ?
							<div className='jump-info-text'>{renderMarkLabelText(dragItem.marks)}</div> : null
						}
					</div>
				</div>
			</div>
			{/* 设置标签 */}
			{markLabelOpen ? <MarkLabel open={markLabelOpen} marks={item.options[index].marks} cancel={cancelMarkLabelCallback} /> : null}
		</>
	)
}));

/* 选择题组件 */
const ViewSelect = (props: propTypes) => {

	const { item, modal, tag } = props;
	const state = useContext(StateContext);

	// 更新页面
	const update = useUpdate();
	// 多选题选择数量弹框显示
	const [checkLimitOpen, setCheckLimitOpen] = useState(false);
	// 题目关联的弹框显示
	const [relevanceOpen, setRelevanceOpen] = useState(false);

	/* 拖拽修改顺序 */
	const dragChangeCallback = (changeList: Array<optionProps>) => {
		update(() => {
			item.options = changeList;
		})
	};
	/* 添加选项 */
	const handleAddOption = (mode: number) => {
		const optionIds: Array<number> = item.options.map((item: optionProps) => item.id);
		// 获取选项中最大的id值
		const idMax = Math.max(...optionIds);
		const optionItem: optionProps = {
			mode,
			label: mode ? '' : '其他',
			marks: [],
			id: idMax + 1,
			imgUrl: '',
			jumpTo: []
		};
		// 如果设置其他项，显示数据时候布局就只能为 1 列
		// 正常选择项根据内容设置显示的列数
		update(() => {
			item.options.push(optionItem);
		})
	};
	/* 删除选项的回调 */
	const deleteOptionCallBack = (idx: number) => {
		update(() => {
			item.options.splice(idx, 1);
		})
	};
	/* 是否显示设置其他项 */
	const showSetOther = (opts: Array<optionProps>, mode: number) => {
		return opts.some((col: optionProps) => col.mode === mode);
	};
	/* 限制多选题选择数量的弹框显示回调函数 */
	const cancelCheckLimitCallback = useCallback((visible: boolean, limitObj?: objProps) => {
		if (limitObj) {
			item.max = limitObj.max ? limitObj.max : null;
			item.min = limitObj.min ? limitObj.min : null;
		}
		setCheckLimitOpen(visible);
	}, []);
	/* 循环 删除、添加 关联源数据 */
	const setJumpedFilterCallback = <T,>(jumpList: Array<T>, optId: number, type: string) => {
		if (!jumpList.length) return;
		const list: Array<baseProps> = state?.list || []; // 所有表单数据
		jumpList.forEach(sourceId => {
			// 表单跳转到的题，比如 1题(必须是选择题)跳转到2题，setJumpedItem代表2题
			const setJumpedItem = utils.find(list, sourceId);
			if (setJumpedItem) {
				// 'lgq9vw8s-1' 代表1题的id lgq9vw8s，1代表1题中选项的id
				const sourceJumpItem = item.id + '-' + optId;
				if (type === 'add') {
					// 增加跳转源选项
					setJumpedItem.isSetJumped.push(sourceJumpItem);
				} else {
					// 删除跳转源选项 这儿有问题
					const newSetJumpedList = utils.remove(setJumpedItem.isSetJumped, sourceJumpItem);
					setJumpedItem.isSetJumped = newSetJumpedList;
				}
			}
		})
	};
	/* 设置关联的跳转源数据 */
	const setJumpSource = (arr1: Array<string>, arr2: Array<string>, optId: number) => {
		const jumpAll = utils.onlyArray([...arr1, ...arr2]);
		// 需要删除关联源的列表
		const deleteJumpToList: Array<string> = [];
		// 需要添加关联源的列表
		const addJumpToList: Array<string> = [];
		for (let i = 0; i < jumpAll.length; i++) {
			const t = jumpAll[i];
			// 找出原关联与当前关联的不同项
			if (!(arr1.includes(t) && arr2.includes(t))) {
				arr2.includes(t) ? addJumpToList.push(t) : deleteJumpToList.push(t);
			}
		};
		// 循环删除需要删除的关联源数据
		setJumpedFilterCallback(deleteJumpToList, optId, 'delete');
		// 循环添加需要添加的关联源数据
		setJumpedFilterCallback(addJumpToList, optId, 'add');
	};
	/* 题目关联的弹框显示回调函数 */
	const cancelRelevanceCallback = (visible: boolean, optList?: Array<optionProps>) => {
		if (optList) {
			// 设置关联的跳转源数据
			optList.forEach((opt, idx) => {
				setJumpSource(item.options[idx].jumpTo, opt.jumpTo, opt.id)
			})
			item.options = optList;
		};
		setRelevanceOpen(visible);
	};
	/* 限制选项数量 */
	const checkboxLimitText = <T, U>(max: T, min: U): string => {
		if (max && min) return '「最多选择 ' + max + ' 、最少选择 ' + min + ' 」项';
		if (max) return '「最多选择 ' + max + ' 」项';
		if (min) return '「最少选择 ' + min + ' 」项';
		return '限制选项数量';
	};
	/* 下拉题多选设置 */
	const selectMultipleChange = () => {
		update(() => {
			item.multiple = !item.multiple;
		})
	};

	return (
		<>
			<div className='select-drag-wrapper'>
				<SelectOption list={item.options} item={item} dragChangeCallback={dragChangeCallback}
					deleteOptionCallBack={deleteOptionCallBack} bound='parent' dragClassName='select-dragging' />
			</div>
			<div className="form-item-setting">
				<div className='setting-block opacity' onClick={() => handleAddOption(1)}>
					<PlusCircleOutlined className='icon-block' />
					<span>添加选项</span>
				</div>
				{!showSetOther(item.options, 0) ?
					<>
						<div className='split-add'></div>
						<div onClick={() => handleAddOption(0)} className='setting-block opacity'>
							<span>添加“其他”项</span>
						</div>
					</> : null
				}
				{!modal ?
					<>
						<div className='split-add'></div>
						<div onClick={() => setRelevanceOpen(true)} className='setting-block opacity'>
							<span>设置题目关联</span>
						</div>
					</> : null
				}
				{tag === 'select' ?
					<>
						<div className='split-add'></div>
						<div className='setting-block opacity'>
							<span onClick={selectMultipleChange}>多选</span>
							<Checkbox checked={item.multiple} className='multiple-checkbox' onChange={selectMultipleChange}></Checkbox>
						</div>
					</> : null
				}
				{item.multiple ?
					<>
						<div className='split-add'></div>
						<div onClick={() => setCheckLimitOpen(true)} className='setting-block opacity'>
							<span>{checkboxLimitText(item.max, item.min)}</span>
						</div>
					</> : null
				}
			</div>

			{/* 设置题目关联 */}
			{relevanceOpen ? <LogicalRelevance id={item.id} open={relevanceOpen} options={item.options} cancel={cancelRelevanceCallback} /> : null}

			{/* 多选题限制选择数量 */}
			{checkLimitOpen ? <CheckboxLimit options={item.options} min={item.min} max={item.max} open={checkLimitOpen} cancel={cancelCheckLimitCallback} /> : null}
		</>
	)
}

export default memo(ViewSelect);