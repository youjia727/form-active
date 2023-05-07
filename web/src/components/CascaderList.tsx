import { useState, memo, useMemo, useEffect } from 'react';
import { Popover, Input, Cascader } from 'antd';
import { CheckOutlined, CaretDownOutlined, CloseCircleFilled } from '@ant-design/icons';
import '@/assets/style/cascaderList.less';


type objTypes = {
	[key: string]: any
}

type fileNameTypes = {
	text: string,
	value: string,
	children: string
}

type propTypes = {
	column?: number, //几级层级联动
	fileNames?: fileNameTypes, //选项列表中的属性{text: 'text', value: 'value', children: 'children'}
	options: Array<objTypes>, // 配置选项的列表
	checkedValue?: Array<any>, //选中的数据
	placeholder?: string, //输入占位符
	separator?: string, //分隔符
	onFinish?: Function, //全部选中的回调函数
	render?: Function, //自定义渲染内容
	children?: JSX.Element
}

// 将树形结构转换成数组
function treeToList(tree: Array<objTypes>) {
	let queue = [...tree];
	let res: Array<objTypes> = [];
	queue.concat(tree);
	while (queue.length != 0) {
		let obj = queue.shift();// 弹出队首元素
		if (obj?.children) {
			queue = queue.concat(obj.children);// 子节点入队
			// delete obj["children"];// 删除 children 属性
		}
		res.push(obj as objTypes);
	}
	return res;
};

// 配置显示的导航
function configNav<T>(checkedList: Array<T>, col: number): Array<T> {
	let arr: Array<T> = [];
	if (checkedList.length >= col) {
		arr = checkedList;
	} else {
		arr = [...checkedList, '请选择' as T];
	}
	return arr;
};

// 将字段转换显示
function renderTextCallback<T>(checkedValue: Array<T>, allList: Array<objTypes>, fileNames: fileNameTypes, keyText: string): Array<T> {
	if (!checkedValue.length) return [];
	let key = keyText === 'text' ? fileNames.value : fileNames.text;
	return checkedValue.map(item => {
		let findItem = allList.find((el: objTypes) => el[key] === item);
		return (findItem ? findItem[keyText] : '');
	})
};

/* 渲染层级联动列表 */
function CascaderList(props: propTypes) {

	const { column = 3, fileNames = {
		text: 'text',
		value: 'value',
		children: 'children'
	},
		checkedValue = [], options = [], separator = '/', placeholder, onFinish, render } = props;

	const allCascaderList = useMemo(() => {
		return treeToList(options);
	}, [])


	// 控制弹框显示
	const [open, setOpen] = useState(false);
	// 当前选中数据
	const [checkedList, setCheckedList] = useState<string[]>(() => renderTextCallback<string>(checkedValue, allCascaderList, fileNames, 'text'));
	// 当前渲染选中
	const [renderCheckedText, setRenderCheckedText] = useState(checkedList);
	// 当前选中的导航
	const [activeKey, setActiveKey] = useState(checkedValue.length ? checkedValue.length - 1 : 0);
	// 配置导航
	const [tabList, setTabList] = useState(() => configNav(checkedList, column));

	useEffect(() => {
		if (!checkedValue.length) {
			setCheckedList([]);
			setRenderCheckedText([]);
			setActiveKey(0);
			setTabList(configNav([], column));
		}
	}, [JSON.stringify(checkedValue)])


	/* 修改导航变化 */
	const onChange = (key: number) => {
		if (key === activeKey) return;
		setActiveKey(key);
		let newTabList = tabList.filter(item => item !== '请选择');
		if (JSON.stringify(newTabList) !== JSON.stringify(tabList)) {
			setTabList(newTabList);
		};
	};
	/* 点击选中层级 */
	const handleSelectCascader = (e: any, label: string) => {
		e.stopPropagation();
		// 设置选中数据
		let newCheckedList = checkedList.slice(0, activeKey);
		newCheckedList.push(label);
		setCheckedList(newCheckedList);
		if (newCheckedList.length === column) {
			// 如果选中的数据与层级联动数相同就完成选择
			onSelectCascaderFinish(newCheckedList)
		} else {
			// 设置导航
			let newTabList = configNav(newCheckedList, column);
			setTabList(newTabList);
			setActiveKey(activeKey + 1);
		}
	};
	/* 配置渲染的列表 */
	const renderCallback = (checkedList: string[], tabKey: number): objTypes => {
		if (!checkedList.length || tabKey === 0) return options;
		return allCascaderList.find(item => item.text === checkedList[tabKey - 1])?.children;
	};
	/* 完成全部选择 */
	const onSelectCascaderFinish = (selectValues: Array<string>) => {
		setOpen(false);
		setRenderCheckedText(selectValues);
		// 将数据转换成value形式导出使用
		const values = renderTextCallback(selectValues, allCascaderList, fileNames, 'value');
		onFinish && onFinish(values);
	};
	/* 点击清除信息 */
	const handleClear = (e: any) => {
		e.stopPropagation();
		onSelectCascaderFinish([]);
		setCheckedList([]);
	};
	/* 关闭选择框 */
	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (newOpen) {
			let newTabList = configNav(checkedList, column);
			setTabList(newTabList);
			setActiveKey(checkedList.length ? checkedList.length - 1 : 0);
		}
	};

	// 渲染三级选择列表
	const CascaderContext = () => (
		<>
			{/* ------- 层级联动导航列表 ------- */}
			<div className='cascader-tab-select cursor' onClick={(e) => e.stopPropagation()}>
				{tabList.map((item, idx) => (
					<div
						onClick={() => onChange(idx)}
						className={`cascader-tab-item ${activeKey === idx ? 'active' : ''} hover-color`}
						key={'cascader-tab-item-' + idx}>{item}</div>
				))}
			</div>
			{/* ----------- 层级联动选项展示 ------------- */}
			<ul className='cascader-list-wrapper'>
				{renderCallback(checkedList, activeKey)?.map((item: objTypes) => (
					<li key={item.value} onClick={(e) => handleSelectCascader(e, item.text)}
						className={`${checkedList.includes(item.text) ? 'checked-cascader' : ''} cursor`}
					>
						{checkedList.includes(item.text) ? <CheckOutlined className='checked-cascader-icon primary-color' /> : null}
						<span>{item.text}</span>
					</li>
				))}
			</ul>
		</>
	)

	return (
		<>
			<Popover
				overlayClassName='cascader-popover-wrapper'
				content={<CascaderContext />}
				trigger="click"
				placement='bottom'
				open={open}
				arrow={false}
				getPopupContainer={(triggerNode: any) => triggerNode?.parentNode}
				onOpenChange={handleOpenChange}
			>
				{render ? render(renderCheckedText) :
					<Cascader
						allowClear
						open={false}
						value={renderCheckedText}
						placeholder={placeholder ?? '请选择'}
						displayRender={() => checkedList.join(separator)}
						suffixIcon={<CaretDownOutlined />}
						clearIcon={<CloseCircleFilled onClick={handleClear} />}
						className='cascader-render-input'
						options={undefined}
						style={{ width: '100%' }}
					/>
				}
			</Popover>
		</>
	)
}

export default memo(CascaderList);