/**
 * * 封装 axios 的 hook 函数
 **/

import axios from 'axios';
import QS from 'qs';
import sign from '@/assets/utils/sign';
// import { Navigate } from 'react-router-dom';
import useMessage from './useMessage';
import utils from '@/assets/utils';

interface errorTextProps {
  ECONNABORTED: string,
  ERR_NETWORK: string,
  ERR_BAD_RESPONSE: string,
  ERR_BAD_REQUEST: string
}

export default function useAxios() {
  // 初始化提示语message的实例
  const message = useMessage()

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
    let token: string = utils.getCookie('DJS-CSRF-TOKEN') || '';
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
    // let tips = !response.config.url.includes('/webapi/get_random_code_img')
    // let tips2 = !response.config.url.includes('/webapi/pptb_report_list_export')
    // if (response.data.code !== '1' && tips && tips2) {
    //   message.error(response.data.msg)
    // }
    // // 登录过期
    // if (response.data.code === '1414') {
    //   sessionStorage.removeItem('DJS-LOGIN-TOKEN')
    //   store.commit('request/setUserId', null)
    //   store.commit('request/setUserData', null)
    //   setTimeout(() => {
    //     router.replace('/login')
    //   }, 1000)
    // }
    return response.data;
  }, error => {
    const errorText: errorTextProps = {
      ECONNABORTED: '数据请求超时，请稍后重试！',
      ERR_NETWORK: '网络请求发送失败，请稍后重试！',
      ERR_BAD_RESPONSE: '服务器发生故障，正在抢修，请稍后...',
      ERR_BAD_REQUEST: '数据连接发生故障，正在抢修，请稍后...'
    }
    if (error.code in errorText) {
      message.error(errorText[error.code as keyof typeof errorText]);
      // message.error(errorText[error.code]);
    } else {
      message.error('远程资源连接失败，请稍后重试！');
    }
    console.log(error)
    return Promise.reject(error);
  })

  // get 请求
  function get(url: string, params = {}) {
    return new Promise((resolve, reject) => {
      service.get(url, { params }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // post 请求
  function post(url: string, params = {}, header = {}) {
    return new Promise((resolve, reject) => {
      // 发送请求
      service.post(url, params, header).then((res: any) => {
        if (url.includes('get_random_code_img') || url.includes('pptb_report_list_export')) {
          resolve(res)
        } else if (res.code === '1') {
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
