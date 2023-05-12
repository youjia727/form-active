/**
 * * 封装 axios 的 hook 函数
 **/

import axios, { AxiosRequestConfig } from 'axios';
import QS from 'qs';
import sign from '@/assets/utils/sign';
import { useNavigate } from 'react-router-dom';
import useMessage from './useMessage';
import utils from '@/assets/utils';

interface errorTextProps {
  ECONNABORTED: string,
  ERR_NETWORK: string,
  ERR_BAD_RESPONSE: string,
  ERR_BAD_REQUEST: string
};

interface resultTypes {
  code?: number,
  data?: any,
  msg?: string
};

export default function useAxios() {
  // 提示语
  const message = useMessage();
  // 路由跳转
  const navigate = useNavigate();

  // 默认请求域名
  let root: string = import.meta.env.VITE_BASE_API;
  // if (process.env.NODE_ENV !== 'development') {
  //   root = import.meta.env.VITE_BASE_API;
  // }

  // 创建axios实例
  const service = axios.create({
    // api的base_url
    baseURL: root || '',
    // 请求超时时间
    timeout: 60000,
    //跨域是否自定携带cookies
    withCredentials: true,
    // 设置请求头
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    transformRequest: [
      function (data: any) {
        // 格式化参数
        data = sign.sign(data);
        data = QS.stringify(data);
        return data;
      }
    ]
  })

  // http request 拦截器
  service.interceptors.request.use(config => {
    // 增加csrftoken到请求头
    let token: string = utils.getCookie('TOKEN') || '';
    if (token) {
      config.headers['X-CSRFToken'] = token;
    }
    return config
  }, error => {
    return Promise.reject(error)
  })

  // response 响应拦截器
  service.interceptors.response.use(response => {
    // 错误提示语
    let tips = !response?.config?.url?.includes('/get_random_code_img')
    if (response.data.code !== 0 && tips) {
      message.error(response.data.msg)
    }
    // 登录过期
    if (response.data.code === 1414) {
    // 执行逻辑操作
      setTimeout(() => {
        navigate('/login');
      }, 1000)
    }
    return response.data;
  }, error => {
    const errorText: errorTextProps = {
      ECONNABORTED: '数据请求超时，请稍后重试！',
      ERR_NETWORK: '网络请求发送失败，请稍后重试！',
      ERR_BAD_RESPONSE: '服务器发生故障，正在抢修，请稍后...',
      ERR_BAD_REQUEST: '数据连接发生故障，正在抢修，请稍后...'
    }
    const key = error.code as keyof typeof errorText;
    if (key in errorText) {
      message.error(errorText[key]);
    } else {
      message.error('远程资源连接失败，请稍后重试！');
    }
    console.log(error)
    return Promise.reject(error);
  })

  // get 请求
  function get<T>(url: string, params: T) {
    return new Promise((resolve, reject) => {
      service.get(url, { params }).then((res: resultTypes) => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // post 请求
  function post<T, U>(url: string, params: T, header?: U) {
    return new Promise((resolve, reject) => {
      // 发送请求
      service.post(url, params, header as AxiosRequestConfig).then((res: resultTypes) => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          reject(false)
        }
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
    })
  }


  return {
    post,
    get
  }
}
