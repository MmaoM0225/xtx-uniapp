<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderPreAPI, getOrderRepurchaseAPI, postOrderAPI, getOrderNowAPI } from '@/services/order'
import type { OrderPreResult, OrderAddress, OrderSubmitParams } from '@/types/order'

// 获取页面参数
const query = ref<Record<string, any>>({})

// 订单信息
const orderPre = ref<OrderPreResult>()
const loading = ref(false)
const submitting = ref(false)

// 选中的地址
const selectedAddress = ref<OrderAddress>()

// 配送时间类型
const deliveryTimeType = ref(1) // 1-不限送货时间 2-工作日送货 3-双休日、假日送货
const deliveryOptions = [
  { value: 1, text: '不限送货时间' },
  { value: 2, text: '工作日送货' },
  { value: 3, text: '双休日、假日送货' }
]

// 买家留言
const buyerMessage = ref('')

// 支付方式
const payType = ref(1) // 1-在线支付
const payChannel = ref(1) // 1-支付宝 2-微信

// 计算属性
const totalAmount = computed(() => {
  return parseFloat(orderPre.value?.summary.totalPayPrice || '0')
})

const goodsCount = computed(() => {
  return orderPre.value?.summary.goodsCount || 0
})

// 获取订单信息
const getOrderData = async () => {
  try {
    loading.value = true
    
    let res
    if (query.value.orderId) {
      // 再次购买
      res = await getOrderRepurchaseAPI(query.value.orderId)
    } else if (query.value.type === 'now' && query.value.skuId && query.value.count) {
      // 立即购买
      console.log('立即购买参数:', {
        skuId: query.value.skuId,
        count: parseInt(query.value.count)
      })
      res = await getOrderNowAPI({
        skuId: query.value.skuId,
        count: parseInt(query.value.count)
      })
    } else {
      // 购物车结算
      res = await getOrderPreAPI()
    }
    
    orderPre.value = res.result
    
    console.log('API返回的订单信息:', orderPre.value)
    console.log('用户地址列表:', orderPre.value.userAddresses)
    
    // 设置默认地址
    if (orderPre.value.userAddresses.length > 0) {
      selectedAddress.value = orderPre.value.userAddresses.find(item => item.isDefault === 1) 
        || orderPre.value.userAddresses[0]
      console.log('设置的默认地址:', selectedAddress.value)
    } else {
      console.log('没有找到用户地址')
    }
    
    console.log('订单信息:', orderPre.value)
  } catch (error) {
    console.error('获取订单信息失败:', error)
    uni.showToast({
      title: '获取订单信息失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 选择地址
const selectAddress = () => {
  if (!orderPre.value?.userAddresses.length) {
    uni.showModal({
      title: '提示',
      content: '请先添加收货地址',
      confirmText: '去添加',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pagesMember/address/address'
          })
        }
      }
    })
    return
  }
  
  uni.showActionSheet({
    itemList: orderPre.value.userAddresses.map(item => 
      `${item.receiver} ${item.contact} ${item.fullLocation}${item.address}`
    ),
    success: (res) => {
      selectedAddress.value = orderPre.value!.userAddresses[res.tapIndex]
    }
  })
}

// 选择配送时间
const selectDeliveryTime = () => {
  uni.showActionSheet({
    itemList: deliveryOptions.map(item => item.text),
    success: (res) => {
      deliveryTimeType.value = deliveryOptions[res.tapIndex].value as number
    }
  })
}

// 提交订单
const submitOrder = async () => {
  if (!selectedAddress.value) {
    uni.showToast({
      title: '请选择收货地址',
      icon: 'none'
    })
    return
  }
  
  if (!orderPre.value?.goods.length) {
    uni.showToast({
      title: '订单商品不能为空',
      icon: 'none'
    })
    return
  }
  
  try {
    submitting.value = true
    
    const orderData: OrderSubmitParams = {
      addressId: selectedAddress.value.id,
      buyerMessage: buyerMessage.value,
      deliveryTimeType: deliveryTimeType.value,
      goods: orderPre.value.goods.map(item => ({
        skuId: item.skuId,
        count: item.count
      })),
      payChannel: payChannel.value,
      payType: payType.value
    }
    
    console.log('提交订单数据:', orderData)
    
    const res = await postOrderAPI(orderData)
    
    uni.showToast({
      title: '订单提交成功',
      icon: 'success'
    })
    
    // 跳转到订单详情页面
    setTimeout(() => {
      uni.redirectTo({
        url: `/pagesOrder/detail/detail?orderId=${res.result.id}`
      })
    }, 1500)
    
  } catch (error) {
    console.error('提交订单失败:', error)
    uni.showToast({
      title: '提交订单失败',
      icon: 'none'
    })
  } finally {
    submitting.value = false
  }
}

