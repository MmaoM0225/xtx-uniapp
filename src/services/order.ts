import { http } from '@/utils/request'
import type { OrderPreResult, OrderSubmitParams, OrderSubmitResult, OrderNowParams, OrderDetailResult } from '@/types/order'

/**
 * 获取预付订单信息
 * @returns 预付订单信息
 */
export const getOrderPreAPI = () => {
  return http<OrderPreResult>({
    method: 'GET',
    url: '/member/order/pre'
  })
}

/**
 * 获取再次购买订单信息
 * @param id 订单ID
 * @returns 预付订单信息
 */
export const getOrderRepurchaseAPI = (id: string) => {
  return http<OrderPreResult>({
    method: 'GET',
    url: `/member/order/repurchase/${id}`
  })
}

/**
 * 提交订单
 * @param data 订单信息
 * @returns 订单ID
 */
export const postOrderAPI = (data: OrderSubmitParams) => {
  return http<OrderSubmitResult>({
    method: 'POST',
    url: '/member/order',
    data
  })
}

/**
 * 获取立即购买订单信息
 * @param params 立即购买参数
 * @returns 预付订单信息
 */
export const getOrderNowAPI = (params: OrderNowParams) => {
  const url = `/member/order/pre/now?skuId=${params.skuId}&count=${params.count}${params.addressId ? `&addressId=${params.addressId}` : ''}`
  return http<OrderPreResult>({
    method: 'GET',
    url
  })
}

/**
 * 获取订单详情
 * @param id 订单ID
 * @returns 订单详情
 */
export const getOrderDetailAPI = (id: string) => {
  return http<OrderDetailResult>({
    method: 'GET',
    url: `/member/order/${id}`
  })
}