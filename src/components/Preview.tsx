import { useState, useEffect, memo } from 'react';
import {
	Button, Checkbox, Input, Space, Radio,
	Select, Rate, DatePicker
} from 'antd';
import { CaretDownOutlined, EnvironmentOutlined } from '@ant-design/icons';
import IconFont from './IconFont';
import options from '@/assets/utils/options';
import CascaderList from '@/components/CascaderList';
import utils from '@/assets/utils';
import dayjs from 'dayjs';
import { useUpdate } from '@/hooks/useUpdate';
import { baseProps, optionProps, objProps } from '@/assets/utils/formConfig/editorConfig';
import '@/assets/style/preview.less';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;


type submitDataTypes = {
	[key: string]: {
		value?: any,
		details?: string
	}
}

// 表头与结束语类型
interface headerTypes {
	descData: string,
	align: string,
	imageList: Array<string>
};

// 表单类型
interface formListType {
	list?: Array<baseProps>
}

interface formConfigTypes extends formListType {
	title?: string,
	header?: headerTypes,
	end?: headerTypes
};

// 选择题的选项类型
interface optionTypes {
	id: number,
	imgUrl: string,
	jumpTo: Array<string>,
	label: string,
	mode: number
}

type propTypes = {
	formData?: formConfigTypes | null,
	open?: boolean,
	mode?: string
}

const formatTypes = {
	month: 'YYYY-MM',
	date: 'YYYY-MM-DD',
	minute: 'YYYY-MM-DD HH:mm'
}

// 单选 多选 布局设置 class 类名
//  half-select-group 内部子元素宽50%
//  third-select-group 内部子元素宽33.33%
function selectLayoutCallback(options: Array<optionTypes>) {
	let optItem = options.find(item => !item.mode || item.imgUrl.length);
	// 如果有设置其他项或者设置图片宽度就为100%
	if (optItem) return '';
	const lengthList = options.map(item => item.label.length);
	const max = Math.max(...lengthList);
	// 总长为620，去掉选择框占位24， 270 为一半的距离， 180 为三分之一的距离
	if (max * 14 >= 270) return '';
	if (max * 14 > 180 && max * 14 < 270) return 'half-select-group';
	return 'third-select-group';
};

// 将正则字符串转换成正则
function toRegExp(regString: string) {
	return new Function('return ' + regString)();
};

// 选择题错误提示语
function messageSelectCallback(max?: number | null, min?: number | null) {
	if (max && min && max === min) return '此题限定选择 ' + max + ' 项';
	if (max && min) return '最多选择 ' + max + ' 项，最少选择 ' + min + ' 项';
	if (max) return '最多选择 ' + max + ' 项';
	if (min) return '最少选择 ' + min + ' 项';
	return '';
};

// 表单验证
function ruleChecked(rule: objProps) {
	// console.log(rule)
	// 修改错误状态
	rule.error = Array.isArray(rule.value) ? !rule.value.length : !rule.value;
	// console.log(rule.error)
	// 判断是否填写信息
	if (!rule.value || (Array.isArray(rule.value) && !rule.value.length)) {
		rule.message = '此题为必填，请将内容补充完整';
		return false;
	};
	// 已经填写信息看是否是多选题，是否设置max，min
	if (rule.mutiple && (rule.max || rule.min)) {
		// 数组判断选项的个数
		if (utils.isType('Array')(rule.value)) {
			const len = rule.value.length;
			rule.message = rule.max < len ? messageSelectCallback(rule.max) :
				rule.min > len ? messageSelectCallback(null, rule.min) : '';
		};
		// 字符串判断输入的字符数
		if (utils.isType('String')(rule.value)) {
			const len = rule.value.length;
			rule.message = rule.max < len ? '最多输入' + rule.max + '位数字' :
				rule.min > len ? '最少输入' + rule.min + ' 位数字' : '';
		};
		// 有提示语表示有错误，就不往后面执行了
		if (rule.message.length) {
			rule.error = true;
			return false;
		}
	};
	// 在这开始验证自定义的规则
	let errorRule = rule.rules.find((item: objProps) => !toRegExp(item.pattern).test(rule.value));
	if (errorRule) {
		rule.message = errorRule.message;
		rule.error = true;
		return false;
	};
	return true;
};

