import type { LoginParams, LoginResponse, LoginResult } from '@/types/member'
import { http } from '@/utils/request'

/**
 * 小程序登录
 * @param data 请求参数
 */
export const postLoginWxMin = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}

/**
 * 获取微信小程序登录凭证
 * @returns Promise<string>
 */
export const getLoginCode = () => {
  return new Promise<string>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => {
        resolve(res.code)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * 获取手机号快速登录
 * @param event 获取手机号事件对象
 */
export const getPhoneNumber = async (event: any) => {
  try {
    // 1. 获取code
    const code = await getLoginCode()
    // 2. 调用登录接口
    const { encryptedData, iv } = event.detail
    const res = await postLoginWxMin({
      code,
      encryptedData,
      iv,
    })
    // 3. 返回登录结果
    return res
  } catch (err) {
    throw new Error('登录失败')
  }
}

/**
 * 模拟登录
 * @param phoneNumber 手机号
 */
export const postLoginDemo = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber
    }
  })
} 