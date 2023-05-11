import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface dataType {
	plat: String,
	back: Boolean
}

// 一但把用户信息保存到store中之后，任何组件都可以从仓库中获取
let initialState: dataType = {
	plat: 'web', //平台
	back: false //是否返回样式（登录模板时候的return 样式控制）
}

export const utilReducer = createSlice({
	// 命名空间
	name: 'util',
	// 初始化数据
	initialState,
	// 同步函数存放位置
	reducers: {
		setBack(state, data: PayloadAction<boolean>) {
			state.back = data.payload;
		}
	}
})

export const { setBack } = utilReducer.actions;

export default utilReducer.reducer;
