import { useEffect, useState, useRef, memo, forwardRef, useImperativeHandle, useCallback } from "react";
import { Input, InputRef } from 'antd';
import Customize from '@/components/Customize';
import RenderImg from '@/components/RenderImg';
import EditorContext from '@/components/EditorContext';
import { StateContext } from "./stateContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setFocusId, setFormList } from "@/store/reducers/formReducer";
import event from "@/assets/utils/event";
import { baseProps, objProps } from '@/assets/utils/formConfig/editorConfig';
import utils from "@/assets/utils";
import '@/assets/style/renderConfig.less';

interface noteTypes {
	content: string,
	align: string
};
interface formListTypes {
	list: Array<baseProps>
}

// 描述框的id
const startDescId: string = '20230501';

// 渲染表单列表数据
const RenderFormListConfig = memo(forwardRef((props: objProps, ref) => {

	const containerRef = useRef<HTMLDivElement>(null);
	const dispatch: AppDispatch = useDispatch();
	// 获取本地存储的表单信息
	const formData = useSelector((state: RootState) => utils.deepClone(state.form.formData));
	//列表数据
	const [list, setList] = useState<Array<baseProps>>(formData?.list || []);

	/* ref传递值 */
	useImperativeHandle(ref, () => {
		return {
			list
		}
	})

	useEffect(() => {
		// 监听用户选择组件
		event.on('transfer-data', (item: baseProps) => {
			item['time'] = Date.now();
			setList([...list, item]);
			dispatch(setFocusId(item.id));
			const { current } = containerRef;
			const height = (current?.scrollHeight as number) + 10000;
			window.scrollTo({
				top: height,
				behavior: 'smooth' // 平滑滚动
			})
		});
		// 清空数据
		event.on('clear', () => {
			setList([]);
		})
		return () => {
			event.off();
		}
	}, [list.length]);

	/* 删除每项的数据回调 */
	const deleteOptionCallBack = useCallback((idx: number) => {
		setList(preList => {
			const newList = [...preList];
			newList.splice(idx, 1);
			const focusId: string = newList[idx]?.id || newList[idx - 1]?.id || '';
			focusId.length && dispatch(setFocusId(focusId));
			return newList;
		})
	}, []);
	/* 拖拽调整顺序 */
	const dragChangeCallback = useCallback((changeList: Array<baseProps>) => {
		setList(preList => {
			// 记录拖拽之前的顺序
			dispatch(setFormList(utils.deepClone(preList)));
			return changeList;
		})
	}, []);

	return (
		<StateContext.Provider value={{ list }}>
			<div className="create-form-question-wrapper" ref={containerRef}>
				{list.length ?
					<EditorContext
						list={list}
						dragChangeCallback={dragChangeCallback}
						deleteOptionCallBack={deleteOptionCallBack}
						dragClassName='dragging'
					/> :
					<div className="empty-question" onClick={() => dispatch(setFocusId(0))}>
						点击左侧题型添加问题
					</div>
				}
			</div>
		</StateContext.Provider>
	)
}))

// 渲染配置页面展示
const RenderConfig = forwardRef((props: objProps, ref) => {

	const dispatch: AppDispatch = useDispatch();
	// 描述语的ref
	const inputRef = useRef<noteTypes | null>(null);
	// 标题的ref
	const titleRef = useRef<InputRef | null>(null);
	// 表单列表ref
	const formRef = useRef<formListTypes | null>(null);
	// 获取本地存储的表单信息
	const formData = useSelector((state: RootState) => utils.deepClone(state.form.formData));
	// console.log('formData===========', formData)

	/**
	 * * 定义数据
	 *  */
	// 表单标题
	const [title, setTitle] = useState(formData?.title || '');
	// 描述语内容
	const [content, setContent] = useState(formData?.header?.content || '');
	// 描述语对齐方式
	const [align, setAlign] = useState(formData?.header?.align || 'center');
	// 描述语图片列表
	const [imageList, setImageList] = useState<string[]>(formData?.header?.imageList || []);
	// 编辑框聚焦，当前聚焦的id
	const { focusId } = useSelector((state: RootState) => state.form);

	/* ref传递值 */
	useImperativeHandle(ref, () => {
		return {
			title,
			header: {
				content,
				align,
				imageList
			},
			list: formRef.current?.list || [],
			handleFocus
		}
	})

	useEffect(() => {
		// 清空数据
		event.on('clear', () => {
			setTitle('');
			setContent('');
			setAlign('center');
			setImageList([]);
		})
	}, [formRef.current?.list.length]);

	/**
	 * * 自定义函数
	 *  */

	/* 设置标题聚焦 */
	const handleFocus = () => {
		const { current } = titleRef;
		current && current.focus();
	};
	/* 描述语内容回调函数 */
	const inputChange = useCallback((data: noteTypes) => {
		setContent(data.content);
		setAlign(data.align);
	}, [])
	/* 上传图片的回调函数, 裁剪图片的回调 */
	const editImageCallback = useCallback((url: string, idx?: number) => {
		setImageList((preList => {
			const newList = [...preList];
			typeof idx === 'undefined' ? newList.push(url) : newList.splice(idx, 1, url);
			return newList;
		}));
	}, []);
	/* 图片删除的回调函数 */
	const deleteCallback = useCallback((idx: number) => {
		setImageList(preList => {
			const newList = [...preList];
			newList.splice(idx, 1)
			return newList;
		});
	}, []);

	return (
		<div className="render-config-container">
			{/* 设置标题 */}
			<div id="form-question-title" className={`form-title ${focusId === 'title' ? 'edit-title' : ''}`} onClick={() => dispatch(setFocusId('title'))}>
				<Input
					ref={titleRef}
					value={title}
					onChange={(e) => setTitle(e.target.value.trim())}
					placeholder="请输入表单标题"
					maxLength={20}
					bordered={false}
				/>
			</div>
			{/* --------描述语展示的内容部分--------- */}
			<div className={`render-config-item ${focusId === startDescId ? 'question-content-actived' : 'image-wrapper'}`}
				onClick={() => dispatch(setFocusId(startDescId))}>
				{/* 添加描述语内容区域 */}
				<Customize
					data={{ content, align }}
					ref={inputRef}
					max={4}
					show={focusId === startDescId}
					imgSize={imageList.length}
					text={'点击设置描述'}
					inputChange={inputChange}
					uploadCallback={editImageCallback}
				/>
				{/* 图片展示区域 */}
				<RenderImg list={imageList} deleteCallback={deleteCallback} cropCallback={editImageCallback} />
			</div>

			{/*---------- 表单列表展示容器 -----------*/}
			<RenderFormListConfig ref={formRef} />
		</div>
	)
})

export default memo(RenderConfig);