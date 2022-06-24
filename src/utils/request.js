import axios from 'axios'
import { Loading, Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import _ from 'lodash'
// 创建loading 配置
// loading对象
let loading

// 当前正在请求的数量
let needLoadingRequestCount = 0

// 显示loading
function showLoading(target) {
  // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
  // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      lock: true,
      text: '拼命加载中...',
      background: 'rgba(0, 0, 0, 0.8)'
      // target: target || 'body'
    })
  }
  needLoadingRequestCount++
}

// 隐藏loading
function hideLoading() {
  needLoadingRequestCount--
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0) // 做个保护
  // 关闭loading

  if (needLoadingRequestCount === 0) {
    toHideLoading()
  }
}

// 防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
var toHideLoading = _.debounce(() => {
  if (loading) {
    loading.close()
  }
  loading = null
}, 300)

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 判断当前请求是否设置了不显示Loading
    if (config.headers.showLoading !== false) {
      showLoading(config.headers.loadingTarget)
    }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    hideLoading()
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    hideLoading()
    const code = response.data.code
    if (code === undefined) {
      // 如果没有 code 代表这不是项目后端开发的接口 比如可能是  请求最新版本
      return response
    }
    if (code === 401) {
      store.dispatch('user/resetToken')
      if (location.href.indexOf('login') !== -1) {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      } else {
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
    } else if (code === 6401) {
      store.dispatch('user/resetToken')
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
      return false
    } else if (code === 400 || code === 403) {
      Message({
        message: response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
    } else if (code !== 200) {
      // Notification.error({
      //   title: response.data.msg
      // })
      Message({
        message: response.data.msg,
        type: 'error'
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    hideLoading()
    // 判断请求异常信息中是否含有超时timeout字符串
    if (error.message.includes('timeout')) {
      Message({
        message: '后台服务正在处理计算任务，请稍后刷新页面！',
        type: 'warning',
        duration: 5 * 1000
      })
      return
    }
    if (error.message === 'Network Error') {
      Message({
        message: '服务器连接异常，请检查服务器！',
        type: 'error',
        duration: 5 * 1000
      })
      return
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
