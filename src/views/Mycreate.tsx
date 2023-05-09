import { useEffect, useState } from 'react';
import { Card, Table, Badge, Popconfirm } from 'antd';
import IconFont from '@/components/IconFont';
import type { TablePaginationConfig } from 'antd/es/table';

const { Column } = Table;

export interface paginationProps {
	current: number | undefined;
	pageSize: number | undefined
}

/* 我的创建页面 */
function Mycreate() {
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

	/* 审核状态颜色显示 */
	function colorCallBack(index: number): string {
		// 0 红色， 1正在进行中(绿色)，2成功，3灰色
		let arr = ['#ff4d4f', '#1677ff', '#52c41a', '#999']
		return arr[index];
	};
	// 确认删除
	function confirmDelete() {
		console.log('删除确认')
	};
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
		<Card title="我的创建" bordered={false}>
			{/* 表格数据 */}
			<Table dataSource={list} onChange={onTableChange} rowKey='form_id' style={{ marginBottom: -16 }}
				pagination={{ ...pagination, total, pageSizeOptions: [10, 20, 50], showQuickJumper: true, showSizeChanger: true }}
			>
				<Column title="标题" dataIndex="name" key="name" />
				<Column title="开始时间" dataIndex="start_time" key="start_time" />
				<Column title="结束时间" dataIndex="end_time" key="end_time" />
				<Column title="发布状态" dataIndex="status" key="status" render={(text: any, record: any) => (
					<>
						<Badge
							color={colorCallBack(record.status)}
							text={'未发布'}
							style={{ color: colorCallBack(record.status) }}
						/>
					</>
				)} />
				<Column title="操作" align='center' width={140}
					render={(text: any, record: any) => (
						<>
							<span className='form-option-item hover-color'>
								<IconFont type='icon-hanhan-01-01' title='分享' />
							</span>
							<span className='form-option-item hover-color'>
								<IconFont type='icon-bianji' title='编辑' />
							</span>
							<Popconfirm
								title="操作提示"
								description="是否确认删除表单?"
								placement="bottomRight"
								getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
								onConfirm={confirmDelete}
							>
								<span className='form-option-item hover-color'>
									<IconFont type='icon-shanchu' title='删除' />
								</span>
							</Popconfirm>

							<span className='form-option-item hover-color'>
								<IconFont type='icon-sangedian' />
							</span>
						</>
					)}
				/>
			</Table>
		</Card>
	)
}

export default Mycreate;