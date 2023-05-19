import { memo } from "react";
import { Input } from 'antd';
import { baseProps, optionProps } from "@/assets/utils/formConfig/editorConfig";
import { useUpdate } from "@/hooks/useUpdate";

const { TextArea } = Input;

type propsTypes = {
	item: baseProps | optionProps,
	attr: string,
	tip: string,
	className: string
}

const TextAreaComponent = (props: propsTypes) => {

	const { item, attr, tip, className } = props;
	const key = attr as keyof typeof item;
	const update = useUpdate();

	return (
		<TextArea placeholder={tip} value={item[key]} autoSize
			onChange={e => update(() => item[key] = e.target.value)}
			className={`form-item-input ${className}`}
		/>
	)
};

export default memo(TextAreaComponent);