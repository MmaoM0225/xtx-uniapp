import { http } from '@/utils/request'
import type { HotResult, HotParams } from '@/types/hot'
import type { ApiResult } from '@/types/global'

/**
 * 获取热门推荐（根据完整API路径）
 * @param apiPath API路径，例如 /hot/preference
 * @param params 分页参数
 */
export const getHotAPI = (apiPath: string, params: HotParams = {}) => {
  const { page = 1, pageSize = 10, subType } = params

  let queryStr = `page=${page}&pageSize=${pageSize}`
  if (subType) {
    queryStr += `&subType=${subType}`
  }

  return http<HotResult>({
    method: 'GET',
    url: `${apiPath}?${queryStr}`,
  })
} 