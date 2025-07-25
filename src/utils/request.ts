import { useMemberStore } from '@/stores'

// 请求基础地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 拼接基础地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }

    // 2. 设置超时时间，增加到 20 秒
    options.timeout = 20000

    // 3. 添加请求头标识
    options.header = {
      'source-client': 'miniapp',
      ...options.header,
    }

    // 4. 添加 token
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = `Bearer ${token}`
    }
  },
}

// 拦截 request 请求
uni.addInterceptor('request', httpInterceptor)

// 拦截 uploadFile 文件上传
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param options 请求配置
 * @returns Promise
 */
export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 请求成功
      success(res) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res.data as IResData<T>)
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as IResData<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      // 请求失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

/**
 * 通用数据类型
 */
export interface IResData<T> {
  code: string
  msg: string
  result: T
}
