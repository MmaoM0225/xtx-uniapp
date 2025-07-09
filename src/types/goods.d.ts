/** 商品信息 */
export type GoodsResult = {
  /** 商品id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品编码 */
  spuCode: string
  /** 商品描述 */
  desc: string
  /** 当前价格 */
  price: string
  /** 原价 */
  oldPrice: string
  /** 折扣 */
  discount: number
  /** 库存 */
  inventory: number
  /** 品牌信息 */
  brand: {
    id: string
    name: string
    nameEn: string
    picture: string
    logo: string
    type: null
    desc: null
    place: null
  }
  /** 销量 */
  salesCount: number
  /** 评论数 */
  commentCount: number
  /** 收藏数 */
  collectCount: number
  /** 主视频 */
  mainVideos: string[]
  /** 视频比例 */
  videoScale: number
  /** 主图片 */
  mainPictures: string[]
  /** 规格集合 */
  specs: {
    /** 规格id */
    id: string
    /** 规格名称 */
    name: string
    /** 可选值集合 */
    values: {
      /** 可选值名称 */
      name: string
      /** 可选值图片 */
      picture: string
      /** 是否可用 */
      available: boolean
      /** 可选值描述 */
      desc: string
    }[]
  }[]
  /** SKU集合 */
  skus: {
    /** SKU id */
    id: string
    /** SKU编码 */
    skuCode: string
    /** 价格 */
    price: string
    /** 原价 */
    oldPrice: string
    /** 库存 */
    inventory: number
    /** 图片 */
    picture: string
    /** 规格集合 */
    specs: {
      /** 规格名称 */
      name: string
      /** 可选值名称 */
      valueName: string
    }[]
  }[]
  /** 分类信息 */
  categories: {
    /** 分类id */
    id: string
    /** 分类名称 */
    name: string
    /** 分类层级 */
    layer: number
    /** 父级分类 */
    parent: {
      /** 分类id */
      id: string
      /** 分类名称 */
      name: string
      /** 分类层级 */
      layer: number
      parent: null
    }
  }[]
  /** 商品详情 */
  details: {
    /** 商品属性集合 */
    properties: {
      /** 属性名称 */
      name: string
      /** 属性值 */
      value: string
    }[]
    /** 商品详情图片集合 */
    pictures: string[]
  }
  /** 是否为预售商品 */
  isPreSale: boolean
  /** 是否收藏 */
  isCollect: null
  /** 推荐商品 */
  recommends: null
  /** 用户地址 */
  userAddresses: null
  /** 评价信息 */
  evaluationInfo: null
  /** 同类商品 */
  similarProducts: GoodsItem[]
  /** 24小时热榜商品 */
  hotByDay: GoodsItem[]
}

/** 商品项 */
export type GoodsItem = {
  /** 商品id */
  id: string
  /** 商品图片 */
  picture: string
  /** 商品名称 */
  name: string
  /** 商品价格 */
  price: string
  /** 商品描述 */
  desc: string
  /** 订单数量 */
  orderNum: number
  /** 折扣 */
  discount: null
} 