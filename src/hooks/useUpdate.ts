import { useState } from 'react';

type objProps = {
    [key: string]: any
}

//已经代理过的对象缓存
const toProxy = new WeakMap();
const toRaw = new WeakMap();

/* 代理模式的更新数据方法 */
export function useReactive(data: objProps) {
    // 更新数据的方法
    const [_, update] = useState(0);

    // 深度代理
    function deepProxy(data: objProps) {
        // 判断是否是对象
        if (typeof data !== 'object' || data === null) {
            return data;
        }
        let observed = toProxy.get(data);
        // 查询缓存
        if(toProxy.get(data)) {
            return observed;
        }
        if (toRaw.get(data)) {
            return data
        }

        // 判断是否是数组
        if (data instanceof Array) {
            data.forEach((item, index) => {
                data[index] = deepProxy(item);
            });
        } else {
            Reflect.ownKeys(data).forEach(key => {
                data[key as keyof typeof data] = deepProxy(data[key as keyof typeof data]);
            });
        }
        //开始代理
        observed = new Proxy(data, {
            get(target, key, receiver) {
                return Reflect.get(target, key, receiver);
            },
            set(target, key, value, receiver): boolean {
                const oldValue = target[key as keyof typeof target];
                let result = true;
                if (oldValue !== value) {
                    console.log(oldValue, value)
                    result = Reflect.set(target, key, deepProxy(value), receiver);
                    update(+new Date());
                }
                return result;
            }
        })
        // 设置缓存
        toProxy.set(data, observed);
        toRaw.set(observed, data)

        return observed;
    };

    return deepProxy(data);
};

/* 普通更新数据 */
export function useUpdate() {
    const [_, update] = useState(0);

    function updateCallback(callback: Function) {
        callback();
        update(Date.now());
    };
    return updateCallback;
};