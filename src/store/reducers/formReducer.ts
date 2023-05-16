import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import utils from '@/assets/utils';
import { baseProps } from '@/assets/utils/formConfig/editorConfig';

export interface commonComp {
	label: string,
	config: baseProps
}

type headerTypes = {
	content: string,
	align: string,
	imageList: Array<string>
}

type formDataTypes = {
	header?: headerTypes,
	list?: Array<baseProps>,
	title?: string
}

type resultTypes = {
	content?: string,
	align?: string,
	imageList?: Array<string>
}

export interface dataType {
	focusId: number|string,
	commonComponent: Array<commonComp>,
	formList: Array<baseProps>,
	formData: formDataTypes,
	result: resultTypes
}

// 设置缓存
function setItem<T>(list: T) {
	utils.setItem({
		name: 'COMMON-COMP-FORM',
		value: list
	})
};

// 一但把用户信息保存到store中之后，任何组件都可以从仓库中获取
let initialState: dataType = {
	focusId: 0, //当前选中聚焦的id,
	commonComponent: utils.getItem('COMMON-COMP-FORM') ?? [], //常用题列表,
	formList: [], // 表单拖拽顺序之前列表，记录拖拽之前的数据,
	formData: {}, //表单数据
	result: {
		align: 'center',
		content: '',
		imageList: []
	} //结束语数据
}

export const formReducer = createSlice({
	// 命名空间
	name: 'formData',
	// 初始化数据
	initialState,
	// 同步函数存放位置
	reducers: {
		// 设置前选中id
		setFocusId(state, params: PayloadAction<number|string>) {
			// console.log(params);
			state.focusId = params.payload;
		},
		// 设置表单列表
		setFormList(state, params: PayloadAction<Array<baseProps>>) {
			state.formList = params.payload;
		},
		// 设置表单数据
		addFormData(state, params: PayloadAction<formDataTypes>) {
			state.formData = params.payload;
		},
		// 存储结束语数据
		addResult(state, params: PayloadAction<resultTypes>) {
			state.result = params.payload;
		},
		// 增加常用题
		setCommonComp(state, params: PayloadAction<commonComp>) {
			let configItem = params.payload;
			let idx = state.commonComponent.findIndex(item => item.config.id === configItem.config.id);
			// idx >= 0 时为修改操作，否则为新增操作
			idx >= 0 ? state.commonComponent.splice(idx, 1, configItem) : state.commonComponent.unshift(configItem);
			setItem(state.commonComponent);
		},
		// 删除常用题
		delCommonComp(state, params: PayloadAction<number>) {
			let idx = params.payload;
			state.commonComponent.splice(idx, 1);
			setItem(state.commonComponent);
		}
	}
})

export const { setFocusId, setFormList, addFormData, addResult, setCommonComp, delCommonComp } = formReducer.actions;

export default formReducer.reducer;
