import { memo } from 'react';
import { Rate } from 'antd';
import { useUpdate } from '@/hooks/useUpdate';
import useMessage from '@/hooks/useMessage';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { baseProps } from '@/assets/utils/formConfig/editorConfig';

function View(props: { item: baseProps }) {

	const { item } = props;
	const message = useMessage();
	const update = useUpdate();

	/* 编辑评分数 */
	const handleEditRate = (type: string) => {
		console.log(type)
		if (type === 'add' && item.count >= 20) {
			message.warning('最多设置20星评分')
			return false;
		}
		if (type === 'reduce' && item.count <= 3) {
			message.warning('最少设置3星评分')
			return false;
		}
		update(() => {
			type === 'add' ? item.count++ : item.count--;
		})
	};

	return (
		<>
			<div className='edit-rate-wrapper'>
				<Rate disabled count={item.count} className="rate-color" />
			</div>
			<div className="form-item-setting">
				<div onClick={e => handleEditRate('add')} className='setting-block opacity'>
					<PlusCircleOutlined className='icon-block' />
					<span>添加星数</span>
				</div>
				<div className='split-add'></div>
				<div onClick={e => handleEditRate('reduce')} className='setting-block opacity'>
					<MinusCircleOutlined className='icon-block' />
					<span>删除星数</span>
				</div>
			</div>
		</>
	)
}

export default memo(View);