import { memo, useRef, useState, useCallback } from 'react';
import Customize from '@/components/Customize';
import RenderImg from '@/components/RenderImg';
import { Space, Button } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { addResult } from "@/store/reducers/formReducer";
import '@/assets/style/result.less';

type propTypes = {
	callback: Function
}

interface noteTypes {
	content: string,
	align: string
}

/* 表单结果页面展示内容 */
function Result(props: propTypes) {
	
	// 输入结束语的ref
	const inputRef = useRef<noteTypes | null>(null);

	const dispatch: AppDispatch = useDispatch();

	// 获取本地存储的表单信息
	const resultData = useSelector((state: RootState) => state.form.result);

	const { callback } = props;
	// 描述语内容
	const content = resultData.content || '';
	// 描述语对齐方式
	const align = resultData.align || 'center';
	// 图片
	const [imageList, setImageList] = useState<string[]>(resultData.imageList || []);

	/* 上传图片的回调函数, 裁剪图片的回调 */
	const editImageCallback = useCallback((url: string) => {
		setImageList([url]);
	}, []);
	/* 图片删除的回调函数 */
	const deleteCallback = useCallback(() => {
		setImageList([]);
	}, []);
	/* 点击设置结果 */
	const handleSetResult = () => {
		const { current } = inputRef;
		const resultData = {
			content: current?.content,
			align: current?.align,
			imageList
		}
		dispatch(addResult(resultData));
		callback(false);
	};

	return (
		<div className='result-config'>
			<div className="result-logo">
				<img src="/image/form/success.png" alt="" />
				<span>提交成功</span>
			</div>
			{/* 添加结束语内容区域 */}
			<div className='add-desc-content'>
				<Customize
					ref={inputRef}
					data={{ content, align }}
					max={1}
					imgSize={imageList.length}
					text={'请输入自定义结束语内容'}
					uploadCallback={editImageCallback}
				/>
				{/* 图片展示区域 */}
				<RenderImg list={imageList} deleteCallback={deleteCallback} cropCallback={editImageCallback} />
			</div>
			<div className='result-btn-container'>
				<Space size={20}>
					<Button onClick={() => callback(false)}>取 消</Button>
					<Button onClick={handleSetResult} type="primary">确 定</Button>
				</Space>
			</div>
		</div>
	)
}

export default memo(Result);