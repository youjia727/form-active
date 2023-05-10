import {useState, useRef} from 'react';
import {PlusCircleOutlined, MinusCircleOutlined, RightOutlined, CaretDownOutlined} from '@ant-design/icons';
import {Modal, Input, Select} from 'antd';
import utils from '@/assets/utils';
<<<<<<< HEAD
import { treeOptions } from '@/assets/utils/tree';
import useMessage from '@/hooks/useMessage';
import { baseProps, cascaderModeTypes, objProps } from '@/assets/utils/formConfig/editorConfig';
import '@/assets/style/modal.less';

=======
import {options} from '@/assets/utils/tree';
import useMessage from '@/hooks/useMessage';
import {baseProps, cascaderModeTypes} from '@/assets/utils/formConfig/editorConfig';
import '@/assets/style/modal.less';

type objProps = {
    [key: string]: any
}

>>>>>>> 061f2b8b8c1725a066fd69908956b1d2e78cc6b5
type propTypes = {
    open: boolean,
    cancel: Function,
    item: baseProps
}

type cascaderOptionTypes = {
    value: string,
    text: string,
    children?: Array<cascaderOptionTypes>,
    [key: string]: any
}

// 层级联动配置
const cascaderModeList = [{
    label: 'levelOne',
    text: ''
}, {
    label: 'levelTwo',
    text: ''
}, {
    label: 'levelThree',
    text: ''
}, {
    label: 'levelFour',
    text: ''
}];

