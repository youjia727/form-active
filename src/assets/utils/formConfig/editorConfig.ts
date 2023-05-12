export interface objProps {
    [key: string]: any
}

export interface baseCompProps {
    label: string,
    icon?: string,
    tag: string,
    config?: objProps
}

export interface optionProps {
    mode: number, // 1代表普通选择 0代表其他 可以输入内容
    label: string,
    marks: Array<string>, //标签数组
    id: number,
    imgUrl: string, //图片地址
    jumpTo: Array<string> //关联选项
}

export interface baseProps {
    title: string,
    imgUrl: string,
    note: string,
    tag: string,
    type: string,
    rules: any[],
    required: boolean,
    isShow: boolean,
    noteShow: boolean,
    isSetJumped: Array<string>,
    [key: string]: any
};

export interface cascaderModeTypes {
    label: string,
    text: string
}

/* 基本信息的配置 */
const baseConfig: baseProps = {
    title: '', //标题
    imgUrl: '', //标题图片
    note: '', //题目描述说明
    //当前渲染的类型 input类型，select类型，date类型，cascader层级联动类型
    type: '',
    //当前组件的名称 比如 input类型中的input和textarea, select类型中的radio、checkbox、select等
    tag: '',
    rules: [], //验证数组
    required: true, //是否必填
    isShow: true, // 是否显示题目
    noteShow: false, //是否显示描述
    // ['lgq9vw8s-1']
    // lgq9vw8s -> 代表设置关联本题的关联源id
    // 1 -> 代表关联源选项的id（也是提交的值） 
    isSetJumped: [] //被设置跳转题的源数据，只有选择题才能有逻辑关联存在
};

/* 组件的属性 */
// 输入框的属性
const inputInit = {
    max: null, //最多输入内容
    min: null
};
// 选择题的属性
const selectInit = {
    max: null, //最多选择几项
    min: null, //最少选择几项
    multiple: false, //是否多选
    options: [{
        mode: 1, // 1代表普通选择 0代表其他 可以输入内容
        label: '',
        marks: [], //标签数组
        id: 1,
        imgUrl: '', //图片地址
        jumpTo: [] //关联选项
    }, {
        mode: 1,
        label: '',
        marks: [],
        id: 2,
        imgUrl: '',
        jumpTo: []
    }]
};
// 多段填空
const multipInputInit = {
    question: '填空1＿＿＿＿，填空2＿＿＿＿'
};
// 打分题
const rateInit = {
    count: 5, //评分数
    rules: [{
        pattern: '/^\\+?[1-9]\\d*$/',
        message: '此题为必答题，请先作答'
    }]
};
// 日期题
const dateInit = {
    picker: 'date', //minute | date | month | year
};
// 层级联动
const cascaderInit = {
    levelCount: 3, //层级数
    cascaderMode: [{
        label: 'levelOne',
        text: ''
    }, {
        label: 'levelTwo',
        text: ''
    }, {
        label: 'levelThree',
        text: ''
    }],
    setDetail: false,
    details: {
        label: 'details',
        text: '填写者输入区'
    },
    // 配置option的属性
    fieldNames: {
        text: 'text',
        value: 'value',
        children: 'children'
    },
    options: []
}


/* 根据组件的tag标签生成组件的属性 */
export const initComponent = (tag: string, initValues: objProps = {}) => {
    let config: baseProps = {
        ...baseConfig,
        tag
    };
    switch (tag) {
        case 'input':
        case 'textArea':
            config.type = 'input';
            Object.assign(config, inputInit, initValues);
            break;
        case 'radio':
        case 'checkbox':
        case 'select':
            config.type = 'select';
            Object.assign(config, selectInit, initValues)
            break;
        case 'multipInput':
            config.type = 'multipInput';
            Object.assign(config, multipInputInit, initValues)
            break;
        case 'rate':
            config.type = 'rate';
            Object.assign(config, rateInit, initValues)
            break;
        case 'date':
            config.type = 'date';
            Object.assign(config, dateInit, initValues)
            break;
        case 'cascader':
        case 'address':
            config.type = 'cascader';
            Object.assign(config, cascaderInit, initValues)
            break;
        default:
            break;
    }
    return config;
};

// 基本组件展示 (icon 是阿里iconfont上放入项目管理的，可以在IconFont.tsx 文件中查看)
export const baseCompList: Array<baseCompProps> = [{
    label: '填空题',
    icon: 'plusblanksfill',
    tag: 'input'
}, {
    label: '单选题',
    icon: 'danxuan-xuanzhong',
    tag: 'radio'
}, {
    label: '多选题',
    icon: 'duoxuanti',
    tag: 'checkbox'
}, {
    label: '下拉题',
    icon: 'xialati',
    tag: 'select'
}, {
    label: '多段填空',
    icon: 'duoduantiankong',
    tag: 'multipInput'
}, {
    label: '评分题',
    icon: 'wendangpingfenpeizhi',
    tag: 'rate'
}, {
    label: '日期题',
    icon: 'a-ziyuan22',
    tag: 'date'
}, {
    label: '级联选择',
    icon: 'guanlian',
    tag: 'cascader'
}];

// 常用组件展示
export const templateCompList = [{
    label: '姓名',
    tag: 'input',
    config: {
        title: '姓名',
        rules: [{
            pattern: '/^[\\u4E00-\\u9FA5]{1}[\\u4E00-\u9FA5\\·\\.\\-]{0,8}[\\u4E00-\\u9FA5]{1}$/',
            message: '姓名不符合规范'
        }],
        max: 15,
        min: 2
    }
}, {
    label: '手机号',
    tag: 'input',
    config: {
        title: '手机号',
        rules: [{
            pattern: '/^1[35789]\\d{9}$/',
            message: '请输入正确的手机号'
        }],
        max: 11
    }
}, {
    label: '性别',
    tag: 'radio',
    config: {
        title: '性别',
        options: [{
            mode: 1,
            label: '男',
            marks: [], //标签数组
            id: 1,
            imgUrl: '', //图片地址
            jumpTo: [] //关联选项
        }, {
            mode: 1,
            label: '女',
            marks: [],
            id: 2,
            imgUrl: '',
            jumpTo: []
        }]
    }
}, {
    label: '邮箱',
    tag: 'input',
    config: {
        title: '邮箱',
        rules: [{
            pattern: '/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$/',
            message: '邮箱格式不符合规范'
        }],
        max: 52
    }
}, {
    label: '地址',
    tag: 'address',
    config: {
        title: '地址',
        cascaderMode: [{
            label: 'province',
            text: '省/自治区/直辖市'
        }, {
            label: 'city',
            text: '市'
        }, {
            label: 'district',
            text: '区/县'
        }],
        options: [], //配置数据
        setDetail: false, //是否设置其他输入
        details: {
            label: 'address',
            text: '详细地址'
        }
    }
}];