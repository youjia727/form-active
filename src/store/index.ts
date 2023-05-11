// 将具体的reducer编译成统一的rootReducer，并且提供一个初始化store
import { configureStore } from '@reduxjs/toolkit';

// 导入具体的模块reducer
import utilReducer from './reducers/utilReducer';
import userReducer from './reducers/userReducer';
import formReducer from './reducers/formReducer';


// 将多个reducer编译成统一的reducer
const store = configureStore({
	reducer: {
		util: utilReducer,
		user: userReducer,
		form: formReducer
	}
})

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
