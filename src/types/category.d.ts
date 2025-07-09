// src/types/category.d.ts
/** 商品项数据类型 */
export interface GoodItem {
  /** 商品id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品描述 */
  desc: string
  /** 商品价格（字符串格式） */
  price: string
  /** 商品图片 */
  picture: string
  /** 商品折扣 */
  discount: any
  /** 订单数量 */
  orderNum: number
}

/** 二级分类数据类型 */
export interface CategoryChild {
  /** 子分类id */
  id: string
  /** 子分类名称 */
  name: string
  /** 子分类图片 */
  picture: string
  /** 父分类id */
  parentId: string | null
  /** 父分类名称 */
  parentName: string | null
  /** 子分类商品列表 */
  goods: GoodItem[]
  /** 下级分类 */
  categories: any
  /** 品牌信息 */
  brands: any
  /** 销售属性 */
  saleProperties: any
}

/** 一级分类顶部数据类型 */
export interface CategoryTopItem {
  /** 分类id */
  id: string
  /** 分类名称 */
  name: string
  /** 分类图片 */
  picture: string
  /** 轮播图数组 */
  imageBanners: string[]
  /** 二级分类列表 */
  children: CategoryChild[]
} 