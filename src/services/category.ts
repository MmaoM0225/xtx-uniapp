// src/services/category.ts
import { http } from '@/utils/request'
import type { CategoryTopItem } from '@/types/category'

/**
 * 获取分类顶部数据，包括轮播图和二级分类
 */
export const getCategoryTopAPI = () => {
  return http<CategoryTopItem[]>({
    method: 'GET',
    url: '/category/top',
  })
} 