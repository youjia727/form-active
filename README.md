# 表单活跃系统 (Form-Active)

## 项目概述
**表单活跃系统**是一个现代化的可视化表单创建和管理平台，提供拖拽式表单设计、实时预览、多格式导出等功能。类似于简化的在线表单构建器（如Typeform、Google Forms），专注于提供优秀的表单创建体验。

## 核心功能

### 🎨 可视化表单设计
- **拖拽式界面**: 使用@dnd-kit库实现直观的组件拖拽
- **丰富组件库**: 输入框、选择器、日期选择器、签名板等多种表单字段
- **实时预览**: 创建过程中实时查看表单效果
- **题目模板**: 预置常用表单题目模板，快速复用

### ⚙️ 表单配置管理
- **基础配置**: 表单标题、描述、开始/结束时间设置
- **字段配置**: 每个表单字段的详细属性设置和验证规则
- **发布控制**: 灵活控制表单发布状态
- **常用题目管理**: 个性化保存和管理常用题目模板

### 📤 多格式导出
- **TSX文件导出**: 将表单导出为React TypeScript组件，方便集成
- **JSON查看**: 实时查看和编辑表单的JSON数据结构
- **ZIP包下载**: 打包下载表单相关资源文件
- **代码美化**: 使用js-beautify优化导出代码格式

### 🎯 高级特性
- **签名组件**: 集成手写签名功能，支持电子签名
- **图片裁剪**: 支持图片上传、裁剪和预览
- **响应式设计**: 适配不同屏幕尺寸
- **代码编辑器**: 集成Monaco Editor，提供代码查看和编辑体验

## 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript - 现代化前端开发
- **构建工具**: Vite - 快速的开发体验和构建
- **UI组件库**: Ant Design 5 - 企业级UI设计
- **状态管理**: Redux Toolkit - 可预测的状态管理
- **路由管理**: React Router 6 - 客户端路由
- **拖拽功能**: @dnd-kit - 现代拖拽库
- **样式处理**: Less预处理器 + CSS Modules
- **开发工具**: SWC编译器（通过Vite插件）

### 主要依赖
- **React生态**: react, react-dom, react-router-dom, react-redux
- **UI增强**: @ant-design/icons, react-free-scrollbar, react-image-crop
- **功能工具**: dayjs, axios, file-saver, clipboard, js-beautify
- **拖拽库**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/modifiers
- **开发工具**: @reduxjs/toolkit, @vitejs/plugin-react-swc

## 项目结构

```
form-active/
├── src/
│   ├── views/                 # 页面视图组件
│   │   ├── Create.tsx        # 主表单创建页面
│   │   ├── Home.tsx          # 首页/表单列表
│   │   ├── Login.tsx         # 用户登录页面
│   │   ├── 404.tsx           # 404错误页面
│   │   └── [其他视图组件]
│   ├── components/           # 可复用UI组件
│   │   ├── RenderConfig/     # 表单配置渲染器（核心）
│   │   ├── Preview/          # 表单预览组件
│   │   ├── JsonDrawer/       # JSON数据查看器
│   │   ├── layout/           # 布局组件
│   │   └── modal/            # 模态框组件
│   ├── store/               # 状态管理
│   │   ├── index.ts         # Redux store配置
│   │   └── reducers/        # Redux reducers
│   ├── router/              # 路由配置
│   ├── hooks/               # 自定义React Hooks
│   └── assets/              # 静态资源
│       ├── utils/           # 工具函数
│       ├── style/           # 样式文件
│       └── formConfig/      # 表单配置定义
├── public/                  # 公共资源
│   ├── download/            # 下载相关组件
│   ├── image/               # 图片资源
│   └── libs/                # 第三方库（Monaco Editor）
├── aidlc-docs/             # AI-DLC文档（逆向工程分析）
└── 配置文件
    ├── vite.config.ts      # Vite构建配置
    ├── tsconfig.json       # TypeScript配置
    ├── package.json        # 依赖管理
    └── .env文件            # 环境变量
```

## 使用场景

### 🏢 企业应用
- **员工调查问卷**: 收集员工反馈和满意度
- **客户反馈表单**: 收集客户产品使用体验
- **内部审批流程**: 创建各种审批表单（请假、报销等）
- **数据收集**: 市场调研、用户信息登记

### 🎓 教育领域
- **在线考试系统**: 创建测验和考试表单
- **学生信息收集**: 新生登记、课程评价
- **学术调研**: 研究数据收集表单
- **活动报名**: 课程、讲座、活动报名