// 页面加载
onLoad((options) => {
  query.value = options || {}
  console.log('订单页面参数:', query.value)
})

onMounted(() => {
  getOrderData()
})
</script>

<template>
  <view class="order-page">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <text>正在加载订单信息...</text>
    </view>
    
    <template v-else-if="orderPre">
      <!-- 收货地址 -->
      <view class="address-section">
        <view class="section-header">
          <text class="header-icon">📍</text>
          <text class="header-title">收货地址</text>
        </view>
        
        <view v-if="selectedAddress" class="address-card" @tap="selectAddress">
          <view class="address-info">
            <view class="receiver-info">
              <text class="receiver-name">{{ selectedAddress.receiver }}</text>
              <text class="receiver-phone">{{ selectedAddress.contact }}</text>
              <text v-if="selectedAddress.isDefault === 1" class="default-tag">默认</text>
            </view>
            <view class="address-detail">
              {{ selectedAddress.fullLocation }}{{ selectedAddress.address }}
            </view>
          </view>
          <text class="arrow-right">›</text>
        </view>
        
        <view v-else class="no-address" @tap="selectAddress">
          <text class="no-address-text">请选择收货地址</text>
          <text class="arrow-right">›</text>
        </view>
      </view>
      
      <!-- 商品列表 -->
      <view class="goods-section">
        <view class="section-header">
          <text class="header-icon">📦</text>
          <text class="header-title">商品清单</text>
        </view>
        
        <view class="goods-list">
          <view v-for="item in orderPre.goods" :key="item.skuId" class="goods-item">
            <image class="goods-image" :src="item.picture" mode="aspectFill" />
            <view class="goods-info">
              <view class="goods-name">{{ item.name }}</view>
              <view class="goods-specs">{{ item.attrsText }}</view>
                             <view class="goods-price-count">
                 <text class="goods-price">¥{{ parseFloat(item.payPrice).toFixed(2) }}</text>
                 <text class="goods-count">×{{ item.count }}</text>
               </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 配送时间 -->
      <view class="delivery-section">
        <view class="section-item" @tap="selectDeliveryTime">
          <text class="item-label">配送时间</text>
          <text class="item-value">{{ deliveryOptions.find(item => item.value === deliveryTimeType)?.text }}</text>
          <text class="arrow-right">›</text>
        </view>
      </view>
      
      <!-- 买家留言 -->
      <view class="message-section">
        <view class="section-header">
          <text class="header-title">买家留言</text>
        </view>
        <textarea 
          v-model="buyerMessage"
          class="message-input"
          placeholder="选填，请先和商家协商一致"
          :maxlength="200"
        />
      </view>
      
      <!-- 支付方式 -->
      <view class="payment-section">
        <view class="section-header">
          <text class="header-title">支付方式</text>
        </view>
        <view class="payment-options">
          <view class="payment-item">
            <text class="payment-label">在线支付</text>
            <text class="payment-desc">推荐使用支付宝、微信支付</text>
          </view>
        </view>
      </view>
      
             <!-- 订单金额 -->
       <view class="amount-section">
         <view class="amount-item">
           <text class="amount-label">商品总价</text>
           <text class="amount-value">¥{{ parseFloat(orderPre.summary.totalPrice).toFixed(2) }}</text>
         </view>
         <view class="amount-item">
           <text class="amount-label">运费</text>
           <text class="amount-value">¥{{ parseFloat(orderPre.summary.postFee).toFixed(2) }}</text>
         </view>
         <view v-if="parseFloat(orderPre.summary.discountPrice) > 0" class="amount-item">
           <text class="amount-label">优惠</text>
           <text class="amount-value discount">-¥{{ parseFloat(orderPre.summary.discountPrice).toFixed(2) }}</text>
         </view>
         <view class="amount-item total">
           <text class="amount-label">实付款</text>
           <text class="amount-value total-price">¥{{ totalAmount.toFixed(2) }}</text>
         </view>
       </view>
    </template>
    
    <!-- 底部提交栏 -->
    <view class="submit-bar">
      <view class="submit-info">
        <text class="submit-count">共{{ goodsCount }}件商品</text>
        <text class="submit-amount">实付：<text class="amount">¥{{ totalAmount.toFixed(2) }}</text></text>
      </view>
      <button 
        class="submit-btn"
        :class="{ loading: submitting }"
        :disabled="submitting || !selectedAddress"
        @tap="submitOrder"
      >
        <span class="btn-text">{{ submitting ? '提交中...' : '提交订单' }}</span>
      </button>
    </view>
  </view>
