import { http } from '@/utils/request'
import type { AddToCartParams, AddToCartResult, CartResult } from '@/types/cart'

/**
 * 加入购物车
 * @param params 请求参数
 * @returns 添加结果
 */
export const addToCartAPI = (params: AddToCartParams) => {
  return http<AddToCartResult>({
    method: 'POST',
    url: '/member/cart',
    data: params
  })
}

/**
 * 获取购物车列表
 * @returns 购物车数据
 */
export const getCartListAPI = () => {
  return http<CartResult>({
    method: 'GET',
    url: '/member/cart'
  })
}

/**
 * 删除购物车商品
 * @param ids 商品ID数组
 * @returns 删除结果
 */
export const deleteCartAPI = (ids: string[]) => {
  return http<{ success: boolean }>({
    method: 'DELETE',
    url: '/member/cart',
    data: { ids }
  })
}

/**
 * 修改购物车商品数量
 * @param skuId SKU ID
 * @param count 数量
 * @returns 修改结果
 */
export const updateCartItemAPI = (skuId: string, count: number) => {
  return http<{ success: boolean }>({
    method: 'PUT',
    url: `/member/cart/${skuId}`,
    data: { count }
  })
}

/**
 * 购物车商品全选/取消全选
 * @param selected 是否选中
 * @returns 操作结果
 */
export const selectAllCartAPI = (selected: boolean) => {
  return http<{ success: boolean }>({
    method: 'PUT',
    url: '/member/cart/selected',
    data: { selected }
  })
}

/**
 * 购物车商品单选/取消单选
 * @param skuId SKU ID
 * @param selected 是否选中
 * @returns 操作结果
 */
export const selectCartItemAPI = (skuId: string, selected: boolean) => {
  return http<{ success: boolean }>({
    method: 'PUT',
    url: `/member/cart/${skuId}/selected`,
    data: { selected }
  })
} 