### 👤 个人使用
- **活动组织**: 聚会、会议报名表
- **联系人管理**: 信息收集和整理
- **简单调研**: 个人项目数据收集
- **原型设计**: 快速创建表单原型

## 特色亮点

### 🚀 开发者友好
- **TSX导出**: 直接生成可用的React组件代码
- **类型安全**: 全面TypeScript支持，减少运行时错误
- **模块化设计**: 组件职责清晰，易于维护和扩展
- **配置驱动**: JSON配置支持动态扩展和定制

### ✨ 用户体验
- **直观操作**: 拖拽式设计，无需编码经验
- **实时反馈**: 即时预览，所见即所得
- **个性化**: 自定义常用题目，提高工作效率
- **多格式支持**: 满足不同使用场景需求

### 🛠 技术优势
- **现代化技术栈**: 使用最新的React生态工具
- **性能优化**: Vite构建，快速开发和热更新
- **可维护性**: 清晰的代码结构和类型定义
- **扩展性**: 模块化设计支持功能扩展

## 快速开始

### 环境要求
- Node.js 16.8+ 或更高版本
- npm 包管理器（推荐使用npm，避免包依赖问题）

### 安装依赖
```bash
# 克隆项目后，安装依赖
npm install
```

### 本地开发
```bash
# 启动开发服务器（默认端口3001）
npm run dev
```

### 构建生产版本
```bash
# 构建生产版本到dist目录
npm run build

# 预览生产构建
npm run preview
```

### 测试构建
```bash
# 测试环境构建
npm run test
```

## 技术细节

### 核心实现原理
1. **状态管理**: 使用Redux Toolkit管理表单状态，包括表单数据、常用题目、焦点状态等
2. **组件通信**: 结合Props、Redux、事件总线实现灵活的组件通信
3. **拖拽实现**: 基于@dnd-kit实现现代拖拽体验，支持排序和位置调整
4. **配置系统**: 通过editorConfig.ts集中管理表单组件配置，支持动态扩展

### 关键组件说明
- **Create.tsx**: 主创建页面，集成左侧组件库、中间画布、右侧配置面板
- **RenderConfig**: 表单渲染核心，处理表单字段的渲染和交互
- **Preview组件**: 提供完整的表单预览体验，支持不同模式
- **JsonDrawer**: 集成Monaco Editor，提供专业的JSON查看和编辑

## 注意事项

### Ant Design 5 兼容性
```markdown
antd5已放弃Less，使用CSS-in-JS方式注入样式，安装antd后无需额外引入样式文件。
antd4则需要手动引入样式文件。
```

### Less 预处理器配置
```markdown
Vite 4默认支持Less，但需要以`.module.less`命名才能使用模块化样式。
为方便全局使用Less，建议手动安装并配置全局样式。
```

### 样式兼容处理
```markdown
Ant Design 支持最近2个版本的现代浏览器。如需兼容旧版浏览器，请进行降级处理：

代码库中使用:where选择器降低CSS选择器优先级。如需支持旧版浏览器或解决TailwindCSS优先级冲突，
可以使用@ant-design/cssinjs取消默认降权操作（注意版本与antd保持一致）。

样式修改示例：
CSS样式：
 :root .ant-form-item {
    margin-bottom: 26px;
}

Less样式：
 :root {
    .ant-form-item {
        margin-bottom: 26px;
    }
 }
```

## 扩展开发

### 添加新表单组件
1. 在`src/assets/utils/formConfig/editorConfig.ts`中定义组件配置
2. 创建对应的React组件文件
3. 在`RenderConfig`组件中添加渲染逻辑
4. 更新类型定义确保类型安全

### 自定义主题
1. 修改`src/assets/style/global.less`中的全局样式变量
2. 配置Ant Design主题令牌（通过ConfigProvider）
3. 使用CSS变量或Less变量统一样式管理

### 集成后端API
1. 在`src/assets/utils/`中添加API调用函数
2. 创建对应的Redux slice管理API状态
3. 在组件中集成数据获取和提交逻辑

## 项目状态
- **当前版本**: 功能完整的可视化表单构建器
- **代码质量**: 中等偏上，架构清晰，类型安全良好
- **测试覆盖**: 需要补充单元测试和集成测试
- **扩展性**: 良好，支持功能模块化扩展

## 贡献指南
欢迎提交Issue和Pull Request来改进项目。在提交代码前，请确保：
1. 代码符合TypeScript类型检查
2. 保持现有的代码风格和结构
3. 添加必要的注释和文档
4. 测试新功能的兼容性

## 许可证
本项目基于MIT许可证开源，详情请查看LICENSE文件。

---

**表单活跃系统** - 让表单创建变得更简单、更高效！