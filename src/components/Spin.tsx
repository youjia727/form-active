import { Spin } from "antd";

type propTypes = {
	delay?: number,
	spinning?: boolean,
	height?: number | string,
	tips?: string,
	children: JSX.Element
}

function View(props: propTypes) {

	return (
		<Spin
			delay={props.delay ?? 10}
			spinning={props.spinning}
			tip={props?.tips ?? '内容即将呈现...'}
			style={{
				color: '#414a60',
				backgroundColor: '#fff',
				height: props.height ?? '100%',
				maxHeight: 'initial'
			}}>
			{props.children}
		</Spin>
	)
}

export default View;