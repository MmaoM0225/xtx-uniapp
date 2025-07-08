import { http } from '@/utils/request'
import type { BannerItem, CategoryItem, HotItem, GuessResult } from '@/types/home'
import type { PageParams } from '@/types/global'

/**
 * 首页-广告区域
 */
export const getHomeBannerAPI = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: `/home/banner?distributionSite=${distributionSite}`,
  })
}

/**
 * 首页-前台分类
 */
export const getHomeCategoryAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}

/**
 * 首页-热门推荐
 */
export const getHomeHotAPI = () => {
  return http<HotItem[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })
}

/**
 * 首页-猜你喜欢
 */
export const getHomeGuessLikeAPI = (params: PageParams = {}) => {
  const { page = 1, pageSize = 10 } = params
  return http<GuessResult>({
    method: 'GET',
    url: `/home/goods/guessLike?page=${page}&pageSize=${pageSize}`,
  })
}
