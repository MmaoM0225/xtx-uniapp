import type { GoodsResult } from '@/types/goods'
import { http } from '@/utils/request'

/**
 * 获取商品详情信息
 * @param id - 商品id
 */
export const getGoodsByIdAPI = (id: string) => {
  return http<GoodsResult>({
    method: 'GET',
    url: '/goods',
    data: {
      id,
    },
  })
} 