import { useState, useMemo, memo } from 'react';
import { Popover } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { ScheduleOutlined, CaretDownOutlined } from '@ant-design/icons';
import { baseProps } from '@/assets/utils/formConfig/editorConfig';

function View(props: { item: baseProps }) {

	const { item } = props;
	const [open, setOpen] = useState(false);
	const pickerList = useMemo(() => {
		return [{
			text: '年月',
			picker: 'month'
		}, {
			text: '年月日',
			picker: 'date'
		}, {
			text: '年月日时分',
			picker: 'minute'
		}]
	}, [])
	/* 渲染日期选择显示 */
	const renderText = () => {
		return pickerList.find(col => col.picker === item.picker)?.text ?? '';
	};
	/* 控制日期模式显示 */
	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
	};
	/* 选择日期的类型 */
	const hanldeSelectDatePicker = (picker: string) => {
		item.picker = picker;
		setOpen(false);
	};

	/* 日期类型内容 */
	const content = (
		<ul className='setting-other-content date-type-content'>
			{pickerList.map(col => (
				<li onClick={() => hanldeSelectDatePicker(col.picker)} className='date-item' key={col.picker}>
					{item.picker === col.picker ? <CheckOutlined className='checked-tag-icon' /> : null}
					{col.text}
				</li>
			))}
		</ul>
	);

	return (
		<>
			<div className="placeholder-info date-text-info">
				<Popover
					overlayClassName='popover-wrapper'
					arrow={false}
					placement="bottomLeft"
					content={content}
					open={open}
					onOpenChange={handleOpenChange}
					trigger="click"
				>
					<div className='date-icon-wrapper opacity' title='点击展开'>
						<ScheduleOutlined />
						<CaretDownOutlined style={{ fontSize: 10 }} />
					</div>
				</Popover>
				<span>{renderText()}</span>
			</div>
		</>
	)
}

export default memo(View);