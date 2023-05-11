import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import useMessage from "@/hooks/useMessage";

// 一但把用户信息保存到store中之后，任何组件都可以从仓库中获取
export interface userType {
	userinfo: any;
	isLoggedIn: Boolean;
}

const initialState: userType = {
	userinfo: null, //用户信息
	isLoggedIn: false //是否登录
}

const userReducer = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// 设置用户信息
		setUserInfo(state, data: PayloadAction<any>) {
			state.userinfo = data.payload;
		},
		editName(state) {
			state.userinfo = 'test';
		}
	},
	// 监控异步请求的变化
	extraReducers(builder) {
		builder
			.addCase(getUserInfo.pending, (state, data) => {
				useMessage().loading('加载中...');
				// 等待状态
				console.log(data)
			})
			.addCase(getUserInfo.fulfilled, (state, data: PayloadAction<any>) => {
				// 成功状态
				useMessage().close();
				state.userinfo = data.payload;
				console.log(data)
			})
			.addCase(getUserInfo.rejected, (state, error) => {
				// 失败状态
				console.log(error)
			})
	},
	// ts语法不再推荐使用对象表示法，使用“生成器表示法”。
	// extraReducers: {
	// 	[getUserInfo.fulfilled](state: userType, actions: PayloadAction<any>) {
	// 		console.log("获取成功")
	// 	}
	// }
})

export const { setUserInfo, editName } = userReducer.actions;

// 导出异步函数
export const getUserInfo = createAsyncThunk('getUserInfoAsync', async (params: any, store) => {
	console.log('这是传递的参数========', params)
	// console.log(store)
	const res = await new Promise((resolve, reject) => {
		setTimeout(() => {
			return resolve('test')
		}, 3000);
	})
	return res;
})

export default userReducer.reducer;