</template>

<style lang="scss">
.order-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  color: #666;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 30rpx 30rpx 20rpx;
  
  .header-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
  }
  
  .header-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }
}

// 收货地址
.address-section {
  background: #fff;
  margin-bottom: 20rpx;
  
  .address-card {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx 30rpx;
    
    .address-info {
      flex: 1;
      
      .receiver-info {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        
        .receiver-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          margin-right: 20rpx;
        }
        
        .receiver-phone {
          font-size: 28rpx;
          color: #666;
          margin-right: 20rpx;
        }
        
        .default-tag {
          background: #ff4757;
          color: #fff;
          font-size: 20rpx;
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
        }
      }
      
      .address-detail {
        font-size: 28rpx;
        color: #666;
        line-height: 1.4;
      }
    }
    
    .arrow-right {
      font-size: 32rpx;
      color: #ccc;
    }
  }
  
  .no-address {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40rpx 30rpx;
    
    .no-address-text {
      font-size: 28rpx;
      color: #999;
    }
    
    .arrow-right {
      font-size: 32rpx;
      color: #ccc;
    }
  }
}

// 商品列表
.goods-section {
  background: #fff;
  margin-bottom: 20rpx;
  
  .goods-list {
    padding: 0 30rpx 30rpx;
    
    .goods-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .goods-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
      }
      
      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .goods-name {
          font-size: 28rpx;
          color: #333;
          line-height: 1.4;
          margin-bottom: 8rpx;
        }
        
        .goods-specs {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 8rpx;
        }
        
        .goods-price-count {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .goods-price {
            font-size: 28rpx;
            color: #ff4757;
            font-weight: 600;
          }
          
          .goods-count {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
    }
  }
}

// 配送时间
.delivery-section {
  background: #fff;
  margin-bottom: 20rpx;
  
  .section-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    
    .item-label {
      font-size: 28rpx;
      color: #333;
    }
    
    .item-value {
      font-size: 28rpx;
      color: #666;
    }
    
    .arrow-right {
      font-size: 32rpx;
      color: #ccc;
    }
  }
}

// 买家留言
.message-section {
  background: #fff;
  margin-bottom: 20rpx;
  
  .message-input {
    margin: 0 30rpx 30rpx;
    padding: 20rpx;
    border: 1rpx solid #e0e0e0;
    border-radius: 8rpx;
    font-size: 28rpx;
    min-height: 120rpx;
  }
}

// 支付方式
.payment-section {
  background: #fff;
  margin-bottom: 20rpx;
  
  .payment-options {
    padding: 0 30rpx 30rpx;
    
    .payment-item {
      padding: 20rpx 0;
      
      .payment-label {
        font-size: 28rpx;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .payment-desc {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

// 订单金额
.amount-section {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
  
  .amount-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 0;
    
    &.total {
      border-top: 1rpx solid #f0f0f0;
      padding-top: 24rpx;
      margin-top: 8rpx;
    }
    
    .amount-label {
      font-size: 28rpx;
      color: #333;
    }
    
    .amount-value {
      font-size: 28rpx;
      color: #333;
      
      &.discount {
        color: #ff4757;
      }
      
      &.total-price {
        font-size: 32rpx;
        font-weight: 600;
        color: #ff4757;
      }
    }
  }
}

// 底部提交栏
.submit-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .submit-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    
    .submit-count {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 4rpx;
    }
    
    .submit-amount {
      font-size: 28rpx;
      color: #333;
      
      .amount {
        color: #ff4757;
        font-weight: 600;
        font-size: 32rpx;
      }
    }
  }
  
  .submit-btn {
    width: auto;
    min-width: 200rpx;
    padding: 0 40rpx;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    background: #27ba9b;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    border: none;
    margin-top: 20rpx;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: background 0.2s;
  }
  .submit-btn.loading {
    opacity: 0.7;
  }
  .submit-btn[disabled] {
    background: #b2dfd5;
    color: #fff;
  }
  .btn-text {
    display: inline-block;
    height: 32rpx;
    line-height: 32rpx;
    font-size: 32rpx;
    vertical-align: middle;
  }
}
</style>