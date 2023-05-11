import { useSearchParams } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import IconFont from './IconFont';
import { memo, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

type propTypes = {
	callBack: Function
}

const items: MenuItem[] = [{
	label: '我创建的',
	key: 'mycreate',
	icon: <FileAddOutlined />
}, {
	label: '回收站',
	key: 'trash',
	icon: <IconFont type="icon-shanchu" />
}]

function MenuSider(props: propTypes) {
	const [search, setSearch] = useSearchParams();

	/**
	 * * 定义数据方法
	 *  */
	// 当前路由字符串
	const [type, setTye] = useState(() => {
		let bool = items.some((el: MenuItem) => Object.is(el?.key, search.get('type')));
		let str = bool ? search.get('type') + '' : 'mycreate';
		props.callBack(str);
		return str;
	});

	/**
	 * * 自定义函数方法
	 *  */
	// 选中菜单回调函数
	function handleSelect(menuProps: any) {
		const { key } = menuProps;
		// 改变路由
		setTye(key);
		// 设置路由参数
		setSearch({
			type: key
		})
		props.callBack(key);
	};

	return (
		<Menu
			theme="light"
			selectedKeys={[type]}
			mode="inline"
			items={items}
			onSelect={handleSelect}
		/>
	)
}

export default memo(MenuSider);