import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function View() {
	const [search, setSearch] = useSearchParams();

	/**
	 * * 生命周期函数
	 *  */
	// useEffect(() => {
	// 	setSearch({
	// 		type: 'captcha'
	// 	})
	// }, [])

	return (
		<div>这是列表组件页面组件</div>
	)
}

export default View;