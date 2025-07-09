import type { PageResult, PageParams } from './global'

/** 热门推荐商品项数据类型 */
export type HotGoodsItem = {
  /** 商品描述 */
  desc: string
  /** 商品id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品图片 */
  picture: string
  /** 商品价格 */
  price: number
}

/** 热门推荐商品列表数据类型 */
export type HotGoodsList = PageResult<HotGoodsItem>

/** 热门推荐子类型数据类型 */
export type HotSubType = {
  /** 子类型id */
  id: string
  /** 子类型标题 */
  title: string
  /** 商品列表 */
  goodsItems: HotGoodsList
}

/** 热门推荐响应数据类型 */
export type HotResult = {
  /** 标题 */
  title: string
  /** id */
  id: string
  /** 横幅图片 */
  bannerPicture: string
  /** 子类型列表 */
  subTypes: HotSubType[]
}

/** 热门推荐请求参数类型 */
export type HotParams = PageParams & {
  /** 推荐列表 Tab 项的 id */
  subType?: string
} 