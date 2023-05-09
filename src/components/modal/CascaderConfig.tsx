import { useState, useRef } from 'react';
import { PlusCircleOutlined, MinusCircleOutlined, RightOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Modal, Input, Select } from 'antd';
import utils from '@/assets/utils';
import { useUpdate } from '@/hooks/useUpdate';
import { options } from '@/assets/utils/tree';
import useMessage from '@/hooks/useMessage';
import { baseProps, cascaderModeTypes } from '@/assets/utils/formConfig/editorConfig';
import '@/assets/style/modal.less';

type objProps = {
	[key: string]: any
}

type propTypes = {
	open: boolean,
	cancel: Function,
	item: baseProps
}

type cascaderOptionTypes = {
	value: string,
	text: string,
	children?: Array<cascaderOptionTypes>
}

// 层级联动配置
const cascaderModeList = [{
	label: 'levelOne',
	placeholder: ''
}, {
	label: 'levelTwo',
	placeholder: ''
}, {
	label: 'levelThree',
	placeholder: ''
}, {
	label: 'levelFour',
	placeholder: ''
}];

// 截取树的节点
function treeDataSlice<T,>(treeList: Array<T>, level: number) {
	if (!treeList || !treeList.length) return;
	level--;
	for (let i = 0; i < treeList.length; i++) {
		const ele = treeList[i] as objProps;
		if (!level) {
			delete ele.children;
		}
		level && treeDataSlice(ele.children, level);
	}
};
// 生成树形结构数据
function initTreeData<T,>(treeList: Array<T>, level: number) {
	if (level === 4) return options;
	// 深拷贝一份
	const cloneTreeList = utils.deepClone(treeList);
	treeDataSlice(cloneTreeList, level);
	return cloneTreeList;
};
// 树结构的节点
function addTreeData(level: number) {
	const treeNode: cascaderOptionTypes = {
		value: '',
		text: ''
	}
	if (level === 1) return treeNode;
	level--;
	treeNode['children'] = [addTreeData(level), addTreeData(level)];
	return treeNode;
};

const numArrIndex = ['一', '二', '三', '四'];

