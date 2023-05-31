import { memo, useState, useRef, useCallback, useEffect } from 'react';
import IconFont from './IconFont';
import SignatureCanvas from 'react-signature-canvas';
import { Modal, Space } from 'antd';

type objTypes = {
	[key: string]: any
};

type propTypes = {
	onFinish?: Function, //绘制完成回调,
	onCancel?: Function, // 删除已经绘制的回调函数 
	imgUrl?: string // 图片地址
};

// 画笔的宽度
const sizeList = [{
	width: 6,
	size: 0.5
}, {
	width: 8,
	size: 2
}, {
	width: 10,
	size: 4
}];

// canvas画布
let canvas: objTypes = {};
// canvas画布的历史记录
let canvasHistory: Array<string> = [];
// canvas画布的宽度
let canvasWidth = 0;
// 控制是否鼠标按下
let isEnterDown = false;

// 电子签名显示
function Signature(props: propTypes) {

	const { onFinish, onCancel, imgUrl = '' } = props;

	const sigCanvasRef = useRef<any>(null);
	const [open, setOpen] = useState(false);
	const [type, setType] = useState(1);
	const [size, setSize] = useState(2);
	const [signatureImgUrl, setSignatureImgUrl] = useState('');

	useEffect(() => {
		if (!open) {
			canvasHistory = [];
		};
		setType(1);
		setSize(2);
	}, [open]);

	useEffect(() => {
		if (imgUrl !== signatureImgUrl) {
			setSignatureImgUrl(imgUrl )
		}
	}, [imgUrl]);

	useEffect(() => {
		/* 橡皮檫 */
		const rubber = (e: any) => {
			if (type !== 2 || !isEnterDown) return;
			const ctx = canvas?.getContext("2d");
			const x = e.offsetX - 7 >= 0 ? e.offsetX - 7 : e.offsetX;
			const y = e.offsetY - 5 >= 0 ? e.offsetY - 5 : e.offsetX;
			ctx.clearRect(x, y, 14, 14);
		};
		const mouseup = () => {
			isEnterDown = false;
			sigCanvasRef?.current?.on();
			onEnd();
		};
		const mousedown = (e: any) => {
			sigCanvasRef?.current?.off();
			isEnterDown = true;
			rubber(e);
		};
		if (type === 2) {
			canvas.addEventListener && canvas.addEventListener('mousedown', mousedown);
			canvas.addEventListener && canvas.addEventListener('mousemove', rubber);
			canvas.addEventListener && canvas.addEventListener('mouseup', mouseup);
		}

		return () => {
			canvas.removeEventListener('mousedown', mousedown);
			canvas.removeEventListener('mousemove', rubber);
			canvas.removeEventListener('mouseup', mouseup);
		}
	}, [type])

	/* 点击绘制签名 */
	const setModalShow = useCallback(async () => {
		await setOpen(true);
		const { current } = sigCanvasRef;
		canvas = current?._canvas;
		if (!canvasWidth) {
			canvasWidth = document.getElementById('canvas-wrapper')?.clientWidth || 792;
		}
		canvas.width = canvasWidth;
	}, [sigCanvasRef]);
	/* 清除数据 */
	const resetSignBtn = () => {
		setType(0);
		sigCanvasRef.current?.clear();
	};
	/* 撤销 */
	const backOutSignBtn = () => {
		setType(0);
		if (canvasHistory.length) {
			canvasHistory = canvasHistory.slice(0, -1);
			const canvasUrl = canvasHistory[canvasHistory.length - 1];
			sigCanvasRef.current?.clear();
			sigCanvasRef.current?.fromDataURL(canvasUrl);
		}
	};
	/* 一次绘制完成 */
	const onEnd = () => {
		canvas = sigCanvasRef.current?._canvas;
		const imgurl: string = sigCanvasRef.current?.toDataURL();
		canvasHistory.push(imgurl);
	};
	/* 删除已经绘制 */
	const handleDelete = () => {
		setSignatureImgUrl('');
		onCancel && onCancel();
	};
	/* 点击确定 */
	const handleOk = () => {
		const imgurl: string = sigCanvasRef.current?.toDataURL();
		setSignatureImgUrl(imgurl);
		onFinish && onFinish(imgurl);
		setOpen(false);
	};

	return <>
		<div className='signature-wrapper'>
			{signatureImgUrl.length ?
				<div className='signature-content'>
					<img src={signatureImgUrl} alt='' />
					<div className='signature-edit'>
						<span className='primary-color opacity' onClick={setModalShow}>重写</span>
						<span className='primary-color opacity' onClick={handleDelete}>删除</span>
					</div>
				</div> :
				<div className='empty-signature cursor' onClick={setModalShow}>点击绘制签名区</div>
			}
		</div>
		<Modal title="绘制电子签名" open={open} centered width={840} maskClosable={false}
			onOk={handleOk} onCancel={() => setOpen(false)}>
			<div className='option-signature'>
				<Space size={12} className='tab-action'>
					<div className='hover-color' onClick={resetSignBtn}>
						<IconFont className='option-sign-icon' type='icon-shanchu' />
						<span>清空</span>
					</div>
					<div className='hover-color' onClick={backOutSignBtn}>
						<IconFont className='option-sign-icon' type='icon-chexiao' />
						<span>撤销</span>
					</div>
					<div onClick={() => setType(1)} className={`${type === 1 ? 'sign-active' : ''} drawer-select border-color hover-color`}>
						<IconFont className='option-sign-icon' type='icon-huabi' />
						<span>画笔</span>
						<div className='count-wrapper'>
							{sizeList.map(el => (
								<div key={el.width} onClick={() => setSize(el.size)}>
									<span className={`size-count ${size === el.size ? 'active-size' : ''}`}
										style={{ width: el.width, height: el.width }}></span>
								</div>
							))}
						</div>
					</div>
					<div onClick={() => setType(2)} className={`${type === 2 ? 'sign-active' : ''} clear-select border-color hover-color`}>
						<IconFont className='option-sign-icon' type='icon-rubber' />
						<span>橡皮檫</span>
					</div>
				</Space>
				{/* 电子签名书写 */}
				<div id='canvas-wrapper'>
					<SignatureCanvas ref={sigCanvasRef} penColor='#000' onEnd={onEnd} dotSize={type === 2 ? 0 : size}
						canvasProps={{ height: 280, className: `sigCanvas ${type === 2 ? 'clear-write' : ''}` }}
						minWidth={type === 2 ? 6 : size} minDistance={0} throttle={10} />
				</div>
			</div>
		</Modal>
	</>
}

export default memo(Signature);