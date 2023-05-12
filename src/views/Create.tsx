import { useCallback, useEffect, useState, useRef } from "react";
import { Space, Button, DatePicker, Switch, Divider, Drawer } from 'antd';
import IconFont from "@/components/IconFont";
// 渲染表单配置的主页面
import RenderConfigContainer from '@/components/RenderConfig';
// 结束语设置页面
import Result from './Result';
// 管理常用题
import CommonQuestion from '@/components/modal/CommonQuestion';
// 图标
import { FormOutlined } from '@ant-design/icons';
// 美化滚动条组件
import FreeScrollBar from 'react-free-scrollbar';
// 预览页面
import Preview from "@/components/Preview";
import {
	baseCompList, templateCompList, initComponent,
	baseCompProps, baseProps
} from "@/assets/utils/formConfig/editorConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { setFocusId, addFormData } from "@/store/reducers/formReducer";
import useMessage from "@/hooks/useMessage";
import event from "@/assets/utils/event";
import utils from '@/assets/utils';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { commonComp } from "@/store/reducers/formReducer";
import '@/assets/style/create.less';


interface headerTypes {
	content: string,
	align: string,
	imageList: Array<string>
};

interface formListType {
	list?: Array<baseProps>
}

interface formConfigTypes extends formListType {
	title?: string,
	header?: headerTypes,
	handleFocus?: Function
};

// 滚动到第一个错误的位置
function scrollError(targetId: string) {
	let anchorElement = document.getElementById(`form-question-${targetId}`);
	if (anchorElement) {
		anchorElement.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		})
	}
};