function CascaderConfig(props: propTypes) {

	const { open, cancel, item } = props;

	// console.log('item===========', item)

	const selectRef = useRef(null);
	const message = useMessage();

	const update = useUpdate();
	// 控制弹框显示
	const [show, setShow] = useState(open);
	// 选择层级联动次数
	const [visible, setVisible] = useState(false);
	// 当前编辑的列索引
	const [idxObj, setIdxObj] = useState({
		idx0: 0,
		idx1: 0,
		idx2: 0,
		idx3: 0
	})
	// 层级联动级数
	const [count, setCount] = useState<number>(item.levelCount || 3);
	// 层级联动显示数据
	const [cascaderMode, setCascaderMode] = useState<Array<cascaderModeTypes>>(item.cascaderMode);
	// 层级联动列表
	const [cascaderOption, setCascaderOption] = useState<Array<cascaderOptionTypes>>(() => {
		return item.options.length ? item.options : initTreeData(options, count);
	});


	/* 标题输入框内容发生变化 */
	const titleInputChange = (value: string, idx: number) => {
		setCascaderMode(preList => {
			const newList = utils.deepClone(preList);
			newList[idx].placeholder = value;
			return newList;
		})
	};
	/* 筛选出需要修改的层级下标索引 */
	const levelNumberCallback = (idx: number) => {
		const arr = [0, 1, 2, 3];
		return arr.filter(el => el > idx);
	};
	/* 当前选项选中 */
	const handleSelectActive = (idx: number, optIdx: number) => {
		const newObj = { ...idxObj };
		const newArr = levelNumberCallback(idx);
		// 修改当前选中项，后面层级选中第一个
		for (let i = 0; i < newArr.length; i++) {
			newObj[('idx' + newArr[i]) as keyof typeof idxObj] = 0;
		}
		// 设置当前选中状态
		newObj[('idx' + idx) as keyof typeof idxObj] = optIdx;
		setIdxObj(newObj);
	};
	/* 生成当前显示选项列表 */
	const treeListCallback = (treeList: Array<cascaderOptionTypes> = [], idx: number): Array<cascaderOptionTypes> => {
		if (!idx) return treeList;
		let renderCascaderOptions: Array<cascaderOptionTypes> = [];
		for (let i = 0; i < idx; i++) {
			// 上一层级选中的索引值
			const preEditIdx = idxObj[('idx' + i) as keyof typeof idxObj];
			// 上一层级的孩子列表
			renderCascaderOptions = (renderCascaderOptions.length ? renderCascaderOptions[preEditIdx].children : treeList[preEditIdx].children) ?? [];
		}
		return renderCascaderOptions;
	};
	/* 级联列表显示 */
	const renderListCallback = (idx: number, treeList?: Array<cascaderOptionTypes>) => {
		return treeListCallback(treeList ?? utils.deepClone(cascaderOption), idx);
	};
	/* 修改层级选项的数据（input输入） */
	const editCascaderOptionValue = (treeList: Array<cascaderOptionTypes> = [], value: string, idx: number, optIdx: number) => {
		const newList = renderListCallback(idx, treeList);
		newList[optIdx].text = value;
		newList[optIdx].value = value;
		return treeList;
	};
	/* 选项输入框内容变化 */
	const cascaderInputChange = (value: string, idx: number, optIdx: number) => {
		const newData = editCascaderOptionValue(utils.deepClone(cascaderOption), value, idx, optIdx);
		setCascaderOption(newData);
	};
	/* 点击选择层级联动变化的图标 */
	const handleSelect = () => {
		const { current } = selectRef;
		current && (current as objProps).focus();
	};
	/* 返回增加节点的新树结构 */
	const addTreeNodeCallback = <T,>(treeList: Array<T>, level: number): Array<T> => {
		for (let i = 0; i < treeList.length; i++) {
			const element = treeList[i] as cascaderOptionTypes;
			if (!element.children) {
				// 增加新节点到树上结构
				const treeNode = addTreeData(level);
				element['children'] = [treeNode, treeNode];
			} else {
				addTreeNodeCallback(element.children, level);
			}
		}
		return treeList;
	};
	/* 增加节点标题 */
	const addTreeOptionTitle = <T,>(modeList: Array<T>, level: number): Array<T> => {
		const sliceList = cascaderModeList.slice(modeList.length);
		const newModeList = [...modeList];
		for (let i = 0; i < level; i++) {
			const element = sliceList[i] as T;
			newModeList.push(element)
		}
		return newModeList;
	};
	/* 选择层级联动级数变化 */
	const handleChange = (value: number) => {
		let treeData: Array<cascaderOptionTypes> = [];
		let newCascaderMode: Array<cascaderModeTypes> = [];
		if (value > count) {
			// 增加节点
			treeData = addTreeNodeCallback(cascaderOption, value - count); //增加节点树
			newCascaderMode = addTreeOptionTitle(cascaderMode, value - count); // 增加节点标题
		} else {
			// 删除节点
			treeData = initTreeData(cascaderOption, value); //删除节点树
			newCascaderMode = [...cascaderMode].slice(0, value); // 删除节点标题
		}
		handleSelectActive(0, 0);
		setCascaderOption(treeData);
		setCascaderMode(newCascaderMode);
		setCount(value);
	};
	/* 增加选项的回调函数 */
	const editCascaderOptionCallback = (treeList: Array<cascaderOptionTypes>, level: number, type: string, treeNode?: cascaderOptionTypes, optIdx?: number) => {
		const cloneTreeList = utils.deepClone(treeList);
		let childrenList: Array<cascaderOptionTypes> = [];
		for (let i = 0; i < level; i++) {
			// 上一层级选中的索引值
			const preEditIdx = idxObj[('idx' + i) as keyof typeof idxObj];
			childrenList = (childrenList.length ? childrenList[preEditIdx].children : cloneTreeList[preEditIdx].children) || [];
		}
		// 限制至少设置一个选项
		if (type === 'delete' && childrenList.length <= 1) {
			message.info('至少设置一个选项');
			return false;
		}
		type === 'add' ? childrenList.push(treeNode as cascaderOptionTypes) : childrenList.splice(optIdx as number, 1);
		setCascaderOption(cloneTreeList);
	};
	/* 添加层级的选项 */
	const handleAddCascaderOption = (idx: number) => {
		const levelList = cascaderMode.map((el, i) => i + 1).reverse();
		const treeNode = addTreeData(levelList[idx]); //当前选项节点
		// 如果是第一级就直接添加，其它级需要插入到上一级选中的children中
		idx ? editCascaderOptionCallback(cascaderOption, idx, 'add', treeNode) : setCascaderOption([...cascaderOption, treeNode]);
	};
	/* 删除层级选项 */
	const handleDeleteCascaderOption = (level: number, optIdx: number) => {
		const cloneCascaderOption = [...cascaderOption];
		if (!level) {
			// 限制至少设置一个选项
			if (cloneCascaderOption.length <= 1) {
				message.info('至少设置一个选项');
				return false;
			}
			// 如果是第一级就直接删除选项
			cloneCascaderOption.splice(optIdx, 1);
			setCascaderOption(cloneCascaderOption);
		} else {
			// 如果是其它层级就需要找到上一节点children的列表，再删除当前选项
			editCascaderOptionCallback(cascaderOption, level, 'delete', undefined, optIdx);
		}
	};
	/* 点击确认操作 */
	const handleOk = () => {
		setShow(false);
	};
	/* modal框完全关闭之后 */
	const afterClose = () => {
		// 关闭弹框，并且传递数据
		// let ruleObj = {
		// 	options: clone.options,
		// 	fieldNames: clone.fieldNames,
		// 	cascaderPlaceholder: clone.cascaderPlaceholder,
		// 	mode: clone.mode
		// }
		cancel(false);
	};

	return (
		<Modal
			centered
			width={count > 3 ? 1060 : 812}
			title="请设置选项"
			maskClosable={false}
			open={show}
			afterClose={afterClose}
			onOk={handleOk}
			onCancel={() => setShow(false)}
		>
			<div className='cascader-container'>
				<div className='cascader-config-wrapper'>
					{cascaderMode.map((ele, idx) => (
						<div className='cascader-config-item' key={ele.label}>
							<div className={`cascader-select-wrapper ${cascaderMode.length === idx + 1 ? 'last-cascader-select' : ''}`}>
								<Input className='form-item-input cascader-title'
									value={ele.placeholder} onChange={e => titleInputChange(e.target.value, idx)}
									placeholder={numArrIndex[idx] + '级标题名称'}
								/>
								{renderListCallback(idx).map((opt: cascaderOptionTypes, i: number) => (
									<div className='cascader-select-item' key={'cascader-select-' + idx + '-' + i}>
										<MinusCircleOutlined className='cascader-option-icon hover-color' title='删除' onClick={() => handleDeleteCascaderOption(idx, i)} />
										<div className={`input-wrapper ${idxObj[('idx' + idx) as keyof typeof idxObj] === i ? 'cascader-option-active' : ''}`}
											onClick={() => handleSelectActive(idx, i)}>
											<Input value={opt.text} onChange={e => cascaderInputChange(e.target.value, idx, i)} placeholder={numArrIndex[idx] + '级选项名称'} />
											{cascaderMode.length === idx + 1 ? null : <RightOutlined className='cascader-right-icon' />}
										</div>
									</div>
								))}
							</div>
							<div className='cascader-add-wrapper'>
								<div className='cursor' onClick={() => handleAddCascaderOption(idx)}>
									<PlusCircleOutlined className='add-cascader-item-icon' />
									<span>添加选项</span>
								</div>
							</div>
						</div>
					))}
				</div>
				{/* 选择联动的级数 */}
				<div className='select-cascader-level'>
					<span>下拉框级数</span>
					<Select
						ref={selectRef}
						value={count}
						size='small'
						open={visible}
						onClick={() => setVisible(!visible)}
						onBlur={() => setVisible(false)}
						popupClassName='select-cascader-level-popover'
						suffixIcon={<CaretDownOutlined onClick={handleSelect} style={{ fontSize: 10 }} />}
						style={{ width: 64 }}
						dropdownMatchSelectWidth={100}
						onChange={handleChange}
						options={[
							{ value: 2, label: 2 },
							{ value: 3, label: 3 },
							{ value: 4, label: 4 }
						]}
					/>
					<span>级</span>
				</div>
			</div>
		</Modal>
	)
}

export default CascaderConfig;