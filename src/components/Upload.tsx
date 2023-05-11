import { memo, useState, useRef, useCallback } from "react";
import { Dropdown, message, Popover, Menu } from 'antd';
import ImgUploadInput from "./modal/ImgUploadInput";
import { AntCloudOutlined, CreditCardOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const accept = '.bmp,.jpg,.jpe,.jpeg,.pic,.png';

type propTypes = {
	imgSize?: number,
	max?: number,
	children: JSX.Element,
	component?: string,
	uploadCallback?: Function
}

/* 上传文件 */
function Upload(props: propTypes) {

	const { imgSize, max, children, component, uploadCallback } = props;
	// 上传图片的ref
	const uploadRef = useRef<HTMLInputElement>(null);
	// 上传图片地址弹框显示
	const [open, setOpen] = useState(false);

	/**
	 * * 定义函数
	 *  */

	/* 将图片信息传递给 其它 组件 */
	const sendImgData = (url: string) => {
		// 传递图片对象到需要页面中去存储
		uploadCallback && uploadCallback(url);
	};
	/* 取消弹框显示 */
	const cancelModal = useCallback((val: boolean, imgUrl?: string) => {
		setOpen(val);
		imgUrl &&  sendImgData(imgUrl);
	}, []);
	/* 点击选择上传图片 */
	const handleSelect: MenuProps['onClick'] = (row) => {
		if (row.key === 'link') {
			// 打开输入地址弹框
			setOpen(true);
		} else {
			// 上传图片到本地
			const { current } = uploadRef;
			current && current.click();
		}
	};
	/* 本地上传图片 */
	const uploadFile = (e: any) => {
		let files = e.target.files;
		let maxSize = 10 * 1024 * 1024;
		if (files[0].size > maxSize) {
			message.warning('上传文件大于10M！');
			return false;
		}
		let reader = new FileReader(); //读取文件
		reader.readAsDataURL(files[0]);
		reader.onload = () => {
			// 调用包装传递图片信息函数
			sendImgData(reader.result as string)
		}
	};

	const items: MenuProps['items'] = [{
		key: 'link',
		label: <div className="upload-item">
			<AntCloudOutlined className="icon-upload primary-color" />
			<span>链接图片</span>
		</div>
	}, {
		key: 'upload',
		label: <div className="upload-item">
			<CreditCardOutlined className="icon-upload" />
			<span>本地图片</span>
		</div>
	}]

	return (
		<>
			{component === 'popover' ?
				<Popover
					arrow={false}
					overlayClassName="popover-wrapper popover-overlay"
					openClassName="popover-open"
					placement='rightTop'
					trigger='hover'
					content={() => <Menu
						className="popover-menu-wrapper"
						items={items}
						onClick={handleSelect}
					/>}
				>
					{children}
				</Popover>
				:
				<Dropdown
					disabled={(imgSize && max && imgSize >= max) as boolean}
					overlayClassName="Dropdown-upload-wrapper"
					menu={{ items, onClick: handleSelect }}
					trigger={['click']}
				>
					<span className={(imgSize && max && imgSize >= max) ? 'disabled' : 'active opacity'}>
						{children}
					</span>
				</Dropdown>
			}

			{/* 上传地址图片弹框 */}
			<ImgUploadInput open={open} cancel={cancelModal} />
			{/* 上传图片input */}
			<input ref={uploadRef} type="file" accept={accept} style={{ display: 'none' }} onChange={uploadFile} />
		</>
	)
}

export default memo(Upload);