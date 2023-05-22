# 可视化表单低代码平台

## 简介
react可视化表单设计及代码生成器，可将多种不同的组件通过拖拽、排序、组合成整套适合你的表单组件；包括问题关联，动态删减，问题描述、图片搭配、设置标签、多样模板等功能，使用配套组件能更好的完成任务需求。
- [预览地址](http://form.lrenting.cn/create)

## 技术分析
- react + react-dom 18.2.0
- react-router-dom 6.8.1
- typescript 4.9.3
- vite 4.1.0
- @reduxjs/toolkit 1.9.2
- antd 5.4.6
- @dnd-kit 6.0.0+
- monaco-editor + js-beautify + file-saver 可视化文件导出

## 运行
- 确保已经安装node.js 16.8+
- 首次下载项目后，安装项目依赖：

```
建议使用npm安装，避免使用其它方式在安装过程中丢包的问题

npm install
```

### 本地运行
```
npm run dev
```

### 构建打包
```
npm run build
```

## 注意事项

- antd5
```
antd5已经放弃less，使用css-in-js的方式注入样式，所以安装antd之后不需要引入样式文件都可使用，
但是antd4必须要引入样式文件才行。
```

- less
```
vite4中已经默认安装less使用，但是建立样式文件必须是.module.less才能使用，
所以为了方便全局使用less，还是建议手动安装。
```

- 样式兼容
```
Ant Design 支持最近 2 个版本的现代浏览器。如果你需要兼容旧版浏览器，请根据实际需求进行降级处理：
代码库中使用的是:where 选择器，降低 CSS Selector 优先级。
如果你需要支持的旧版浏览器（或者如 TailwindCSS 优先级冲突），
你可以使用 @ant-design/cssinjs 取消默认的降权操作（请注意版本保持与 antd 一致），
并且在代码库中修改Ant Design的css前面加上:root即可，如下所示：

css样式修改：
 :root .ant-form-item {
	margin-bottom: 26px;
};

less样式修改：
 :root {
	 .ant-form-item {
		 margin-bottom: 26px;
	 }
 }

```