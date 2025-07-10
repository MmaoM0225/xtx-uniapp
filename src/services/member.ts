import type { ProfileDetail } from '@/types/member'
import { http } from '@/utils/request'

/**
 * 获取个人信息
 */
export const getMemberProfileAPI = () => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/member/profile',
  })
}

/**
 * 修改个人信息
 * @param data 请求体参数
 */
export const putMemberProfileAPI = (data: {
  nickname?: string
  gender?: '男' | '女'
  birthday?: string
  profession?: string
  provinceCode?: string
  cityCode?: string
  countyCode?: string
}) => {
  return http<ProfileDetail>({
    method: 'PUT',
    url: '/member/profile',
    data,
  })
} 