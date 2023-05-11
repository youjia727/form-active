import { Empty } from 'antd';
import '@/assets/style/empty.css';


export default function Custom() {
	return (
		<div className='not-find'>
			<Empty
				image="https://dajishizhijia.oss-cn-beijing.aliyuncs.com/open/web/static/images/404.png"
				imageStyle={{
				  height: 280,
				}}
				description={
				  <span>访问的页面不存在！！</span>
				}>
			</Empty>
		</div>
	)
}

