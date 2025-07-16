<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderDetailAPI } from '@/services/order'
import type { OrderDetailResult } from '@/types/order'

// 订单状态枚举
enum OrderState {
  /** 待付款 */
  DaiFuKuan = 1,
  /** 待发货 */
  DaiFaHuo = 2,
  /** 待收货 */
  DaiShouHuo = 3,
  /** 待评价 */
  DaiPingJia = 4,
  /** 已完成 */
  YiWanCheng = 5,
  /** 已取消 */
  YiQuXiao = 6
}

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 订单ID
const orderId = ref('')
// 订单详情
const orderDetail = ref<OrderDetailResult>()
// 加载状态
const loading = ref(false)
// 倒计时定时器
const timer = ref<number | null>(null)
// 倒计时剩余秒数
const countdown = ref(0)

// 订单状态文字映射
const orderStateText: Record<number, string> = {
  [OrderState.DaiFuKuan]: '待付款',
  [OrderState.DaiFaHuo]: '待发货',
  [OrderState.DaiShouHuo]: '待收货',
  [OrderState.DaiPingJia]: '待评价',
  [OrderState.YiWanCheng]: '已完成',
  [OrderState.YiQuXiao]: '已取消'
}

// 配送时间文字映射
const deliveryTimeText: Record<number, string> = {
  1: '不限送货时间',
  2: '工作日送货',
  3: '双休日、假日送货'
}

