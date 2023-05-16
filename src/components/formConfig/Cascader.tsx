import { useState, memo } from 'react';
import { useUpdate } from '@/hooks/useUpdate';
import { PlusCircleOutlined, CloseOutlined, CaretDownOutlined, EditOutlined } from '@ant-design/icons';
import { baseProps, cascaderModeTypes, objProps } from '@/assets/utils/formConfig/editorConfig';
import CascaderConfig from '../modal/CascaderConfig';

type propsType = {
	item: baseProps
}

/* 层级联动 */
function Cascader(props: propsType) {

	const { item } = props;

	const update = useUpdate();

	// 显示配置层级联动数据
	const [open, setOpen] = useState(false);
	/* 点击设置其他内容输入 */
	const handleSetDetail = (visible: boolean) => {
		update(() => {
			item.setDetail = visible;
		})
	};
	/* placeholder 占位提示语 */
	const placeholderCallback = (tipList: Array<cascaderModeTypes>) => {
		const tipsText: Array<string> = [];
		tipList.forEach(tips => {
			tips.text.trim().length ? tipsText.push(tips.text) : null;
		})
		return tipsText.length ? '（' + tipsText.join(' / ') + '）' : '';
	};
	/* 编辑层级联动配置的回调函数 */
	const cascaderCallback = (visible: boolean, config?: objProps) => {
		if (config) {
			item.options = config.options;
			item.cascaderMode = config.title;
			item.levelCount = config.count;
		}
		setOpen(visible);
	};

	return (
		<>
			<div className='cascader-wrapper'>
				<div className='cascader-item'>
					<span>填写者选择区{placeholderCallback(item.cascaderMode)}</span>
					<div className='delete-area-item'>
						<CaretDownOutlined />
					</div>
				</div>
			</div>
			{item.setDetail ?
				<div className="placeholder-info cascader-info">
					<span>{item.details.text}</span>
					<div className='local-wrapper'>
						<CloseOutlined onClick={() => handleSetDetail(false)} className='hover-color' title='删除' />
					</div>
				</div> : null
			}
			<div className="form-item-setting">
				<div onClick={() => setOpen(true)} className='setting-block opacity'>
					<EditOutlined className='icon-block' />
					<span>编辑选项</span>
				</div>
				{!item.setDetail ?
					<>
						<div className='split-add'></div>
						<div onClick={() => handleSetDetail(true)} className='setting-block opacity'>
							<PlusCircleOutlined className='icon-block' />
							<span>添加详细输入</span>
						</div>
					</> : null
				}
			</div>

			{/* 展示数据配置的modal框 */}
			{open ? <CascaderConfig open={open} item={item} cancel={cascaderCallback} /> : null}
		</>
	)
}

export default memo(Cascader);