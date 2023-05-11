import ReactDOM from 'react-dom/client';
import App from './App';
// legacyLogicalPropertiesTransformer
import { StyleProvider } from '@ant-design/cssinjs';
// 定义当前项目的路由模式BrowserRouter是history模式，HashRouter是哈希模式
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, Spin } from 'antd';
import store from './store';
// 缓存页面组件
// import { AliveScope } from 'react-activation';
import { LoadingOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import '@/assets/style/public.less';

dayjs.locale('cn');

const antIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />;

// 定义设置的类型
type ThemeType = {
	borderRadius: number;
};
// 配置主题色
const themeData: ThemeType = {
	borderRadius: 4
};


// 全局修改加载的图标
Spin.setDefaultIndicator(antIcon);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Router>
		{/* hashPriority, transformers 兼容低版本浏览器样式问题  hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}*/}
		<StyleProvider>
			<ConfigProvider locale={zhCN} theme={{
				token: {
					borderRadius: themeData.borderRadius
				}
			}}>
				<Provider store={store}>
					<App />
					{/* <AliveScope>
						<App />
					</AliveScope> */}
				</Provider>
			</ConfigProvider>
		</StyleProvider>
	</Router>
)
