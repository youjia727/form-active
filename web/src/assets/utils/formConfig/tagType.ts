//题目的类型
export default {
  //文本分类
  inputCategory: [{
    text: '单行文本',
    tag: 'input'
  }, {
    text: '多行文本',
    tag: 'textarea'
  }],
  //选择题分类
  selectCategory: [{
    text: '单选题',
    tag: 'radio'
  }, {
    text: '多选题',
    tag: 'checkbox'
  }, {
    text: '下拉题',
    tag: 'select'
  }],
  //对日期进行编辑信息
  dateModeCategory: [{
    text: '年 月',
    mode: 'month'
  }, {
    text: '年 月 日',
    mode: 'date'
  }, {
    text: '年 月 日 时 分',
    mode: 'minute'
  }],
  // 对日期分类编辑信息
  dateCategory: [{
    text: '单个日期',
    tag: 'date'
  }, {
    text: '日期范围',
    tag: 'range'
  }],
  rateCategory: [{
    text: '评分题',
    tag: 'rate'
  }],
  multipleInputCategory: [{
    text: '多段填空',
    tag: 'multipleInput'
  }],
  cascaderCategory: [{
    text: '层级联动',
    tag: 'cascader'
  }],
}
