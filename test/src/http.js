import axios from 'axios';
import router from '@/router';

// 创建一个Axios实例
const api = axios.create({
  baseURL: 'http://localhost:8082/',
  timeout: 1000,
});



// 请求拦截器
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 如果token不存在，重定向到登录页面
      // console.log('token不存在，重定向到登录页面');
      // router.push('/login'); // 注意：这种方式需要在Vue组件的上下文中使用
      // return Promise.reject(new Error('Token不存在，取消请求')); // 阻止请求

    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


// 响应拦截器
api.interceptors.response.use(
  function (response) {
    console.log('响应拦截器');
    console.log(response);
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default api;


