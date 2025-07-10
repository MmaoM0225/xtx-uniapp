// 登录请求参数
export type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}

// 登录成功返回的用户信息
export type LoginResult = {
  id: number
  mobile: string
  token: string
  nickname: string
  avatar: string
  account: string
}

// 登录接口响应数据类型
export type LoginResponse = {
  msg: string
  result: LoginResult
} 