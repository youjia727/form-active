import { memo, useState } from "react";
import { Modal, Input } from 'antd';
import useMessage from "@/hooks/useMessage";
const { TextArea } = Input;

type propTypes = {
	open: boolean,
	cancel: Function
}

/* 上传图片地址弹框 */
function ImgUploadInput(props: propTypes) {

	const { open, cancel } = props;
	
	const message = useMessage();

	const [imgUrl, setImgUrl] = useState('');

	/* 点击确认操作 */
	const handleOk = () => {
		if (!imgUrl.trim().length) {
			message.warning('上传图片地址不能为空');
			return false;
		}
		// 关闭弹框，并且传递数据
		cancel(false, imgUrl);
	};

	return (
		<Modal
			centered
			title="请将图片地址粘贴至下方"
			maskClosable={false}
			open={open}
			onOk={handleOk}
			afterClose={() => setImgUrl('')}
			onCancel={() => cancel(false)}
			zIndex={1100}
		>
			<TextArea
				value={imgUrl}
				onChange={e => setImgUrl(e.target.value)}
				autoSize={{ minRows: 4, maxRows: 8 }}
				placeholder="请输入图片地址"
				style={{ margin: '10px 0' }}
			/>
		</Modal>
	)
}

export default memo(ImgUploadInput);