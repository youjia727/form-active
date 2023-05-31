import { memo, useState } from 'react';
import { Checkbox, Popover } from 'antd';
import {
	RightOutlined, EyeInvisibleOutlined,
	CheckOutlined, CaretDownOutlined, CaretUpOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setFocusId, setCommonComp } from '@/store/reducers/formReducer';
import IconFont from './IconFont';
import useMessage from '@/hooks/useMessage';
import DragContext from './DragContext';
import Upload from './Upload';
import TextAreaComponent from './TextArea';
import RenderImg from '@/components/RenderImg';
import InputComponent from '@/components/formConfig/Input';
import RateComponent from '@/components/formConfig/Rate';
import SelectComponent from '@/components/formConfig/Select';
import MultipleInputComponent from '@/components/formConfig/MultipleInput';
import DateComponent from '@/components/formConfig/Date';
import CascaderComponent from '@/components/formConfig/Cascader';
import AddressComponent from '@/components/formConfig/Address';
import compTags from '@/assets/utils/formConfig/tagType';
import { useUpdate } from '@/hooks/useUpdate';
import event from '@/assets/utils/event';
import utils from '@/assets/utils';
import { baseProps, objProps, optionProps } from '@/assets/utils/formConfig/editorConfig';
import '@/assets/style/editorContext.less';

type propTypes = {
	index: number,
	modal?: boolean,
	setList?: Function,
	item: baseProps,
	[key: string]: any
};

const compTagList: objProps = compTags;

/* 策略模式根据类型渲染组件 */
const renderComponentCallback = (type: string, item: baseProps, tag: string, modal?: boolean): JSX.Element => {
	const strategyCallback = {
		input: <InputComponent item={item} tag={tag} />,
		select: <SelectComponent item={item} modal={modal} tag={tag} />,
		multipInput: <MultipleInputComponent item={item} />,
		date: <DateComponent item={item} />,
		cascader: tag === 'address' ? <AddressComponent item={item} /> : <CascaderComponent item={item} />,
		rate: <RateComponent item={item} />,
		signature: <div className='signature default'>填写者输入签名区</div>
	};
	return strategyCallback[type as keyof typeof strategyCallback];
};

