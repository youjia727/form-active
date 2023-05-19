import { memo, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, Input, Empty, Button } from 'antd';
import {
	baseCompList, initComponent,
	baseCompProps, baseProps, objProps
} from "@/assets/utils/formConfig/editorConfig";
import IconFont from '../IconFont';
import EditorContext from '@/components/EditorContext';
import useMessage from '@/hooks/useMessage';
import useModal from '@/hooks/useModal';
import utils from '@/assets/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setCommonComp, delCommonComp } from '@/store/reducers/formReducer';
import { PlusOutlined } from '@ant-design/icons';
import '@/assets/style/modal.less';
import event from '@/assets/utils/event';

type propTypes = {
	open: boolean,
	cancel: Function
}

const InputComponent = memo(forwardRef((props: { value: string }, ref) => {

	const { value } = props;
	const [title, setTitle] = useState(value);

	/* ref传递值 */
	useImperativeHandle(ref, () => {
		return {
			value: title
		}
	});
	useEffect(() => {
		event.on('setData', () => {
			setTitle(value);
		})
		return () => {
			event.off('setData');
		}
	}, []);

	return (
		<div className='add-common-use-item'>
			<p className='select-tip'>常用标题</p>
			<Input onChange={e => setTitle(e.target.value.trim())} value={title}
				maxLength={52} placeholder='输入自定义常用标题，不输入则为题目问题' />
		</div>
	)
}));

/* 管理常用题 */
function CommonQuestion(props: propTypes) {

	const { open, cancel } = props;
	const message = useMessage();
	const modal = useModal();
	const dispatch: AppDispatch = useDispatch();

	// 常用题列表
	const commonList = useSelector((state: RootState) => state.form).commonComponent;
	// 管理常用题弹框
	const [show, setShow] = useState(open);
	// 添加常用题的显示框
	const [addModalOpen, setAddModalOpen] = useState(false);
	// 常用标题
	const [commonTitle, setCommonTitle] = useState('');
	// 配置项
	const [configItem, setConfigItem] = useState<baseProps | objProps>({});


	/* 添加常用题 */
	const handleAddCommon = (item?: baseCompProps) => {
		!item ? item = baseCompList[0] : null;
		const componentItem = initComponent(item.tag);
		let clone = utils.deepClone(componentItem);// 深拷贝
		clone['id'] = utils.randomString(); //给表单增加id与属性
		setConfigItem(clone);
		setAddModalOpen(true);
	};
	/* 编辑常用题 */
	const handleEditCommon = (idx: number) => {
		const item = utils.deepClone(commonList[idx]);
		setCommonTitle(item.label);
		setConfigItem(item.config);
		setAddModalOpen(true);
		event.emit('setData');
	};
	/* 删除常用题 */
	const handleDeleteCommon = (idx: number) => {
		modal.confirm({
			title: '操作提示',
			content: '删除后，创建表单时无法再使用该题进行快速创建，是否删除？',
			okButtonProps: {
				danger: true
			},
			onOk() {
				// 执行删除操作
				try {
					dispatch(delCommonComp(idx));
					message.success('删除成功');
				} catch (error) {
					// to do something
				}
			}
		})
	};
	/* 确认添加常用题弹框 */
	const addModalOk = () => {
		if (!configItem.title.trim().length) {
			message.info('问题不能为空，请输入')
			return false;
		};
		let item = {
			label: commonTitle.length ? commonTitle : configItem.title,
			config: configItem as baseProps
		}
		dispatch(setCommonComp(item));
		setAddModalOpen(false);
		setCommonTitle('');
	};
	/* modal框完全关闭之后 */
	const afterClose = () => {
		cancel(false);
	};

	return (
		<Modal centered width={720} title="管理常用题" maskClosable={false} footer={null}
			open={show} afterClose={afterClose} onCancel={() => setShow(false)}>
			<div className='management-common-question-wrapper'>
				<div onClick={() => handleAddCommon()} className='primary-color opacity'>
					<PlusOutlined />
					<span className='add-common-text'>添加新的常用题</span>
				</div>
				{/* ------------ 管理常用题 -------------- */}
				<ul className='common-use-list'>
					{commonList.map((item, idx) => (
						<li key={'management-common-' + item.config.id} className={`${idx + 1 === commonList.length && idx + 1 >= 9 ? 'nobottom' : ''}`}>
							<span>{item.label}</span>
							<div className='common-use-option'>
								<span onClick={() => handleEditCommon(idx)} className='primary-color opacity'>编辑</span>
								<span onClick={() => handleDeleteCommon(idx)} className='primary-color opacity'>删除</span>
							</div>
						</li>
					))}
					{!commonList.length ?
						<Empty description={<span style={{ color: '#333' }}>暂无我的常用题</span>} style={{ marginTop: 60 }}>
							<Button style={{ fontSize: 13 }} onClick={() => handleAddCommon()} type="primary">新建常用题</Button>
						</Empty> : null
					}
				</ul >

				{/* ------------- 添加常用题的弹框 ---------------- */}
				<Modal centered width={830} title="添加常用题" maskClosable={false} open={addModalOpen}
					onOk={addModalOk} onCancel={() => setAddModalOpen(false)}>
					<div className='add-common-use-container'>
						<div className='add-common-use-inner-wrapper'>
							<div className='add-common-use-select'>
								<div className='add-common-use-item'>
									<p className='select-tip' style={{ marginTop: 10 }}>选择题型</p>
									<ul>
										{baseCompList.map((item, idx) => (
											<li key={'commom-use-add-comp-' + idx} onClick={() => handleAddCommon(item)}
												className={`${configItem.tag === item.tag ? 'active' : ''} hover-color border-color`}>
												<IconFont className="icon" type={'icon-' + item.icon} />
												<span>{item.label}</span>
											</li>
										))}
									</ul>
								</div>
								{/* -------- 设置常用标题 --------- */}
								<InputComponent value={commonTitle} />
							</div>
							<div className='common-form-body'>
								<div className='form'>
									<EditorContext list={[configItem as baseProps]} modal={true} />
								</div>
							</div>
						</div>
					</div>
				</Modal>
			</div >
		</Modal >
	)
}

export default memo(CommonQuestion);