// 截取树的节点
<<<<<<< HEAD
function treeDataSlice<T,>(treeList: Array<T>, level: number) {
	if (!treeList || !treeList.length) return;
	level--;
	for (let i = 0; i < treeList.length; i++) {
		const ele = treeList[i] as cascaderOptionTypes;
		if (!level) {
			delete ele.children;
		} else {
			treeDataSlice(ele?.children || [], level);
		}
	}
=======
function treeDataSlice<T, >(treeList: Array<T>, level: number) {
    if (!treeList || !treeList.length) return;
    level--;
    for (let i = 0; i < treeList.length; i++) {
        const ele = treeList[i] as objProps;
        if (!level) {
            delete ele.children;
        }
        level && treeDataSlice(ele.children, level);
    }
>>>>>>> 061f2b8b8c1725a066fd69908956b1d2e78cc6b5
};

// 生成树形结构数据
<<<<<<< HEAD
function initTreeData<T,>(treeList: Array<T>, level: number) {
	const cloneTreeList = utils.deepClone(treeList); // 深拷贝一份
	treeDataSlice(cloneTreeList, level);
	return cloneTreeList;
};
// 生成节点树
function treeNodeCallback(nodeCount: number) {
	// nodeCount 节点数
	const treeNode: cascaderOptionTypes = {
		value: '',
		text: ''
	}
	if (nodeCount <= 1) return treeNode;
	nodeCount--;
	treeNode['children'] = [treeNodeCallback(nodeCount), treeNodeCallback(nodeCount)];
	return treeNode;
};
/* 返回增加节点的新树结构 */
function addTreeNodeCallback<T>(treeList: Array<T>, nodeCount: number): Array<T> {
	let newList = utils.deepClone(treeList); //深拷贝一份数据，避免操作节点引起原数据变化
	const targetNode = treeNodeCallback(nodeCount); // 生成新节点
	addTreeNode(newList, targetNode);
	// 增加节点递归函数
	function addTreeNode(list: Array<T>, targetNode: cascaderOptionTypes) {
		for (let i = 0; i < list.length; i++) {
			const element = list[i] as cascaderOptionTypes;
			if (!element.children) {
				// 增加新节点到树结构末尾
				element['children'] = [targetNode, targetNode];
			} else {
				addTreeNode(element.children as Array<T>, targetNode);
			}
		}
	}
	return newList;
=======
function initTreeData<T, >(treeList: Array<T>, level: number) {
    if (level === 4) return options;
    // 深拷贝一份
    const cloneTreeList = utils.deepClone(treeList);
    treeDataSlice(cloneTreeList, level);
    return cloneTreeList;
};
// 树结构的节点
// function addTreeData(nodeCount: number, level: number) {
// 	// nodeCount 节点数， level 层级数，从0开始
// 	const treeNode: cascaderOptionTypes = {
// 		value: '',
// 		text: '',
// 		level
// 	}
// 	if (nodeCount === 1) return treeNode;
// 	nodeCount--;
// 	treeNode['children'] = [addTreeData(nodeCount, level), addTreeData(nodeCount, level)];
// 	return treeNode;
// };

function addTreeData(nodeCount: number) {
    // nodeCount 节点数
    const treeNode: cascaderOptionTypes = {
        value: '',
        text: ''
    }
    if (nodeCount === 1) return treeNode;
    nodeCount--;
    treeNode['children'] = [addTreeData(nodeCount), addTreeData(nodeCount)];
    return treeNode;
};

// 将树形结构转换成数组
function treeToList<T>(tree: Array<T>) {
    let res: Array<T> = [];
    let id = 0;
    formateData(tree, 0);

    function formateData(tree: Array<T>, level: number, pid?: number) {
        for (let i = 0; i < tree.length; i++) {
            let count = level || 0;
            const element = tree[i] as cascaderOptionTypes;
            element['level'] = count;
            element['id'] = id;
            element['pid'] = pid;
            res.push(element as T);
            id++;
            if (element.children) {
                count++;
                formateData(element.children as Array<T>, count, element.id);
            }
        }
    }

    return res;
};

/* 返回增加节点的新树结构 todo aaa */
function addTreeNodeCallback<T>(treeList: Array<T>, level: number): Array<T> {
    return recursivelyData([...treeList],level);
>>>>>>> 061f2b8b8c1725a066fd69908956b1d2e78cc6b5
};
const recursivelyData=(list:any[],level:number)=>{
    if(level==1){
        return list.length>0?list:[addTreeData(1),addTreeData(1)]
    }
    return list.map(item=>{
        if(item.children){
            recursivelyData(item.children,level-1)
        }else {
            item.children=[addTreeData(level-1),addTreeData(level-1)]
        }
        return item
    })
}

const numArrIndex = ['一', '二', '三', '四'];

/* 层级联动数据配置 */
export default function CascaderConfig(props: propTypes) {

<<<<<<< HEAD
	const { open, cancel, item } = props;
	const selectRef = useRef(null);
	const message = useMessage();

	// 控制弹框显示
	const [show, setShow] = useState(open);
	// 是否点击确认按钮
	const [clickBtn, setClickBtn] = useState(false);
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
	// 层级联动树型列表
	const [cascaderOption, setCascaderOption] = useState<Array<cascaderOptionTypes>>(() => {
		return item.options.length ? item.options : treeOptions;
	});

	/* 标题输入框内容发生变化 */
	const titleInputChange = (value: string, idx: number) => {
		setCascaderMode(preList => {
			const newList = utils.deepClone(preList);
			newList[idx].text = value;
			return newList;
		})
	};
	/* 筛选出需要修改的层级下标索引 */
	const levelNumberCallback = (idx: number) => {
		const arr = [0, 1, 2, 3];
		return arr.filter(el => el > idx);
	};
	/* 设置当前选项选中状态 */
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
		handleSelectActive(0, 0); // 重置选中状态
		setCascaderOption(treeData);
		setCascaderMode(newCascaderMode);
		setCount(value);
	};
	/* 增加选项的回调函数 */
	const editCascaderOptionCallback = (treeList: Array<cascaderOptionTypes>, level: number, type: string, treeNode?: cascaderOptionTypes, optIdx?: number) => {
		const cloneTreeList = utils.deepClone(treeList);
		// 查询到当前显示的children列表（第一级就是树列表）
		const childrenList = treeListCallback(cloneTreeList, level);
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
		// idx为 0 -> 表示点击第一级添加选项，此时需要增加4个树节点，idx增大，节点数减少
		// 层级倒序列表 [4，3，2，1]
		const levelList = cascaderMode.map((el, i) => i + 1).reverse();
		//生成当前选项节点
		const treeNode = treeNodeCallback(levelList[idx]);
		// 如果是第一级就直接添加，其它级需要添加到上一级选中的children中
		idx ? editCascaderOptionCallback(cascaderOption, idx, 'add', treeNode) : setCascaderOption([...cascaderOption, treeNode]);
	};
	/* 删除层级选项 */
	const handleDeleteCascaderOption = (idx: number, optIdx: number) => {
		const cloneCascaderOption = [...cascaderOption];
		if (!idx) {
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
			editCascaderOptionCallback(cascaderOption, idx, 'delete', undefined, optIdx);
		};
		handleSelectActive(idx, optIdx - 1);
	};
	/* 切换到没有输入内容、或者内容相同的input填写框 */
	const editLevelIndex = (levels: Array<number>) => {
		const newObjIdx = { ...idxObj };
		levels.forEach((el, idx) => {
			newObjIdx[('idx' + idx) as keyof typeof newObjIdx] = el;
		})
		setIdxObj(newObjIdx);
	};
	/* 判断是否填写、层级中是否数据相同 */
	const validateTreeData = (treeList: Array<cascaderOptionTypes>): boolean => {
		let levalArr: Array<number> = []; //层级数组，判断没有填写数据或者相同项
		function checkTreeData(list: Array<cascaderOptionTypes>, level?: number): boolean {
			const values: Array<string> = []; //数据数组，判断是否重复
			return list.some((el, idx) => {
				let count = level || 0;
				levalArr[count] = idx;
				// 判断是否是空字符串
				if (!el.value.trim().length) {
					el.value.length > 0 ? message.info('选项内容不能为空') : message.info('请输入选项内容');
					editLevelIndex(levalArr);
					return true;
				};
				// 判断是否内容重复
				if (values.includes(el.value)) {
					message.info('选项内容重复，请修改');
					return true;
				} else {
					values.push(el.value);
				};
				// 如果有children就递归判断内容
				if (el.children) {
					count++;
					return checkTreeData(el.children, count);
				}
			});
		};
		return checkTreeData(treeList);
	};
	/* 点击确认操作 */
	const handleOk = () => {
		setShow(false);
		setClickBtn(true);
	};
	/* modal框完全关闭之后 */
	const afterClose = () => {
		if (!clickBtn) return cancel(false);
		// 关闭弹框，并且传递数据
		const configData = {
			options: cascaderOption,
			title: cascaderMode,
			count
		}
		cancel(false, configData);
	};

	return (
		<Modal
			centered
			width={count > 3 ? 1060 : 812}
			title="请设置选项"
			maskClosable={false}
			open={show}
			afterClose={afterClose}
			onOk={() => !validateTreeData(cascaderOption) && handleOk()}
			onCancel={() => setShow(false)}
		>
			<div className='cascader-container'>
				<div className='cascader-config-wrapper'>
					{cascaderMode.map((ele, idx) => (
						<div className='cascader-config-item' key={ele.label}>
							<div className={`cascader-select-wrapper ${cascaderMode.length === idx + 1 ? 'last-cascader-select' : ''}`}>
								<Input className='form-item-input cascader-title'
									value={ele.text} onChange={e => titleInputChange(e.target.value, idx)}
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
=======
    const {open, cancel, item} = props;

    // console.log('item===========', item)

    const selectRef = useRef(null);
    const message = useMessage();
    // 控制弹框显示
    const [show, setShow] = useState(open);
    // 是否点击确认按钮
    const [clickBtn, setClickBtn] = useState(false);
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
    // 层级联动树型列表
    const [cascaderOption, setCascaderOption] = useState<Array<cascaderOptionTypes>>(() => {
        return item.options.length ? item.options : initTreeData(options, count);
    });
    // 层级联动数组列表
    // const [cascaderList, setCascaderList] = useState<Array<cascaderOptionTypes>>(treeToList(cascaderOption));

    /* 标题输入框内容发生变化 */
    const titleInputChange = (value: string, idx: number) => {
        setCascaderMode(preList => {
            const newList = utils.deepClone(preList);
            newList[idx].text = value;
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
        const newObj = {...idxObj};
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
        const {current} = selectRef;
        current && (current as objProps).focus();
    };
    /* 增加节点标题 */
    const addTreeOptionTitle = <T, >(modeList: Array<T>, level: number): Array<T> => {
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
            treeData = addTreeNodeCallback(cascaderOption, value); //增加节点树
            console.log(treeData)
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
        ;
        handleSelectActive(level, optIdx - 1);
    };
    /* 判断是否有相同的值 */
    const uniqueValueCallback = (treeList: Array<cascaderOptionTypes>): boolean => {
        const values: Array<string> = []; //数据数组，判断是否重复
        return treeList.some(el => {
            // 判断是否是空字符串
            if (!el.value.trim().length) {
                el.value.length > 0 ? message.info('选项内容不能为空') : message.info('请输入选项内容');
                return true;
            }
            ;
            // 判断是否内容重复
            if (values.includes(el.value)) {
                message.info('选项内容重复，请修改')
                return true;
            } else {
                values.push(el.value);
            }
            ;
            // 如果有children就递归判断内容
            if (el.children) {
                return uniqueValueCallback(el.children);
            }
            ;
        });
    };
    /* 点击确认操作 */
    const handleOk = () => {
        if (!uniqueValueCallback(cascaderOption)) {
            setShow(false);
            setClickBtn(true);
        }
    };
    /* modal框完全关闭之后 */
    const afterClose = () => {
        if (!clickBtn) return cancel(false);
        // 关闭弹框，并且传递数据
        const configData = {
            options: cascaderOption,
            title: cascaderMode,
            count
        }
        cancel(false, configData);
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
                            <div
                                className={`cascader-select-wrapper ${cascaderMode.length === idx + 1 ? 'last-cascader-select' : ''}`}>
                                <Input className='form-item-input cascader-title'
                                       value={ele.text} onChange={e => titleInputChange(e.target.value, idx)}
                                       placeholder={numArrIndex[idx] + '级标题名称'}
                                />
                                {renderListCallback(idx).map((opt: cascaderOptionTypes, i: number) => (
                                    <div className='cascader-select-item' key={'cascader-select-' + idx + '-' + i}>
                                        <MinusCircleOutlined className='cascader-option-icon hover-color' title='删除'
                                                             onClick={() => handleDeleteCascaderOption(idx, i)}/>
                                        <div
                                            className={`input-wrapper ${idxObj[('idx' + idx) as keyof typeof idxObj] === i ? 'cascader-option-active' : ''}`}
                                            onClick={() => handleSelectActive(idx, i)}>
                                            <Input value={opt.text}
                                                   onChange={e => cascaderInputChange(e.target.value, idx, i)}
                                                   placeholder={numArrIndex[idx] + '级选项名称'}/>
                                            {cascaderMode.length === idx + 1 ? null :
                                                <RightOutlined className='cascader-right-icon'/>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='cascader-add-wrapper'>
                                <div className='cursor' onClick={() => handleAddCascaderOption(idx)}>
                                    <PlusCircleOutlined className='add-cascader-item-icon'/>
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
                        suffixIcon={<CaretDownOutlined onClick={handleSelect} style={{fontSize: 10}}/>}
                        style={{width: 64}}
                        dropdownMatchSelectWidth={100}
                        onChange={handleChange}
                        options={[
                            {value: 2, label: 2},
                            {value: 3, label: 3},
                            {value: 4, label: 4}
                        ]}
                    />
                    <span>级</span>
                </div>
            </div>
        </Modal>
    )
}

export default CascaderConfig;
>>>>>>> 061f2b8b8c1725a066fd69908956b1d2e78cc6b5