// 倒计时格式化
const formatCountdown = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${minutes}分${seconds.toString().padStart(2, '0')}秒`
})

// 获取订单详情
const getOrderDetail = async () => {
  try {
    loading.value = true
    const res = await getOrderDetailAPI(orderId.value)
    orderDetail.value = res.result
    console.log('订单详情:', orderDetail.value)
    
    // 初始化倒计时
    if (orderDetail.value?.countdown) {
      countdown.value = orderDetail.value.countdown
      startCountdown()
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    uni.showToast({
      title: '获取订单详情失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  // 清除可能存在的定时器
  if (timer.value) {
    clearInterval(timer.value)
  }
  
  // 创建新的定时器
  timer.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      // 倒计时结束，清除定时器
      clearInterval(timer.value!)
      timer.value = null
      
      // 倒计时结束后更新订单状态，但不要重新获取订单详情
      // getOrderDetail()
      
      // 如果需要提示用户
      uni.showToast({
        title: '支付时间已到期',
        icon: 'none'
      })
    }
  }, 1000) as unknown as number
}

// 去支付
const handlePayment = () => {
  if (!orderDetail.value) return
  uni.navigateTo({
    url: `/pagesOrder/payment/payment?orderId=${orderDetail.value.id}`
  })
}

// 取消订单
const handleCancel = async () => {
  uni.showModal({
    title: '提示',
    content: '确定要取消订单吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用取消订单API
        uni.showToast({
          title: '取消成功',
          icon: 'success'
        })
      }
    }
  })
}

// 确认收货
const handleConfirm = async () => {
  uni.showModal({
    title: '提示',
    content: '确定已经收到货了吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用确认收货API
        uni.showToast({
          title: '确认收货成功',
          icon: 'success'
        })
      }
    }
  })
}

// 查看物流
const handleLogistics = () => {
  // TODO: 跳转到物流页面
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 申请售后
const handleAfterSale = () => {
  // TODO: 跳转到售后页面
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 去评价
const handleComment = () => {
  // TODO: 跳转到评价页面
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 页面加载
onLoad((options) => {
  orderId.value = options?.orderId || ''
  console.log('订单ID:', orderId.value)
})

onMounted(() => {
  if (orderId.value) {
    getOrderDetail()
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
})
</script>

<template>
  <view class="order-detail-page">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <view class="back" @tap="goBack">
        <text class="icon-left">←</text>
      </view>
      <view class="title">订单详情</view>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <text>正在加载订单详情...</text>
    </view>
    
    <template v-else-if="orderDetail">
      <!-- 订单状态 -->
      <view class="order-status">
        <view class="status-info">
          <text class="status-text">{{ orderStateText[orderDetail.orderState] }}</text>
          <text v-if="orderDetail.orderState === OrderState.DaiFuKuan && countdown > 0" class="countdown">
            剩余支付时间：{{ formatCountdown }}
          </text>
        </view>
      </view>
      
      <!-- 物流信息（待收货状态显示） -->
      <view v-if="orderDetail.orderState === OrderState.DaiShouHuo && orderDetail.company" class="logistics-info" @tap="handleLogistics">
        <image class="logistics-icon" src="/static/images/car.png" mode="aspectFit" />
        <view class="logistics-detail">
          <view class="company">{{ orderDetail.company.name }}</view>
          <view class="number">运单号：{{ orderDetail.company.number }}</view>
        </view>
        <text class="arrow-right">›</text>
      </view>
      
      <!-- 收货地址 -->
      <view class="address-section">
        <view class="address-info">
          <view class="receiver-info">
            <text class="receiver-name">{{ orderDetail.receiverContact }}</text>
            <text class="receiver-phone">{{ orderDetail.receiverMobile }}</text>
          </view>
          <view class="address-detail">
            {{ orderDetail.receiverAddress }}
          </view>
        </view>
      </view>
      
      <!-- 商品列表 -->
      <view class="goods-section">
        <view class="section-header">
          <text class="header-title">商品信息</text>
        </view>
        
        <view class="goods-list">
          <view v-for="item in orderDetail.skus" :key="item.skuId" class="goods-item">
            <image class="goods-image" :src="item.image" mode="aspectFill" />
            <view class="goods-info">
              <view class="goods-name">{{ item.name }}</view>
              <view class="goods-specs">{{ item.attrsText }}</view>
              <view class="goods-price-count">
                <text class="goods-price">¥{{ parseFloat(item.realPay).toFixed(2) }}</text>
                <text class="goods-count">×{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 订单信息 -->
      <view class="order-info-section">
        <view class="section-header">
          <text class="header-title">订单信息</text>
        </view>
        
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">订单编号</text>
            <text class="info-value">{{ orderDetail.orderNo }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">下单时间</text>
            <text class="info-value">{{ orderDetail.createTime }}</text>
          </view>
          <view v-if="orderDetail.payTime" class="info-item">
            <text class="info-label">支付时间</text>
            <text class="info-value">{{ orderDetail.payTime }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">配送时间</text>
            <text class="info-value">{{ deliveryTimeText[orderDetail.deliveryTimeType] }}</text>
          </view>
          <view v-if="orderDetail.buyerMessage" class="info-item">
            <text class="info-label">买家留言</text>
            <text class="info-value">{{ orderDetail.buyerMessage }}</text>
          </view>
        </view>
      </view>
      
      <!-- 订单金额 -->
      <view class="amount-section">
        <view class="amount-item">
          <text class="amount-label">商品总价</text>
          <text class="amount-value">¥{{ parseFloat(orderDetail.totalMoney).toFixed(2) }}</text>
        </view>
        <view class="amount-item">
          <text class="amount-label">运费</text>
          <text class="amount-value">¥{{ parseFloat(orderDetail.postFee).toFixed(2) }}</text>
        </view>
        <view v-if="parseFloat(orderDetail.discountMoney) > 0" class="amount-item">
          <text class="amount-label">优惠</text>
          <text class="amount-value discount">-¥{{ parseFloat(orderDetail.discountMoney).toFixed(2) }}</text>
        </view>
        <view class="amount-item total">
          <text class="amount-label">实付款</text>
          <text class="amount-value total-price">¥{{ parseFloat(orderDetail.payMoney).toFixed(2) }}</text>
        </view>
      </view>
    </template>
    
    <!-- 底部操作栏 -->
    <view v-if="orderDetail" class="bottom-bar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      <!-- 待付款 -->
      <template v-if="orderDetail.orderState === OrderState.DaiFuKuan">
        <button class="btn btn-default" @tap="handleCancel">取消订单</button>
        <button class="btn btn-primary" @tap="handlePayment">去支付</button>
      </template>
      
      <!-- 待发货 -->
      <template v-else-if="orderDetail.orderState === OrderState.DaiFaHuo">
        <button class="btn btn-default" @tap="handleAfterSale">申请售后</button>
      </template>
      
      <!-- 待收货 -->
      <template v-else-if="orderDetail.orderState === OrderState.DaiShouHuo">
        <button class="btn btn-default" @tap="handleLogistics">查看物流</button>
        <button class="btn btn-primary" @tap="handleConfirm">确认收货</button>
      </template>
      
      <!-- 待评价 -->
      <template v-else-if="orderDetail.orderState === OrderState.DaiPingJia">
        <button class="btn btn-primary" @tap="handleComment">去评价</button>
      </template>
      
      <!-- 已完成 -->
      <template v-else-if="orderDetail.orderState === OrderState.YiWanCheng">
        <button class="btn btn-default" @tap="handleAfterSale">申请售后</button>
      </template>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f5f5f5;
  height: 100%;
}

.order-detail-page {
  min-height: 100vh;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

// 导航栏
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 150rpx;
  background-color: #27ba9b;
  color: #fff;
  display: flex;
  align-items: center;
  z-index: 100;
  
  .back {
    position: absolute;
    left: 20rpx;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .icon-left {
      font-family: 'erabbit' !important;
      font-size: 40rpx;
      color: #fff;
      
      &::before {
        content: '\e6cd';
      }
    }
  }
  
  .title {
    flex: 1;
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
  }
}

// 加载状态
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  color: #999;
  font-size: 28rpx;
}

// 订单状态
.order-status {
  margin-top: 150rpx;
  background-color: #27ba9b;
  color: #fff;
  padding: 40rpx 30rpx;
  
  .status-info {
    display: flex;
    flex-direction: column;
    
    .status-text {
      font-size: 40rpx;
      font-weight: 500;
      margin-bottom: 10rpx;
    }
    
    .countdown {
      font-size: 28rpx;
      opacity: 0.9;
    }
  }
}

// 物流信息
.logistics-info {
  background-color: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  
  .logistics-icon {
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
  }
  
  .logistics-detail {
    flex: 1;
    
    .company {
      font-size: 30rpx;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .number {
      font-size: 26rpx;
      color: #666;
    }
  }
  
  .arrow-right {
    font-size: 32rpx;
    color: #ccc;
  }
}

// 地址部分
.address-section {
  background-color: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 10rpx;
  
  .address-info {
    .receiver-info {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;
      
      .receiver-name {
        font-size: 32rpx;
        font-weight: 500;
        margin-right: 20rpx;
      }
      
      .receiver-phone {
        font-size: 30rpx;
        color: #666;
      }
    }
    
    .address-detail {
      font-size: 28rpx;
      color: #666;
      line-height: 1.5;
    }
  }
}

// 商品部分
.goods-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 10rpx;
  
  .section-header {
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;
    
    .header-title {
      font-size: 32rpx;
      font-weight: 500;
    }
  }
  
  .goods-list {
    .goods-item {
      display: flex;
      padding: 30rpx;
      border-bottom: 1rpx solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      .goods-image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }
      
      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .goods-name {
          font-size: 30rpx;
          color: #333;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        
        .goods-specs {
          font-size: 26rpx;
          color: #999;
          margin-top: 10rpx;
        }
        
        .goods-price-count {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10rpx;
          
          .goods-price {
            font-size: 32rpx;
            color: #cf4444;
          }
          
          .goods-count {
            font-size: 28rpx;
            color: #999;
          }
        }
      }
    }
  }
}

// 订单信息部分
.order-info-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 10rpx;
  
  .section-header {
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;
    
    .header-title {
      font-size: 32rpx;
      font-weight: 500;
    }
  }
  
  .info-list {
    padding: 30rpx;
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .info-label {
        font-size: 28rpx;
        color: #666;
      }
      
      .info-value {
        font-size: 28rpx;
        color: #333;
        text-align: right;
        max-width: 60%;
      }
    }
  }
}

// 金额部分
.amount-section {
  background-color: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 10rpx;
  
  .amount-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &.total {
      padding-top: 20rpx;
      border-top: 1rpx solid #eee;
      margin-top: 20rpx;
    }
    
    .amount-label {
      font-size: 28rpx;
      color: #666;
    }
    
    .amount-value {
      font-size: 28rpx;
      color: #333;
      
      &.discount {
        color: #cf4444;
      }
      
      &.total-price {
        font-size: 36rpx;
        color: #cf4444;
        font-weight: 500;
      }
    }
  }
}

// 底部操作栏
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  gap: 20rpx;
  box-shadow: 0 -1rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
    border: none;
    
    &.btn-default {
      background-color: #fff;
      color: #333;
      border: 1rpx solid #ddd;
    }
    
    &.btn-primary {
      background-color: #27ba9b;
      color: #fff;
    }
  }
}
</style>