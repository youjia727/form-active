import { useState } from 'react';
import { PlusCircleOutlined, MinusCircleOutlined, RightOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Modal, Input, Select } from 'antd';
import utils from '@/assets/utils';
import { useUpdate } from '@/hooks/useUpdate';
import { options } from '@/assets/utils/tree';
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
const cascaderMode = [{
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
}]

// 将字符串转换成js执行
function stringToJs(str: string) {
	return new Function('return ' + str)();
};

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

// 返回列表显示
function treeListCallback<T,>(treeList: Array<T> = [], idx: number): any {
	if (!idx) return treeList;
	idx--;
	return treeListCallback(((treeList[idx]) as cascaderOptionTypes)?.children || [], idx)
};

// 修改层级选项的数据（input输入）
function editCascaderOptionValue(treeList: Array<cascaderOptionTypes> = [], value: string, idx: number, optIdx: number): Array<cascaderOptionTypes> {
	const newList = treeListCallback(treeList, idx);
	newList[optIdx].text = value;
	newList[optIdx].value = value;
	return treeList;
};

// 生成树形结构数据
function initTreeData<T,>(treeList: Array<T>, level: number) {
	if (level === 4) return options;
	// 深拷贝一份
	const cloneTreeList = utils.deepClone(treeList);
	treeDataSlice(cloneTreeList, level);
	console.log(cloneTreeList)
	return cloneTreeList;
};

const numArrIndex = ['一', '二', '三', '四'];

function CascaderConfig(props: propTypes) {

	const { open, cancel, item } = props;

	// console.log('item===========', item)

	const update = useUpdate();

	const [show, setShow] = useState(open);

	// 当前编辑的列索引
	const [idxObj, setIdxObj] = useState({
		idx1: 0,
		idx2: 0,
		idx3: 0,
		idx4: 0
	})
	// 层级联动级数
	const [count, setCount] = useState<number>(item.levelCount || 3);
	// 层级联动显示数据
	const [cascaderMode, setCascaderMode] = useState<Array<cascaderModeTypes>>(item.cascaderMode);
	// 层级联动列表
	const [cascaderOption, setCascaderOption] = useState(() => {
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
	/* 当前选项选中 */
	const handleSelectActive = (idx: number, optIdx: number) => {
		const newObj = { ...idxObj };
		const arr = [0, 1, 2, 3];
		const newArr = arr.filter(el => el > idx);
		// 修改当前选中项，后面层级选中第一个
		for (let i = 0; i < newArr.length; i++) {
			newObj[('idx' + (newArr[i] + 1)) as keyof typeof idxObj] = 0;
		}
		// 设置当前选中状态
		newObj[('idx' + (idx + 1)) as keyof typeof idxObj] = optIdx;
		setIdxObj(newObj);
	};
	/* 选项输入框内容变化 */
	const cascaderInputChange = (value: string, idx: number, optIdx: number) => {
		const newData = editCascaderOptionValue(utils.deepClone(cascaderOption), value, idx, optIdx);
		setCascaderOption(newData);
	};
	/* 选择层级联动级数变化 */
	const handleChange = (value: number) => {
		setCount(value);
	};
	/* 级联列表显示 */
	const renderListCallback = (idx: number) => {
		console.log('idx=======', idx)
		return treeListCallback(cascaderOption, idx);
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
							<div className='cascader-select-wrapper'>
								<Input className='form-item-input cascader-title'
									value={ele.placeholder} onChange={e => titleInputChange(e.target.value, idx)}
									placeholder={numArrIndex[idx] + '级标题名称'}
								/>
								{renderListCallback(idx).map((opt: cascaderOptionTypes, i: number) => (
									<div className='cascader-select-item' key={'cascader-select-' + idx + '-' + i}>
										<MinusCircleOutlined className='cascader-option-icon hover-color' title='删除' />
										<div className={`input-wrapper ${idxObj[('idx' + (idx + 1)) as keyof typeof idxObj] === i ? 'cascader-option-active' : ''}`} onClick={() => handleSelectActive(idx, i)}>
											<Input value={opt.text} onChange={e => cascaderInputChange(e.target.value, idx, i)} placeholder={numArrIndex[idx] + '级选项名称'} />
											{cascaderMode.length === idx + 1 ? null : <RightOutlined className='cascader-right-icon' />}
										</div>
									</div>
								))}
							</div>
							<div className='cascader-add-wrapper'>
								<div className='opacity'>
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
						value={count}
						size='small'
						popupClassName='select-cascader-level-popover'
						suffixIcon={<CaretDownOutlined style={{ fontSize: 10 }} />}
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