// 表单编辑项内容
const EditorContext = (props: propTypes) => {

	const { item, index, modal, listeners, move, deleteOptionCallBack } = props;
	const dispatch: AppDispatch = useDispatch();
	const message = useMessage();
	// 更新页面
	const update = useUpdate();
	// 当前聚焦的id
	const focusId = modal ? item.id : useSelector((state: RootState) => state.form).focusId;
	// 接收配置的表单类型
	const { type } = item;
	// 是否展开下拉菜单
	const [dropOpen, setDropOpen] = useState(false);

	/**
	 * * 自定义函数
	 *  */

	/* 点击编辑当前文本 */
	const handleSelectActive = (id: string) => {
		if (id === focusId) return;
		dispatch(setFocusId(id))
	};
	/* 上传图片的回调函数, 裁剪图片的回调 */
	const editImageCallback = (url: string) => {
		focusId === item.id ? update(() => {
			item['imgUrl'] = url;
		}) : null;
	};
	/* 当前组件类型 */
	const compTagCallback = (): Array<objProps> => {
		return compTagList[type + 'Category'] || [];
	};
	/* 当前组件类型文字显示 */
	const renderText = (tag: string): string => {
		let compTagItem = compTagCallback().find((column: objProps) => column.tag === tag);
		return compTagItem?.text ?? '独立题';
	};
	/* 组件类型下拉框的显示隐藏回调 */
	const handleOpen = (e: any) => {
		e.stopPropagation();
		setDropOpen(!dropOpen)
	};
	/* 设置是否是多选题 */
	const editMultipleType = (tag: string) => {
		const multipleType = {
			radio: false,
			checkbox: true
		};
		if (typeof multipleType[tag as keyof typeof multipleType] !== 'undefined') {
			item.multiple = multipleType[tag as keyof typeof multipleType];
		};
	};
	/* 点击修改组件的类型 */
	const handleEditTag = (tag: string) => {
		if (item.tag === tag) return;
		if (item.type === 'select') {
			editMultipleType(tag);
		};
		item.tag = tag;
		setDropOpen(false);
	};
	/* 点击切换显示与隐藏 */
	const handleShow = (attr: string) => {
		update(() => {
			item[attr] = !item[attr];
		})
	};
	/* 复制题目 */
	const cloneQuestion = () => {
		const clone = utils.deepClone(item);
		clone['id'] = utils.randomString(); //给表单增加id与属性
		event.emit('transfer-data', clone);
	};
	/* 添加为常用题 */
	const handleAddCommon = () => {
		if (!item.title.trim().length) {
			message.info('问题不能为空，请输入')
			return false;
		}
		const clone = utils.deepClone(item);
		if (clone.type === 'select') {
			clone.options.forEach((opt: optionProps, idx: number) => {
				clone.options[idx].jumpTo = [];
			})
		}
		const commonItem = {
			label: clone.title,
			config: clone
		}
		dispatch(setCommonComp(commonItem));
		message.success('添加成功')
	};
	/* 组件类型内容 */
	const dropContent = (
		<ul className='setting-component-content'>
			{compTagCallback().map(column => (
				<li key={column.tag} onClick={() => handleEditTag(column.tag)}>
					{item.tag === column.tag ? <CheckOutlined className='checked-tag-icon' /> : null}
					{column.text}
				</li>
			))}
		</ul>
	);

	/* 更多操作的内容 */
	const content = (
		<ul className='setting-other-content'>
			<Upload component="popover" uploadCallback={editImageCallback}>
				<li>
					{item.imgUrl ? '替换' : '添加'}图片（标题）
					<RightOutlined className='arrow-right-icon' />
				</li>
			</Upload>
			<li onClick={() => handleShow('noteShow')}>
				{item.noteShow ? '隐藏' : '添加'}题目说明
			</li>
			{!modal ?
				<>
					<li onClick={cloneQuestion}>复制题目</li>
					<li onClick={handleAddCommon}>将此题添加为常用题</li>
				</> : null
			}
			<li onClick={e => handleShow('isShow')}>
				{item.isShow ? '隐藏' : '显示'}题目
			</li>
		</ul>
	);

	return (
		<div onClick={() => handleSelectActive(item.id)} id={item.id}
			className={`form-question-item ${item.id === focusId ? 'question-content-actived' : ''}`}
			style={{ paddingTop: modal ? 16 : 'auto' }}>
			{!modal ?
				<span {...listeners} ref={move} className="form-question-move" title='移动'>
					<img src="/image/form/move.png" alt="" />
				</span> : null
			}
			{/* ---------- 设置问题 --------- */}
			<div className='form-item-title'>
				<span className={`index ${item.required ? 'required' : ''}`}>{index + 1}.</span>
				<TextAreaComponent item={item} attr='title' tip='请输入问题' className='form-title' />
			</div>
			{/* 是否隐藏题目 */}
			{!item.isShow ?
				<div className='hide-wrapper'>
					<EyeInvisibleOutlined className='hide-icon' />
					<span>此题已隐藏</span>
				</div> : null
			}
			{/* ----------- 题目描述说明 ------------- */}
			<div className='question-description'>
				{item.noteShow ? <TextAreaComponent item={item} attr='note' tip='题目说明' className='description-input' /> : null}
			</div>
			{/*------------ 图片展示区 --------------  */}
			{item.imgUrl ?
				<div className='question-image-wrapper'>
					<RenderImg list={[item.imgUrl]} align='left' deleteCallback={() => editImageCallback('')} cropCallback={editImageCallback} />
				</div> : null
			}
			{/* ------------- 显示的左侧组件类型 -------------- */}
			{renderComponentCallback(type, item, item.tag, modal)}

			{/* -------- 底部右边操作区域 ---------- */}
			<div className='form-item-options'>
				{/* 方块类型下拉选择 */}
				<Popover overlayClassName='popover-wrapper' arrow={false} placement='bottom'
					content={dropContent} open={dropOpen} onOpenChange={(open) => setDropOpen(open)}
					trigger={compTagCallback().length >= 2 ? 'click' : 'contextMenu'}>
					<div className={`setting-type ${compTagCallback().length >= 2 ? 'cursor' : 'default'}`}>
						<span className='type-text'>{renderText(item.tag)}</span>
						{compTagCallback().length >= 2 ?
							<span className='caret-icon' onClick={handleOpen}>
								{dropOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
							</span> : null
						}
					</div>
				</Popover>
				<div className='line'></div>
				<div className='setting-required'>
					<span>必填</span>
					<Checkbox onChange={e => handleShow('required')} checked={item.required}></Checkbox>
				</div>
				{!modal ?
					<div className='setting-delete hover-color' onClick={() => deleteOptionCallBack(index)}>
						<IconFont type='icon-shanchu' title='删除' />
					</div> : null
				}
				<Popover overlayClassName='popover-wrapper' arrow={false} placement="bottomLeft"
					content={content} trigger='hover'>
					<div className='setting-other hover-color'>
						<IconFont type='icon-sangedian' title='更多' />
					</div>
				</Popover>
			</div>
		</div>
	)
}

export default DragContext(memo(EditorContext));