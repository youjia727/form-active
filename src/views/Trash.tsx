import { useEffect, useState } from 'react';
import { Card, Table, Button, Space } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

const { Column } = Table;

export interface paginationProps {
	current: number | undefined;
	pageSize: number | undefined
}

/* 我的创建页面 */
function Trash() {
	// console.log(props);
	/* 定义数据 */
	// 列表信息
	const [list, setList] = useState([{
		form_id: 1,
		name: '测试数据',
		start_time: '2023-3-22',
		end_time: '2023-4-22',
		status: 3
	}]);

	// 分页配置
	const [pagination, setPagination] = useState<paginationProps>({
		current: 1,
		pageSize: 10
	});
	const [total, setTotal] = useState(0);

	/* 函数生命周期 */
	useEffect(() => {
		// console.log('11111111');
	}, [])

	/* 改变页码 */
	function onTableChange(tablePagination: TablePaginationConfig) {
		const { current, pageSize } = tablePagination;
		if ((pagination.pageSize as number) !== (pageSize as number)) {
			setTotal(list.length);
		};
		setPagination({
			current: pageSize === pagination.pageSize ? current : 1,
			pageSize
		})
	};

	return (
		<Card title="回收站" bordered={false}>
			{/* 表格数据 */}
			<Table dataSource={list} onChange={onTableChange} rowKey='form_id' style={{ marginBottom: -16 }}
				pagination={{ ...pagination, total, pageSizeOptions: [10, 20, 50], showQuickJumper: true, showSizeChanger: true }}
			>
				<Column title="标题" dataIndex="name" key="name" />
				<Column title="开始时间" dataIndex="start_time" key="start_time" />
				<Column title="结束时间" dataIndex="end_time" key="end_time" />
				<Column title="删除日期" dataIndex="end_time" key="end_time" />
				<Column title="操作" align='center'
					render={(text: any, record: any) => (
						<Space size={12}>
							<span title='还原' className='trash-option-item hover-color border-color'>还原</span>
							<span title='彻底删除' className='trash-option-item hover-color border-color'>删除</span>
						</Space>
					)}
				/>
			</Table>
		</Card>
	)
}

export default Trash;