// 滚动到第一个错误的位置
function scrollError(targetId: string) {
	let anchorElement = document.getElementById(`write-question-${targetId}`);
	if (anchorElement) {
		anchorElement.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		})
	}
};

// 输入框占位符
const inputCharacter: string = '＿＿＿＿';

/* 这是答题显示页面 */
function Preview(props: propTypes) {

	const { formData, open } = props;

	const update = useUpdate();

	/**
	 * * 定义数据
	 *  */
	// 表单标题
	const title = formData?.title || '';
	// 表单列表
	const formList = formData?.list || [];

	// console.log(formList)
	// 表单头部内容描述
	const formHeader: headerTypes | objProps = formData?.header || {};
	// 结束语
	const formEnd: headerTypes | objProps = formData?.end || {};
	// 当前渲染的列表
	const [renderFormList, setRenderFormList] = useState<Array<baseProps>>([]);
	// 有被设置的关联列表
	const [contactFormList, setContactFormList] = useState<Array<baseProps>>([]);
	// 验证规则的对象列表
	const [ruleList, setRuleList] = useState<objProps>({});
	// 提交的数据格式
	const [submitValues, setSubmitValues] = useState<submitDataTypes>({});

	useEffect(() => {
		if (!open) {
			// 重置表单
			resetFields();
		}
	}, [open])

	useEffect(() => {
		initRules();
	}, [JSON.stringify(formList)])


	/* 初始化数据表单数据 */
	const initForm = (arr: Array<baseProps>, reset?: boolean) => {
		if (reset) {
			// 重置数据
			for (const key in submitValues) {
				submitValues[key].details = undefined;
				submitValues[key].value = undefined;
			};
			// 初始渲染列表
			const renderList: Array<baseProps> = [];
			// 被设置关联的列表
			const contactList: Array<baseProps> = [];
			arr.forEach((item, idx) => {
				item.index = idx;
				// 区分渲染列表与被关联列表
				item.isSetJumped.length || !item.isShow ? contactList.push(item) : renderList.push(item);
			})
			setRenderFormList(renderList);
			setContactFormList(contactList);
		} else {
			let newSubmitObj: submitDataTypes = {};
			// 初始化数据
			arr.forEach(item => {
				const data = {
					type: item.tag,
					value: undefined,
					details: undefined
				};
				newSubmitObj[item.id] = data;
			})
			setSubmitValues(newSubmitObj);
		}
	};
	/* 初始化验证规则 */
	const initRules = () => {
		let rule: objProps = {};
		// 初始渲染列表
		const renderList: Array<baseProps> = [];
		// 被设置关联的列表
		const contactList: Array<baseProps> = [];
		formList.forEach((item, idx) => {
			item.index = idx;
			// 设置必填项的验证规则
			if (item.required) {
				let ruleItem: objProps = {
					type: item.type,
					mutiple: item.mutiple,
					value: undefined, //填写数据
					max: item.max, //最多输入
					min: item.min, //最少输入
					message: '此题为必填，请将内容补充完整', //提示语
					error: false, //是否错误
					rules: [] //验证规则列表
				};
				ruleItem.rules = item.rules;
				rule[item.id] = ruleItem;
			};
			// 区分渲染列表与被关联列表
			item.isSetJumped.length ? contactList.push(item) : renderList.push(item);
		});
		initForm(formList);
		setRuleList(rule);
		setRenderFormList(renderList);
		setContactFormList(contactList);
	};
	/* 重置表单数据 */
	const resetFields = () => {
		// 初始化数据
		initForm(formList, true);
		// 重置表单验证状态
		const keys = Reflect.ownKeys(ruleList);
		keys.forEach(key => {
			const newKey = key as string;
			ruleList[newKey].error = false
		})
	};
	/* 表单的验证 */
	const validateFileds = (nameList: Array<string>) => {
		let error = false;
		// 根据验证规则返回验证失败的列表
		const errorList = nameList.filter(name => {
			if (name in ruleList) {
				ruleList[name].value = submitValues[name].value;
				return ruleChecked(ruleList[name]) ? '' : name;
			}
		})
		if (errorList.length) {
			error = true;
			// 滚动到第一个错误的位置
			scrollError(errorList[0]);
		}
		error ? update(() => { }) : null;
		return error;
	};
	/* 设置表单数据 */
	const validateFormItem = <T,>(attr: string, value: T) => {
		// 判断属性是否在验证列表中，存在并且已经在验证中就调整验证状态
		if (attr in ruleList && ruleList[attr].error) {
			ruleList[attr].error = false;
		}
		update(() => {
			submitValues[attr].value = value;
		})
	};
	/* 设置 “其他” 内容数据 */
	const setDetailFormInput = (attr: string, value?: string) => {
		update(() => {
			submitValues[attr].details = value;
		})
	};
	/* 是否显示 “其他” 内容输入框 */
	const renderShowDetailInput = (attr: string, optionList: Array<optionTypes>) => {
		let optionItem = optionList.find(item => !item.mode);
		// 判断是否选中其他
		if (optionItem && (submitValues[attr]?.value === optionItem.id ||
			(Array.isArray(submitValues[attr]?.value) &&
				submitValues[attr]?.value?.includes(optionItem.id)))) return true;
		// 如果其他内容有数据就清空内容
		if (submitValues[attr]) {
			submitValues[attr].details = undefined;
		}
		return false;
	};
	/* 选择题操作时候清除页面显示数据 */
	const clearRenderList = (id: string) => {
		const idx = renderFormList.findIndex(item => item.id === id);
		if (idx > -1) {
			const spliceList = renderFormList.splice(idx, 1);
			// 拆半查找法查找下标索引值
			const addIdx = utils.binarySearch(contactFormList, spliceList[0].index);
			// 将数据放入关联列表中
			contactFormList.splice(addIdx, 0, spliceList[0]);
			// 清除其他项显示时候填写的数据
			submitValues[id].value = undefined;
			submitValues[id].details = undefined;
			ruleList[id].error = false;
		}
	};
	/* 清除关联的表单显示项 */
	const clearContactCallBack = (clearJump: Array<string>) => {
		// 循环清除关联数据
		clearJump.forEach(id => {
			// 找到关联的每项
			const formItem = utils.find(renderFormList, id);
			if (!formItem || !formItem.isSetJumped.length) return;
			// 这里注意：如果此题之前还有其它选择题关联，会存在多个选项关联一个题的问题
			if (formItem.isSetJumped.length === 1) {
				// 如果只有一个题关联，就直接清除；
				clearRenderList(formItem.id);
			} else {
				// 多个题关联就需要判断是否之前有题已经选中
				const checked = formItem.isSetJumped.some(item => {
					const arr = item.split('-');
					const values = submitValues[arr[0]].value;
					// 对数据格式区分判断，提交数据中的value的格式有三种，字符串，数字，数组
					const bool = utils.isType('Array')(values);
					return (bool ? values.includes(arr[1]) : values == arr[1]);
				})
				// 没有被选中就清除数据，选中就不做处理
				if (!checked) {
					clearRenderList(formItem.id);
				}
			};
			// 这儿注意：有可能清除的关联题还是选择题，还存在关联逻辑，那么此时应该将所有的关联逻辑都清除
			if (formItem.type === 'select') {
				// 找到清除关联选择题下面的逻辑关联列表
				let clearJumpList: Array<string> = formItem.options.flatMap((item: optionProps) => item.jumpTo);
				if (clearJumpList.length) {
					clearJumpList = utils.onlyArray(clearJumpList); //去重
					// 递归清除数据
					clearContactCallBack(clearJumpList);
				}
			};
		})
	};
	/* 组合关联数据显示内容 */
	const composeContactCallBack = (jumpList: Array<string>) => {
		jumpList.forEach(id => {
			// 查找下标索引
			const index = utils.findIndex(contactFormList, id);
			if (index > -1) {
				// 删除已经在渲染的中的关联列表项
				const spliceList = contactFormList.splice(index, 1);
				// 拆半查找法查找下标索引值
				const idx = utils.binarySearch(renderFormList, spliceList[0].index);
				// 给渲染列表增加显示内容
				renderFormList.splice(idx, 0, spliceList[0]);
			}
		});
	};
	/* * 
	 *  选择题变化逻辑关联改变
	 *  jumpTo -> 当前选择项跳转的逻辑关联 clearJump -> 需要清除的关联
	 * */
	const selectJumpChange = <T,>(attr: string, value: T, jumpTo: Array<string>, otherJumpTo: Array<string>) => {
		// 设置数据
		validateFormItem(attr, value);
		// 如果选项都没有设置跳转逻辑，不做任何操作
		if (!jumpTo.length && !otherJumpTo.length) return;
		otherJumpTo = utils.onlyArray(otherJumpTo); // 去重
		// 如果都设置跳转逻辑
		if (jumpTo.length && otherJumpTo.length) {
			composeContactCallBack(jumpTo);
			// 注意：如果 A 选项 关联 3,4,5题，B选项关联4,5,6题，选择A选项组合3,4,5题，清除只能清除6题
			const jumpAllList = utils.onlyArray([...jumpTo, ...otherJumpTo]);
			const clearJumpList: Array<string> = [];
			for (let i = 0; i < jumpAllList.length; i++) {
				const t = jumpAllList[i];
				// 找出A选项与B选项关联的不同题
				if (!(jumpTo.includes(t) && otherJumpTo.includes(t))) {
					// 将需要清除的放入清除数组中
					otherJumpTo.includes(t) ? clearJumpList.push(t) : null;
				}
			};
			clearJumpList.length && clearContactCallBack(clearJumpList);
			return false;
		};
		// 只有当前选项有设置跳转逻辑 composeContactCallBack(jumpTo)
		// 当前选项没有设置跳转逻辑，其他选择项有跳转逻辑 clearContactCallBack(otherJumpTo)
		jumpTo.length ? composeContactCallBack(jumpTo) : clearContactCallBack(otherJumpTo);
	};
	/* 单选题选中数据发生变化 */
	const radioChange = <T,>(attr: string, value: T, options: Array<optionTypes>, idx: number) => {
		// 当前选择项跳转的逻辑关联
		const jumpTo = options[idx].jumpTo;
		// 其他选择项设置逻辑关联的数据
		let otherJumpTo = options.flatMap((optItem, i) => (idx === i ? [] : optItem.jumpTo));
		selectJumpChange(attr, value, jumpTo, otherJumpTo);
	};
	/* 多选题的数据变化 */
	const checkboxChange = <T,>(attr: string, value: T, options: Array<optionTypes>) => {
		const values = value as Array<number>;
		// 如果没有选项被选中就清除所有的关联关系，如果所有选项都被选中就关联所有项
		if (!values.length || values.length === options.length) {
			const jumpList = utils.onlyArray(options.flatMap(item => item.jumpTo)); // 去重
			values.length ? selectJumpChange(attr, values, jumpList, []) : selectJumpChange(attr, values, [], jumpList);
			return false;
		};
		// 如果只有一个选项被选中
		if (values.length === 1) {
			const idx = options.findIndex(item => item.id === values[0]);
			radioChange(attr, values, options, idx);
		} else {
			// 多个选项被选中
			const allJumoTo: Array<string> = []; //需要关联的列表
			const clearJumpTo: Array<string> = []; //需要清除关联的列表
			options.forEach(item => {
				// 根据数组每项与选中的数据做对比，如果选中就将关联题列表放入跳转队列，否则就是清空队列
				values.includes(item.id) ? allJumoTo.push(...item.jumpTo) : clearJumpTo.push(...item.jumpTo);
			});
			selectJumpChange(attr, values, utils.onlyArray(allJumoTo), clearJumpTo);
		}
	};
	/* 下拉题选中发生数据变化*/
	const dropdownChange = <T,>(attr: string, value: T, options: Array<optionTypes>) => {
		if (typeof value === 'undefined') {
			// 清空数据操作
			validateFormItem(attr, value);
			return false;
		};
		if (utils.isType('Array')(value)) {
			// 多选下拉题
			checkboxChange(attr, value, options);
		} else {
			// 单选下拉题
			const idx = options.findIndex(item => item.id === value);
			radioChange(attr, value, options, idx);
		}
	};
	/* 日期变化 */
	const dateRangeChange = (attr: string, dateString: [string, string]) => {
		const rangeValues = dateString.filter(item => item);
		validateFormItem(attr, rangeValues.length ? rangeValues : undefined);
	};
	/* 范围日期的显示内容 */
	const rangeDateValueCallback = (attr: string) => {
		const value = submitValues[attr]?.value;
		if (!value) return value;
		return [dayjs(value[0]), dayjs(value[1])];
	};
	/* 多段填空的问题序列化 */
	const mutileQuestionToList = (questionString: string) => {
		if (!questionString.trim().length) return [];
		let newString = questionString.replace(/＿＿＿＿/g, '####＿＿＿＿####');
		return newString.split('####').filter(item => item.length);
	};
	/* 多段填空输入框内容变化 */
	const multipleInputChange = (attr: string, value: string, idx: number) => {
		// console.log(attr, value, idx)
		let arr: string[] = submitValues[attr]?.value ?? [];
		// console.log(arr)
		arr[idx] = value;
		validateFormItem(attr, arr);
	};
	/* 层级联动的文本占位符提示 */
	const cascaderPlaceholderCallback = (cascaderMode: Array<{ label: string, placeholder: string }>) => {
		const placeholderList = cascaderMode.map(item => item.placeholder);
		return placeholderList.join('/');
	};
	/* 点击提交数据 */
	const onFinish = () => {
		const keys: Array<string> = renderFormList.map(item => item.id);
		let error = validateFileds(keys);
		console.log('是否有验证失败：', error);
		console.log('提交数据格式：', submitValues)
	};

	// 问题，描述语，以及图片
	const LabelContent = (attrs: objProps) => (
		<div className='write-item-caption'>
			{/* -------- 问题 --------- */}
			<div className='write-item-title'>
				{attrs.required ? <span className='isRequired'>*</span> : null}
				{attrs.idx}. {attrs.tag === 'checkbox' ? <span className='select-title-extra'>[多选]</span> : null}{attrs.title}
			</div>
			{/* -------- 问题说明 --------- */}
			{attrs.desc.trim().length ?
				<div className='write-item-describle'>{attrs.desc}</div> : null
			}
			{/* -------- 问题图片 --------- */}
			{attrs.imgUrl.length ?
				<div className='write-item-image-title'>
					<img src={attrs.imgUrl} alt='' />
				</div> : null
			}
		</div>
	)

	return (
		<div className='render-container'>
			{/* ----------- 表单表头显示内容------------- */}
			<div className='render-title'>{title}</div>
			{/* -------------- 描述语内容 ---------------- */}
			{formHeader.descData.trim() ?
				<div className='render-describle'
					style={{ textAlign: formHeader.align }}>{formHeader.descData}</div>
				: null
			}
			{/* ----------- 表单表头图片展示 ------------- */}
			{formHeader.imageList.length ?
				<div className='render-image-list'>
					{formHeader.imageList.map((imgUrl: string, idx: number) => (
						<div className='render-image-item' key={'header-image-' + (idx + 1)}>
							<img src={imgUrl} alt='' />
						</div>
					))}
				</div> : null
			}

			{/* --------------- 表单主要内容 ---------------- */}
			<div className='write-container'>
				{renderFormList.map((item, idx) => (
					<div key={item.id} id={'write-question-' + item.id} className='write-item'>
						<LabelContent required={item.required} idx={idx + 1} title={item.title}
							desc={item.note} imgUrl={item.imgUrl} tag={item.tag}
						/>
						<>
							{/* --------------- 单行输入 ----------------- */}
							{item.tag === 'input' ?
								<Input
									maxLength={item.max}
									value={submitValues[item.id]?.value}
									onChange={e => validateFormItem(item.id, e.target.value)}
									className='write-input'
									placeholder='请输入'
								/> : null
							}

							{/* --------------- 多行输入 ----------------- */}
							{item.tag === 'textarea' ?
								<TextArea
									maxLength={item.max}
									value={submitValues[item.id]?.value}
									onChange={e => validateFormItem(item.id, e.target.value)}
									className='write-input'
									autoSize
									placeholder='请输入'
								/> : null
							}

							{/* --------------- 单选题 ----------------- */}
							{item.tag === 'radio' ?
								<Radio.Group
									value={submitValues[item.id]?.value}
									className={`select-group ${selectLayoutCallback(item.options)}`}
								>
									{item.options.map((option: optionTypes, idx: number) => (
										<div key={item.id + '-' + option.id} className='select-item'>
											<Radio value={option.id} onChange={e => radioChange(item.id, e.target.value, item.options, idx)}>
												{option.mode ?
													<>
														<p>{!option.label && !option.imgUrl.length ? '选项' + (idx + 1) : option.label}</p>
														{option.imgUrl.length ? <img className='select-image' src={option.imgUrl} alt='' /> : null}
													</> :
													<div className={option.label.length <= 16 ? 'other-select-wrapper' : ''}>
														<span>{option.label}</span>
														{renderShowDetailInput(item.id, item.options) ?
															<div className='other-select-input'>
																<TextArea className='write-input detail-input'
																	autoSize placeholder='请输入'
																	onChange={e => setDetailFormInput(item.id, e.target.value)}
																/>
															</div> : null
														}
													</div>
												}
											</Radio>
										</div>
									))}
								</Radio.Group> : null
							}

							{/* --------------- 多选题 ----------------- */}
							{item.tag === 'checkbox' ?
								<Checkbox.Group
									value={submitValues[item.id]?.value}
									onChange={values => checkboxChange(item.id, values, item.options)}
									className={`select-group ${selectLayoutCallback(item.options)}`}
								>
									{item.options.map((option: optionTypes, idx: number) => (
										<div key={item.id + '-' + option.id} className='select-item'>
											<Checkbox value={option.id}>
												{option.mode ?
													<>{option.label || '选项' + (idx + 1)}</> :
													<div className={option.label.length <= 16 ? 'other-select-wrapper' : ''}>
														<span>{option.label}</span>
														{renderShowDetailInput(item.id, item.options) ?
															<div className='other-select-input'>
																<TextArea className='write-input detail-input'
																	autoSize placeholder='请输入'
																	onChange={e => setDetailFormInput(item.id, e.target.value)}
																/>
															</div> : null
														}
													</div>
												}
											</Checkbox>
										</div>
									))}
								</Checkbox.Group> : null
							}
							{/* --------------- 下拉题 ----------------- */}
							{item.tag === 'select' ?
								<div className='space-wrapper'>
									<Select
										mode={item.multiple ? 'multiple' : undefined}
										showSearch
										allowClear
										value={submitValues[item.id]?.value}
										onChange={value => dropdownChange(item.id, value, item.options)}
										suffixIcon={<CaretDownOutlined />}
										filterOption={(input, option) => ((option?.label ?? '') as string).includes(input)}
										placeholder="请选择内容"
										popupClassName='dropdown-select-wrapper'
										style={{ width: '100%' }}
									>
										{item.options.map((option: optionTypes, idx: number) => (
											<Option
												key={item.id + '-' + option.id}
												value={option.id}
												label={option.label || '选项' + (idx + 1)}
											>{option.label || '选项' + (idx + 1)}
											</Option>
										))}
									</Select>
									{/* ------- 选择 其他 内容输入框 ---------- */}
									{renderShowDetailInput(item.id, item.options) ?
										<TextArea
											className='write-input'
											autoSize placeholder='请输入'
											onChange={e => setDetailFormInput(item.id, e.target.value)}
										/> : null
									}
								</div> : null
							}

							{/* --------------- 多段填空 ----------------- */}
							{item.tag === 'multipInput' ?
								<div className='multiple-input-wrapper'>
									{mutileQuestionToList(item.question).map((stepText, idx) => (
										<div className={stepText === inputCharacter ? 'step-input-warpper' : 'step-text'}
											key={item.id + '-' + idx}>
											{stepText === inputCharacter ?
												<>
													<span>{submitValues[item.id]?.value ? submitValues[item.id]?.value[idx] : null}</span>
													<div className='step-input-item'>
														<TextArea
															value={submitValues[item.id]?.value ? submitValues[item.id]?.value[idx] : ''}
															onChange={e => multipleInputChange(item.id, e.target.value, idx)}
															className='write-input step-input'
															autoSize
															placeholder='请输入'
														/>
													</div>
												</> : <>{stepText}</>
											}
										</div>
									))}
								</div> : null
							}

							{/* --------------- 评分题 ----------------- */}
							{item.tag === 'rate' ?
								<Rate
									value={submitValues[item.id]?.value}
									onChange={value => validateFormItem(item.id, value)}
									count={item.count}
								/> : null
							}

							{/* --------------- 日期题 ----------------- */}
							{item.type === 'date' ?
								<div className='date-picker-wrapper'>
									<IconFont className='date-icon' type='icon-a-ziyuan22' />
									{item.tag === 'date' ?
										<DatePicker
											value={submitValues[item.id]?.value ? dayjs(submitValues[item.id]?.value) : null}
											picker={item.picker === 'minute' ? 'date' : item.picker}
											format={formatTypes[item.picker as keyof typeof formatTypes]}
											showTime={item.picker === 'minute' ? { format: 'HH:mm' } : false}
											onChange={(date: any, dateString: string) => validateFormItem(item.id, dateString)}
											getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
											suffixIcon={''} className='write-input'
										/> :
										<RangePicker
											value={rangeDateValueCallback(item.id)}
											picker={item.picker === 'minute' ? 'date' : item.picker}
											format={formatTypes[item.picker as keyof typeof formatTypes]}
											showTime={item.picker === 'minute' ? { format: 'HH:mm' } : false}
											onChange={(date: any, dateString: [string, string]) => dateRangeChange(item.id, dateString)}
											getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
											suffixIcon={''} separator={'至'}
											className='write-input range-picker'
										/>
									}
								</div> : null
							}

							{/* --------------- 层级联动题 ----------------- */}
							{item.type === 'cascader' ?
								<div className='space-wrapper'>
									<CascaderList
										column={item.cascaderMode.length}
										options={options}
										checkedValue={submitValues[item.id]?.value}
										onFinish={(checkedList: Array<string>) => validateFormItem(item.id, checkedList)}
										placeholder={cascaderPlaceholderCallback(item.cascaderMode)}
									/>
									{item.setDetail ?
										<div className='detail-input-wrapper'>
											<TextArea className={`write-input ${item.tag === 'address' ? 'address-input' : ''}`}
												onChange={e => setDetailFormInput(item.id, e.target.value)}
												autoSize placeholder={item.details.placeholder}
											/>
											{item.tag === 'address' ? <EnvironmentOutlined className='anticon-environment' /> : null}
										</div> : null
									}
								</div> : null
							}
						</>
						<div className='write-error-text'>{ruleList[item.id]?.error ? ruleList[item.id]?.message : null}</div>
					</div>
				))}
				<div className='write-btn-wrapper'>
					<Space size={20}>
						{props.mode !== 'preview' ? <Button>保存草稿</Button> : null}
						<Button type="primary" onClick={onFinish}>提交</Button>
					</Space>
				</div>
			</div>
		</div >
	)
}

export default memo(Preview);