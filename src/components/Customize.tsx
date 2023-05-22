import { forwardRef, memo, useImperativeHandle, useState, useEffect } from "react";
import { Input } from 'antd';
import Upload from "./Upload";
import { PictureOutlined } from '@ant-design/icons';
import event from "@/assets/utils/event";
import '@/assets/style/customize.less';

const { TextArea } = Input;

type dataObj = {
	content: string,
	align: string
}

interface paramsType {
	text?: string,
	imgSize: number,
	max: number,
	data?: dataObj,
	uploadCallback?: Function,
	inputChange?: Function,
	show?: boolean
}

/* 这是设置描述、自定义结束语内容组件*/

const Customize = forwardRef((props: paramsType, ref) => {

	const { text, imgSize, max, data, uploadCallback, inputChange, show = true } = props;
	//描述的内容
	const [content, setContent] = useState(() => data ? data.content : '');
	// 对齐方式 //
	const [align, setAlign] = useState(() => data ? data.align : 'center');

	/* ref传递值 */
	useImperativeHandle(ref, () => {
		return {
			content,
			align
		}
	});

	useEffect(() => {
		event.on('clear', () => {
			setContent('');
		})
	}, [])

	/* 失去焦点 */
	const handleBlur = (type: string) => {
		if (data?.content === content && data?.align === type) return;
		inputChange && inputChange({
			content,
			align: type
		})
	};
	/* 点击设置对齐方式 */
	const handleSetAlign = (type: string) => {
		setAlign(type);
		handleBlur(type);
	};

	return (
		<>
			<TextArea value={content} maxLength={1000} placeholder={text} autoSize
				onChange={e => setContent(e.target.value)} onBlur={() => handleBlur(align)}
				className="textarea-input" style={{
					textAlign: align === 'center' ? 'center' : 'left'
				}} />
			<div className="adjustment-box">
				{show ?
					<>
						<div className="justify-type">
							{/* 左对齐 */}
							<img className={align === 'left' ? 'checked' : ''} src="/image/form/left.png"
								title="左对齐" onClick={() => handleSetAlign('left')} alt="" />
							{/* 居中对齐 */}
							<img className={align === 'center' ? 'checked' : ''} src="/image/form/center.png"
								title="居中对齐" onClick={() => handleSetAlign('center')} alt="" />
						</div>
						{/* 上传图片 */}
						<Upload imgSize={imgSize} max={max} uploadCallback={uploadCallback}>
							<>
								<PictureOutlined className="add-image-icon" />
								<span className="add-image-text">添加图片</span>
							</>
						</Upload>
					</> : null
				}
			</div>
		</>
	)
})

export default memo(Customize);