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

// 用户详细信息
export type ProfileDetail = {
  id: string
  avatar: string
  nickname: string
  account: string
  gender: '女' | '男'
  birthday: string
  fullLocation: string
  profession: string
  // 省市区编码
  provinceCode?: string
  cityCode?: string
  countyCode?: string
}

