import { memo, useState, useEffect } from "react";
import { Space, Button } from "antd";
import IconFont from "./IconFont";
import Spin from './Spin';
import loadMonaco from "@/assets/utils/loadMonaco";
import { saveAs } from 'file-saver';
import ClipboardJS from 'clipboard';
import beautify from "js-beautify";
import useMessage from "@/hooks/useMessage";
import '@/assets/style/jsonDrawer.less';

type propsTypes = {
	jsonString: string,
	open: boolean
};

type objTypes = {
	[key: string]: any
}

const beautifierConf: objTypes = {
	indent_size: '2',
	indent_char: ' ',
	max_preserve_newlines: '-1',
	preserve_newlines: false,
	keep_array_indentation: false,
	break_chained_methods: false,
	indent_scripts: 'normal',
	brace_style: 'end-expand',
	space_before_conditional: true,
	unescape_strings: false,
	jslint_happy: true,
	end_with_newline: true,
	wrap_line_length: '110',
	indent_inner_html: true,
	comma_first: false,
	e4x: true,
	indent_empty_lines: true
}

let monaco: objTypes;

/* 查看json文件 */
function JsonDrawer(props: propsTypes) {

	const { jsonString, open } = props;
	const [loading, setLoading] = useState(true);
	const [editor, setEditor] = useState<objTypes | null>(null);
	// 美化的json字符串
	const [beautifierJson, setBeautifierJson] = useState('');

	const message = useMessage();

	/* 周期函数 */
	useEffect(() => {
		if (open) {
			// 美化json格式
			const codeStr = beautify(jsonString, beautifierConf);
			setBeautifierJson(codeStr);
			// 加载本地的monaco-editor编辑器
			loadMonaco((val: objTypes) => {
				// 加载完成逻辑
				monaco = val;
				setLoading(false);
				setEditorValue('editor', codeStr);
			})
		}
	}, [open])

	/* 设置editor数据对象 */
	const setEditorValue = (id: string, codeStr: string) => {
		if (editor) {
			editor.setValue(codeStr)
		} else {
			setEditor(() => monaco.editor.create(document.getElementById(id) as HTMLElement, {
				value: codeStr,
				theme: 'vs-dark',
				language: 'json',
				automaticLayout: true
			}));
		}
	};
	/* 复制json */
	const copyJson = () => {
		const clipboard = new ClipboardJS('.copy-json-btn', {
			text: () => {
				message.success('代码已复制到剪切板');
				return beautifierJson;
			}
		});
		clipboard.on('error', e => {
			message.error('代码复制失败，稍后重试')
		})
	};
	/* 导出json文件 */
	const exportJsonFile = () => {
		const blob = new Blob([beautifierJson], { type: 'text/plain;charset=utf-8' });
		saveAs(blob, 'formData.json');
	}

	return (
		<Spin spinning={loading} tips="数据加载中..." delay={500}>
			<div className="json-wrapper">
				<div className="option-bar">
					<Space size={0}>
						<Button type="link" icon={<IconFont type="icon-fuzhi" />} onClick={copyJson} className="copy-json-btn">复制JSON</Button>
						<Button type="link" icon={<IconFont type="icon-xiazai" />} onClick={exportJsonFile}>导出JSON文件</Button>
					</Space>
				</div>
				<div id="editor" className="json-editor"></div>
			</div>
		</Spin>
	)
}

export default memo(JsonDrawer);