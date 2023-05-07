import { useState, memo } from 'react';
import { useUpdate } from '@/hooks/useUpdate';
import {
	PlusCircleOutlined, CloseOutlined, CaretDownOutlined, EditOutlined
} from '@ant-design/icons';
import { baseProps, objProps } from '@/assets/utils/formConfig/editorConfig';
import CascaderConfig from '../modal/CascaderConfig';


type propsType = {
	item: baseProps
}

type cascaderObj = {
	label: string,
	placeholder: string
}

/* 下拉选择的内容 */
const options = [{
	value: 1,
	label: '一级联动'
}, {
	value: 2,
	label: '二级联动'
}, {
	value: 3,
	label: '三级联动'
}]


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
	/* 编辑层级联动配置的回调函数 */
	const cascaderCallback = (visible: boolean, cascaderRule?: objProps) => {
		cascaderRule ? Object.assign(item, cascaderRule) : null;
		setOpen(false)
	};

	return (
		<>
			<div className='cascader-wrapper'>
				<div className='cascader-item'>
					<span>填写者选择区</span>
					<div className='delete-area-item'>
						<CaretDownOutlined />
					</div>
				</div>
			</div>
			{item.setDetail ?
				<div className="placeholder-info cascader-info">
					<span>{item.details.placeholder}</span>
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
				{!(item.cascaderMode.length >= 3) && !item.setDetail ? <div className='split-add'></div> : null}
				{!item.setDetail ?
					<>
						<div className='split-add'></div>
						<div onClick={() => handleSetDetail(true)} className='setting-block opacity'>
							<PlusCircleOutlined className='icon-block' />
							<span>添加详细</span>
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