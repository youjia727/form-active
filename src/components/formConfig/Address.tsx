import { memo } from 'react';
import { useUpdate } from '@/hooks/useUpdate';
import {
	PlusCircleOutlined, EnvironmentOutlined,
	CloseOutlined, CaretDownOutlined
} from '@ant-design/icons';
import { baseProps } from '@/assets/utils/formConfig/editorConfig';


type propsType = {
	item: baseProps
}

type cascaderObj = {
	label: string,
	placeholder: string
}

const cascaderList = [{
	label: 'province',
	placeholder: '省/自治区/直辖市'
}, {
	label: 'city',
	placeholder: '市'
}, {
	label: 'district',
	placeholder: '区/县'
}];

/* 层级联动 */
function AddressCascader(props: propsType) {

	const { item } = props;

	const update = useUpdate();

	/* 点击设置其他内容输入 */
	const handleSetDetail = (visible: boolean) => {
		update(() => {
			item.setDetail = visible;
		})
	};
	/* 点击删除层级联动的级数 */
	const handleDeleteCascader = (idx: number) => {
		let newList = [...item.cascaderMode];
		newList.splice(idx, 1);
		update(() => {
			item.cascaderMode = newList;
		})
	};
	/* 添加层级的文字提示 */
	const addressTextCallback = (cascaderItem: { label: string, placeholder: string }) => {
		const idx = cascaderList.findIndex(el => el.label === cascaderItem.label);
		return cascaderList[idx + 1].placeholder;
	};
	/* 添加层级 */
	const handleAddCascader = () => {
		const cascaderItem = item.cascaderMode[item.cascaderMode.length - 1];
		const idx = cascaderList.findIndex(el => el.label === cascaderItem.label);
		update(() => {
			item.cascaderMode.push(cascaderList[idx + 1]);
		})
	};

	return (
		<>
			<div className='cascader-wrapper'>
				{item.cascaderMode.map((cascader: cascaderObj, idx: number) => (
					<div className='cascader-item' key={cascader.label}>
						<span>{cascader.placeholder}</span>
						<div className='delete-area-item'>
							<CaretDownOutlined />
							{idx + 1 === item.cascaderMode.length && idx !== 0 ?
								<>
									<div className='line cascader-line'></div>
									<CloseOutlined onClick={() => handleDeleteCascader(idx)} className='hover-color' title='删除' />
								</>
								: null
							}
						</div>
					</div>
				))}
			</div>
			{item.setDetail ?
				<div className="placeholder-info cascader-info">
					<span>{item.details.placeholder}</span>
					<div className='local-wrapper'>
						{item.tag === 'address' ?
							<>
								{/* <span className='local-text'>自动定位</span> */}
								<EnvironmentOutlined />
								<div className='line'></div>
							</> : null
						}
						<CloseOutlined onClick={() => handleSetDetail(false)} className='hover-color' title='删除' />
					</div>
				</div> : null
			}
			<div className="form-item-setting" style={{ height: item.cascaderMode.length >= 3 && item.setDetail ? 16 : 40 }}>
				{item.cascaderMode.length >= 3 ? null :
					<div onClick={handleAddCascader} className='setting-block opacity'>
						<PlusCircleOutlined className='icon-block' />
						<span>添加{addressTextCallback(item.cascaderMode[item.cascaderMode.length - 1])}</span>
					</div>
				}
				{!(item.cascaderMode.length >= 3) && !item.setDetail ? <div className='split-add'></div> : null}
				{!item.setDetail ?
					<div onClick={() => handleSetDetail(true)} className='setting-block opacity'>
						<PlusCircleOutlined className='icon-block' />
						<span>添加详细</span>
					</div> : null
				}
			</div>
		</>
	)
}

export default memo(AddressCascader);