/**
 * * 发布订阅模式
 * */

class Subscribe {
  private subscribes;
  constructor() {
    //创建执行的事件中心
    this.subscribes = new Map();
  };
  // 初始化id
  getId(): number {
    return Date.now() + Math.random();
  };
  // 订阅事件的触发器
  on(eventName: string, callBack: any): number {
    // 创建名称事件序列
    const subscribeCallBacks = this.subscribes.get(eventName) || new Map();
    // 根据id给事件序列化
    const uuid = this.getId();
    subscribeCallBacks.set(uuid, callBack);
    // 赋值给eventName事件
    this.subscribes.set(eventName, subscribeCallBacks);
    return uuid;
  };
  // 发布事件
  emit(eventName: string, ...args: any[]) {
    // 判断事件队列是否存在 eventName 如果没有就创建一个空对象
    const subscribeCallBacks = this.subscribes.get(eventName) || new Map();
    // 循环获取 eventName 事件对象上的事件序列
    for (const [uuid, callback] of subscribeCallBacks) {
      callback.call(this, ...args);
    };
  };
  // 删除事件
  off(eventName?: string, uuid?: number) {
    // 判断eventName是否有值
    if (!eventName) {
      // 如果没有值就删除所有事件
      this.subscribes.clear();
      return;
    };
    // 判断事件是否存在
    const isContent = this.subscribes.has(eventName);
    if (isContent) {
      // 事件存在判断是否有删除的id
      if (uuid) {
        // 有id就删除这个事件中的id事件
        const subscribeCallBacks = this.subscribes.get(eventName);
        // 判断id是否正确
        const idSure = subscribeCallBacks.has(uuid);
        if (idSure) {
          // 如果存在就删除id项，并将原来数据存放入事件中
          // 没有就不做操作
          subscribeCallBacks.delete(uuid);
          this.subscribes.set(eventName, subscribeCallBacks);
        };
      } else {
        // 没有id就删除这个事件里面的所有事件序列
        this.subscribes.delete(eventName);
      };
    };
  };
};

const event = new Subscribe();
export default event;
