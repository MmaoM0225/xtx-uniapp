/** 加入购物车请求参数 */
export type AddToCartParams = {
  /** SKU ID */
  skuId: string
  /** 数量 */
  count: number
}

/** 加入购物车响应结果 */
export type AddToCartResult = {
  /** 操作结果 */
  success: boolean
  /** 消息 */
  message?: string
}

/** 商品规格 */
export type CartItemSpec = {
  /** 规格名称 */
  name: string
  /** 规格值 */
  valueName: string
}

/** 购物车商品项 */
export type CartItem = {
  /** 商品ID */
  id: string
  /** 商品名称 */
  name: string
  /** 商品图片 */
  picture: string
  /** 原价 */
  price: string
  /** 现价 */
  nowPrice: string
  /** 原始现价 */
  nowOriginalPrice: string
  /** 商品数量 */
  count: number
  /** SKU ID */
  skuId: string
  /** 规格属性文本 */
  attrsText: string
  /** 规格列表 */
  specs: CartItemSpec[]
  /** 是否选中 */
  selected: boolean
  /** 库存 */
  stock: number
  /** 是否收藏 */
  isCollect: boolean
  /** 折扣 */
  discount: number | null
  /** 是否有效 */
  isEffective: boolean
  /** 邮费 */
  postFee: number
}

/** 购物车数据 */
export type CartResult = CartItem[] 