export default function Create() {

	const message = useMessage();

	const formRef = useRef<formConfigTypes>(null);

	const dispatch: AppDispatch = useDispatch();


	/**
	 * * 定义数据
	 *  */
	// 我的常用题
	const mineUserComponent = useSelector((state: RootState) => state.form).commonComponent;
	// 常用题的显示框
	const [commonModalOpen, setCommonModalOpen] = useState(false);
	// 开始时间
	// dayjs(values.date).format('YYYY-MM-DD')
	const [startDate, setStartDate] = useState('');
	// 结束时间
	const [endDate, setEndDate] = useState('');
	// 发布状态
	const [status, setStatus] = useState(false);
	// 是否编辑结束语
	const [editResult, setEditResult] = useState(false);
	// 是否展示预览页面
	const [drawerOpen, setDrawerOpen] = useState(false);
	// 表单数据
	const [formData, setFormData] = useState<formConfigTypes | null>(null);
	// 结束语数据
	const result = useSelector((state: RootState) => state.form.result);


	/**
	 * * 生命周期函数
	 *  */
	useEffect(() => {
		drawerOpen ? utils.lockScroll() : utils.unlockScroll();
	}, [drawerOpen])

	/**
	 * * 自定义函数
	 *  */

	/* 开始时间限制选择 */
	const startDisableDate = (current: Dayjs): boolean => {
		let bool = (current && current <= dayjs().subtract(1, 'day').endOf('day'));
		if (endDate) {
			return bool || current > dayjs(endDate).endOf('day');
		} else {
			return bool;
		}
	};
	/* 结束时间限制选择 */
	const endDisableDate = (current: Dayjs): boolean => {
		let bool = (current && current <= dayjs().subtract(1, 'day').endOf('day'));
		if (startDate) {
			return current < dayjs(startDate).subtract(1, 'day').endOf('day');
		} else {
			return bool;
		}
	};
	/* 日期变化 设置日期 */
	const dateChange = (dateString: string, type: string) => {
		type === 'start' ? setStartDate(dateString) : setEndDate(dateString);
	};
	/* 子组件修改 editResult 属性的回调函数 */
	const showResultPage = useCallback((visible: boolean) => {
		setEditResult(visible)
	}, []);
	/* 点击选择左侧菜单组件 */
	const handleSelectComponent = (item: baseCompProps, type: string) => {
		const componentItem = initComponent(item.tag);
		let clone = utils.deepClone(componentItem);// 深拷贝
		clone['id'] = utils.randomString(); //给表单增加id与属性
		type === 'template' && Object.assign(clone, item.config);
		// 将单项数据传递给其它需要使用的组件
		event.emit('transfer-data', clone);
	};
	/* 添加我的常用题 */
	const handleAddCommonComponent = (item: commonComp) => {
		let clone = utils.deepClone(item.config);// 深拷贝
		clone['id'] = utils.randomString(); //给表单增加id与属性
		event.emit('transfer-data', clone);
	};
	/* 编辑结束语 */
	const handleEditResult = () => {
		const { current } = formRef;
		const formData = {
			header: current?.header,
			title: current?.title,
			list: current?.list
		}
		// 将数据放入redux中
		dispatch(addFormData(formData));
		dispatch(setFocusId(0));
		setEditResult(true);
	};
	/* 判断表单内容是否填写 */
	const checkForm = () => {
		const { current } = formRef;
		// 至少设置一个填写项
		if (current && !current?.list?.length) {
			message.info('至少设置一个填写项');
			dispatch(setFocusId(0));
			return false;
		};
		// 标题不能为空
		if (current && !current?.title?.trim().length) {
			message.info('表单标题不能为空');
			dispatch(setFocusId('title'));
			scrollError('title');
			current?.handleFocus && current.handleFocus();
			return false;
		};
		// 问题不能为空
		let item = current?.list?.find(el => !el.title.trim().length);
		if (item) {
			message.info('问题不能为空');
			scrollError(item.id);
			dispatch(setFocusId(item.id));
			return false;
		};
		return current;
	};
	/* 点击预览 */
	const handlePreview = () => {
		const values = checkForm();
		if (!values) return;
		setFormData({
			...values
		});
		dispatch(setFocusId(0));
		setDrawerOpen(true);
	};
	/* 完成创建 */
	const handleSubmit = () => {
		const values = checkForm();
		if (!values) return;
		message.info('请打开控制查看打印结果');
		console.log('表单描述语：', values.header);
		console.log('表单列表数据：', values.list);
		console.log('表单结束语：', result);
	};

	return (
		<div className="create-form-page">
			{!editResult ?
				<div className="create-form-wrapper">
					{/* 左侧选择表单类型 */}
					<aside className="sider-menu">
						<div className="sider-inner-wrapper">
							<FreeScrollBar>
								<div className="menu-box">
									{/* 基本题目 */}
									<div className="classify-config">
										<h3>添加题目</h3>
										<ul className="component-render">
											{baseCompList.map((item, idx) => (
												<li key={'basic-comp-' + idx}
													className='hover-color border-color'
													onClick={() => handleSelectComponent(item, 'base')}
												>
													<IconFont className="icon" type={'icon-' + item.icon} />
													<span>{item.label}</span>
												</li>
											))}
										</ul>
									</div>
									{/* 题目模板 */}
									<div className="classify-config">
										<h3>题目模板</h3>
										<ul className="component-render">
											{templateCompList.map((item, idx) => {
												return <li key={'template-comp-' + idx}
													className='common-li hover-color border-color'
													onClick={() => handleSelectComponent(item, 'template')}>
													<span>{item.label}</span>
												</li>
											})}
										</ul>
									</div>
									{/* 设置常用题型 */}
									<div className="classify-config">
										<div className="component-edit">
											<h3>我的常用题</h3>
											{mineUserComponent.length ?
												<span
													onClick={() => setCommonModalOpen(true)}
													className="option-component-btn primary-color opacity">管理</span> : null
											}
										</div>
										<ul className="component-render">
											{
												mineUserComponent.length ?
													mineUserComponent.map((item, idx) => {
														return <li key={'mine-component-' + idx} title={item.label}
															className='common-li hover-color border-color'
															onClick={() => handleAddCommonComponent(item)}>
															<span className="mine-component-item">{item.label}</span>
														</li>
													}) :
													<div className="no-setting">
														暂无我的常用，立即&nbsp;
														<span
															onClick={() => setCommonModalOpen(true)}
															className="active opacity">添加</span>
													</div>
											}
										</ul>
										{/* ---------- 常用题的modal框展示 ---------- */}
										{commonModalOpen ? <CommonQuestion open={commonModalOpen} cancel={() => setCommonModalOpen(false)} /> : null}
									</div>
								</div>
							</FreeScrollBar>
						</div>
					</aside>
					<section className="form-content">
						{/* 表单的配置 */}
						<div className="form-config-page">
							{/*--------- 展示form配置的内容------------ */}
							<RenderConfigContainer ref={formRef} />
							{/* 结束语-分隔线 */}
							<div className="form-bottom">
								<Divider dashed style={{ fontSize: 14 }}>
									<div className="form-bottom-btn hover-color" onClick={handleEditResult}>
										<span>自定义结束语</span>
										<FormOutlined className="btn-edit-icon" />
									</div>
								</Divider>
							</div>
						</div>
					</section>
					{/* 右侧设置时间与发布状态 */}
					<aside className="release-config">
						<div className="right-sider-config">
							{/* 开始时间 */}
							<div className="right-sider-config-item">
								<span className="text-label">开始时间</span>
								<DatePicker
									getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
									value={startDate ? dayjs(startDate) : null}
									onChange={(date: any, dateString: string) => dateChange(dateString, 'start')}
									disabledDate={startDisableDate}
									placeholder='开始时间'
									showToday={false}
								/>
							</div>
							{/* 结束时间 */}
							<div className="right-sider-config-item">
								<span className="text-label">结束时间</span>
								<DatePicker
									getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
									value={endDate ? dayjs(endDate) : null}
									onChange={(date: any, dateString: string) => dateChange(dateString, 'end')}
									disabledDate={endDisableDate}
									placeholder='结束时间'
									showToday={false}
								/>
							</div>
							{/* 发布状态 */}
							<div className="right-sider-config-item">
								<span className="text-label">发布状态</span>
								<Switch size="small" onChange={() => setStatus(!status)} checked={status} />
							</div>
						</div>
						{/* 预览、创建 */}
						<Space size={20} className="operate-setting">
							<Button onClick={handlePreview}>预览</Button>
							<Button type="primary" onClick={handleSubmit}>完成创建</Button>
						</Space>
					</aside>
				</div> :
				<>
					{/* 结束语页面展示 */}
					<Result callback={showResultPage} />
				</>
			}

			{/* ------------- 预览页面 --------------- */}
			<Drawer
				rootClassName="preview-drawer-container"
				className="preview-drawer-box"
				mask={false}
				width='100%'
				placement="right"
				onClose={() => setDrawerOpen(false)}
				open={drawerOpen}
			>
				<Preview mode='preview' formData={formData} open={drawerOpen} />
			</Drawer>
		</div>
	)
}