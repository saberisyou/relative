// https://github.com/TigerHee/taro-request/blob/master/servers/interceptors.js
import Taro from '@tarojs/taro';
import { getCurrentTaroUrl, needLogin } from './common';
import { jsonKeysToCase } from './tool';

const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  CLIENT_ERROR: 400,
  AUTHENTICATE: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

const customInterceptor = chain => {
  const requestParams = chain.requestParams;

  return chain
    .proceed(requestParams)
    .then(res => {
      Taro.hideLoading();
      switch (res.statusCode) {
        case HTTP_STATUS.SUCCESS:
          return jsonKeysToCase(res.data, 2);
        // case HTTP_STATUS.NOT_FOUND:
        //   return Promise.reject('请求资源不存在');
        // case HTTP_STATUS.SERVER_ERROR:
        //   Taro.showToast({ title: '服务内部错误', icon: 'none' });
        //   return Promise.reject('服务内部错误');
        // case HTTP_STATUS.BAD_GATEWAY:
        //   return Promise.reject('网关错误');
        case HTTP_STATUS.FORBIDDEN:
          // eslint-disable-next-line no-case-declarations
          const curUrl = getCurrentTaroUrl();
          Taro.reLaunch({ url: `${curUrl}` }); // 重启小程序
          return Promise.reject('没有权限访问');
        case HTTP_STATUS.AUTHENTICATE:
          needLogin();
          return Promise.reject('需要鉴权');
        default:
          Taro.showToast({ title: '内部服务错误', icon: 'none' });
          return Promise.reject(res.data);
      }
    })
    .catch((err: any) => {
      Taro.hideLoading();
      console.error(err);
      return { error: err };
    });
};

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
const INTRRCEPTORS = [customInterceptor, Taro.interceptors.timeoutInterceptor];

export default INTRRCEPTORS;
