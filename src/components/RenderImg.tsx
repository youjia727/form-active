import { memo, useCallback, useState } from "react";
import IconFont from "./IconFont";
import CropImageModal from './modal/CropImage';
import useModal from "@/hooks/useModal";
import '@/assets/style/renderImg.less';

type propTypes = {
	list: Array<string>,
	deleteCallback: Function,
	cropCallback: Function,
	align?: string
}


/* 这是图片渲染内容部分 */
function RenderImg(props: propTypes) {

	const { list, deleteCallback, cropCallback, align = 'center' } = props;

	const modal = useModal();
	/*
	* 定义数据
	 */
	// 控制裁剪图片弹框显示
	const [open, setOpen] = useState(false);
	// 当前裁剪图片的对象
	const [cropImg, setCropImg] = useState('');

	/* 打开裁剪图片的弹框 */
	const cropImage = (url: string) => {
		setCropImg(url)
		setOpen(true);
	};
	/* 关闭裁剪图片的弹框 */
	const closeModal = useCallback(() => {
		setOpen(false)
	}, []);
	/* 删除图片函数 */
	const deleteImage = (idx: number) => {
		modal.confirm({
			title: '操作提示',
			content: '确认删除此图片吗？',
			okButtonProps: {
				danger: true
			},
			onOk() {
				// 将删除图片的id传递给父组件
				deleteCallback && deleteCallback(idx)
			}
		})
	};


	return (
		<div className="image-render-container" style={{textAlign: align === 'left' ? align : 'center'}}>
			{
				list && list.map((imgUrl: string, idx: number) => (
					/* 图片列表 */
					<div className="image-render-block" key={`${Math.random() + idx}`}>
						<div className="image-item">
						<img src={imgUrl} alt="" />
						<div className="image-render-option">
							<div className="image-render-option-item" onClick={() => cropImage(imgUrl)}>
								<IconFont type="icon-caijian" className="imgage-option-icon" />
								<span>裁剪</span>
							</div>
							<div className="image-render-option-item" onClick={e => deleteImage(idx)}>
								<IconFont type="icon-shanchu" className="imgage-option-icon" />
								<span>删除</span>
							</div>
						</div>
					</div>
					</div>
				))
			}
			{/* 裁剪图片的弹框 */}
			<CropImageModal open={open} imgUrl={cropImg} cropCallback={cropCallback} cancel={closeModal} />
		</div>
	)
}

export default memo(RenderImg);