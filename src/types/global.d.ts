/** 通用的分页数据类型 */
export type PageResult<T = any> = {
  /** 总记录数 */
  counts: number
  /** 页大小 */
  pageSize: number
  /** 总页数 */
  pages: number
  /** 当前页码 */
  page: number
  /** 数据列表 */
  items: T[]
}

/** 通用的分页参数类型 */
export type PageParams = {
  /** 页码，默认为1 */
  page?: number
  /** 页大小，默认为10 */
  pageSize?: number
}

/** 通用的API响应类型 */
export type ApiResult<T = any> = {
  /** 状态码 */
  code: string
  /** 提示信息 */
  msg: string
  /** 返回数据 */
  result: T
}
