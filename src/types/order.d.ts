/** 用户地址信息 */
export type OrderAddress = {
  /** 地址ID */
  id: string
  /** 省份编码 */
  provinceCode: string
  /** 城市编码 */
  cityCode: string
  /** 区县编码 */
  countyCode: string
  /** 详细地址 */
  address: string
  /** 是否为默认地址 */
  isDefault: number
  /** 收货人 */
  receiver: string
  /** 联系方式 */
  contact: string
  /** 完整地址 */
  fullLocation: string
  /** 邮政编码 */
  postalCode: string
}

/** 订单商品信息 */
export type OrderGoods = {
  /** 商品ID */
  id: string
  /** 商品名称 */
  name: string
  /** 商品图片 */
  picture: string
  /** 商品数量 */
  count: number
  /** SKU ID */
  skuId: string
  /** 规格文本 */
  attrsText: string
  /** 单价 */
  price: string
  /** 支付单价 */
  payPrice: string
  /** 小计总价 */
  totalPrice: string
  /** 支付总价 */
  totalPayPrice: string
}

/** 订单结算信息 */
export type OrderSummary = {
  /** 商品数量 */
  goodsCount: number
  /** 商品总价 */
  totalPrice: string
  /** 支付总价 */
  totalPayPrice: string
  /** 邮费 */
  postFee: string
  /** 折扣金额 */
  discountPrice: string
}

/** 预付订单信息 */
export type OrderPreResult = {
  /** 用户地址列表 */
  userAddresses: OrderAddress[]
  /** 商品集合 */
  goods: OrderGoods[]
  /** 结算信息 */
  summary: OrderSummary
}

/** 提交订单参数 */
export type OrderSubmitParams = {
  /** 商品集合 */
  goods: {
    /** SKU ID */
    skuId: string
    /** 数量 */
    count: number
  }[]
  /** 地址ID */
  addressId: string
  /** 配送时间类型 */
  deliveryTimeType: number
  /** 买家留言 */
  buyerMessage?: string
  /** 支付方式 */
  payType: number
  /** 支付渠道 */
  payChannel: number
}

/** 提交订单结果 */
export type OrderSubmitResult = {
  /** 订单ID */
  id: string
}

/** 立即购买订单参数 */
export type OrderNowParams = {
  /** SKU ID */
  skuId: string
  /** 数量 */
  count: number
  /** 地址ID（可选） */
  addressId?: string
}

/** 订单详情结果 */
export type OrderDetailResult = {
  /** 订单ID */
  id: string
  /** 订单编号 */
  orderNo: string
  /** 订单状态 */
  orderState: number
  /** 创建时间 */
  createTime: string
  /** 支付方式 */
  payType: number
  /** 支付渠道 */
  payChannel: number
  /** 支付时间 */
  payTime?: string
  /** 支付金额 */
  payMoney: string
  /** 商品总价 */
  totalMoney: string
  /** 运费 */
  postFee: string
  /** 优惠金额 */
  discountMoney: string
  /** 买家留言 */
  buyerMessage?: string
  /** 配送时间类型 */
  deliveryTimeType: number
  /** 收货人信息 */
  receiverContact: string
  /** 收货人手机 */
  receiverMobile: string
  /** 收货地址 */
  receiverAddress: string
  /** 商品集合 */
  skus: OrderDetailSku[]
  /** 倒计时（秒） */
  countdown?: number
  /** 物流公司 */
  company?: {
    /** 公司名称 */
    name: string
    /** 公司编号 */
    number: string
    /** 公司图标 */
    picture?: string
  }
}

/** 订单详情商品信息 */
export type OrderDetailSku = {
  /** 商品ID */
  id: string
  /** SKU ID */
  skuId: string
  /** 商品名称 */
  name: string
  /** 商品图片 */
  image: string
  /** 商品规格 */
  attrsText: string
  /** 商品数量 */
  quantity: number
  /** 当前单价 */
  curPrice: string
  /** 实付单价 */
  realPay: string
  /** 商品总价 */
  totalMoney: string
}