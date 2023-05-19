import { DragEvent, memo, useState, useCallback, useRef, WheelEvent } from "react";
import { Modal, Button } from "antd";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '@/assets/style/renderImg.less';

type propTypes = {
	open: boolean,
	cancel: Function,
	imgUrl: string | undefined,
	idx: number,
	cropCallback: Function
}

function CropImage(props: propTypes) {

	const { open, cancel, imgUrl, idx, cropCallback } = props;
	const imgRef = useRef(null);

	// 图片放大缩小
	const [scale, setScale] = useState(1);
	// 图片裁剪显示区域
	const [crop, setCrop] = useState<Crop>({
		unit: '%', // Can be 'px' or '%'
		x: 25,
		y: 25,
		width: 50,
		height: 50
	});

	/* 关闭裁剪图片的弹框 */
	const closeModal = () => {
		cancel();
		setCrop({
			unit: '%',
			x: 25,
			y: 25,
			width: 50,
			height: 50
		})
	};
	/* 裁剪区域变化的函数 */
	const cropChange = useCallback((val: Crop) => {
		setCrop(val);
	}, []);
	/* 鼠标滚动事件 */
	const onWheel = (e: WheelEvent) => {
		if (e.deltaY > 0) {
			// 不能小于显示的图片
			setScale(scale <= 1 ? 1 : scale - 0.1);
		} else {
			// 最多可放大两倍
			setScale(scale >= 2 ? 2 : scale + 0.1);
		}
	};
	/* 获取裁剪的图片 */
	const getCroppedImg = (ele: HTMLImageElement, localParam: Crop) => {
		// debugger;
		// ele 代表原始图片的元素， crop代表现在截取的坐标位置
		const canvas = document.createElement('canvas');
		// 图片显示宽度与实际宽度的压缩比例，画布时候需要还原比例图
		const newCrop = JSON.parse(JSON.stringify(localParam));
		const scaleX = ele.naturalWidth / (ele.width * scale);
		const scaleY = ele.naturalHeight / (ele.height * scale);
		// 将百分比转换成px
		if (newCrop.unit === '%') {
			newCrop.x = ele.width / 4;
			newCrop.y = ele.height / 4;
			newCrop.width = ele.width / 2;
			newCrop.height = ele.height / 2;
		}
		// 设置画布的宽高
		const width = newCrop.width >= 100 ? newCrop.width : 100;
		const height = newCrop.height >= 100 ? newCrop.height : 100;
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		// 裁剪图片
		ctx && ctx.drawImage(
			ele, // 图像、画布或视频
			newCrop.x * scaleX, // 开始剪切的 x 坐标位置 (左上角开始)
			newCrop.y * scaleY, // 开始剪切的 y 坐标位置
			newCrop.width * scaleX, //被剪切图像的宽度
			newCrop.height * scaleY, // 被剪切图像的高度
			0, // 在画布上放置图像的 x 坐标位置
			0, // 在画布上放置图像的 y 坐标位置
			width, // 画布展示图像的宽度
			height, // 画布展示图像的高度
		);
		// 将canvas图片转换成base64
		const cropUrl = canvas.toDataURL('image/png');
		// 将裁剪后的图片对象传递给 其它 组件
		cropCallback && cropCallback(cropUrl, idx);
		closeModal();
	};
	/* 点击完成图片裁剪 */
	const handleSure = () => {
		const { current } = imgRef;
		current && getCroppedImg(current, crop);
	};

	return (
		<Modal title="裁剪图片" open={open} width={720} centered maskClosable={false}
			getContainer={false} footer={null} onCancel={closeModal}>
			<div className="crop-wrapper">
				<ReactCrop crop={crop} ruleOfThirds minWidth={50} minHeight={50}
					onChange={cropChange} keepSelection>
					<div onWheel={onWheel} style={{ maxHeight: 410, overflow: 'hidden' }}>
						<img ref={imgRef} src={imgUrl ?? ''} crossOrigin="anonymous" onDragStart={(e: DragEvent) => e.preventDefault()}
							style={{ transform: `scale(${scale})` }} className="cutting-image" alt="" />
					</div>
				</ReactCrop>
			</div>
			<div className="cutting-success">
				<Button onClick={handleSure} type="primary">完 成</Button>
			</div>
		</Modal>
	)
}

export default memo(CropImage);