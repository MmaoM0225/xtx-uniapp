<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getCartListAPI, updateCartItemAPI, deleteCartAPI, selectAllCartAPI, selectCartItemAPI } from '@/services/cart'
import type { CartItem } from '@/types/cart'
import XtxGuess from '@/components/XtxGuess.vue'
import { useMemberStore } from '@/stores'
import { useGuessList } from '@/composables'

// 用户状态
const memberStore = useMemberStore()

// 购物车数据
const cartList = ref<CartItem[]>([])
// 加载状态
const loading = ref(false)
// 猜你喜欢组件引用
const guessRef = ref()

// 是否已登录
const isLogin = computed(() => !!memberStore.profile?.token)

// 使用猜你喜欢组合式函数
const { onScrollToLower } = useGuessList(guessRef)



// 全选状态
const isAllSelected = computed(() => {
  const effectiveItems = cartList.value.filter(item => item.isEffective)
  return effectiveItems.length > 0 && effectiveItems.every(item => item.selected)
})

// 选中的商品
const selectedItems = computed(() => {
  return cartList.value.filter(item => item.selected && item.isEffective)
})

// 选中商品数量
const selectedCount = computed(() => {
  return selectedItems.value.reduce((total, item) => total + item.count, 0)
})

// 选中商品总价格
const selectedPrice = computed(() => {
  const total = selectedItems.value.reduce((sum, item) => {
    return sum + (parseFloat(item.nowPrice) * item.count)
  }, 0)
  return total.toFixed(2)
})

// 获取购物车数据
const getCartList = async () => {
  if (!isLogin.value) {
    console.log('用户未登录，跳过获取购物车数据')
    return
  }
  
  try {
    loading.value = true
    console.log('开始获取购物车数据...')
    const res = await getCartListAPI()
    console.log('API响应:', res)
    // 根据真实数据结构，result 直接是数组
    cartList.value = res.result || []
    console.log('购物车数据:', cartList.value)
    console.log('购物车数据长度:', cartList.value.length)
  } catch (error) {
    console.error('获取购物车数据失败:', error)
    uni.showToast({
      title: '获取购物车数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 处理左滑按钮点击
const handleSwipeClick = (event: any, item: CartItem) => {
  if (event.index === 0) { // 删除按钮
    removeItem(item)
  }
}

// 全选/取消全选
const toggleSelectAll = async () => {
  try {
    const newSelected = !isAllSelected.value
    await selectAllCartAPI(newSelected)
    
    // 更新本地状态
    cartList.value.forEach(item => {
      if (item.isEffective) {
        item.selected = newSelected
      }
    })
  } catch (error) {
    console.error('全选操作失败:', error)
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

// 单个商品选择
const toggleSelectItem = async (item: CartItem) => {
  try {
    const newSelected = !item.selected
    await selectCartItemAPI(item.skuId, newSelected)
    
    // 更新本地状态
    item.selected = newSelected
  } catch (error) {
    console.error('选择商品失败:', error)
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}

// 增加商品数量
const increaseCount = async (item: CartItem) => {
  if (item.count < item.stock) {
    try {
      const newCount = item.count + 1
      await updateCartItemAPI(item.skuId, newCount)
      item.count = newCount
    } catch (error) {
      console.error('更新数量失败:', error)
      uni.showToast({
        title: '更新失败',
        icon: 'none'
      })
    }
  } else {
    uni.showToast({
      title: '库存不足',
      icon: 'none'
    })
  }
}

// 减少商品数量
const decreaseCount = async (item: CartItem) => {
  if (item.count > 1) {
    try {
      const newCount = item.count - 1
      await updateCartItemAPI(item.skuId, newCount)
      item.count = newCount
    } catch (error) {
      console.error('更新数量失败:', error)
      uni.showToast({
        title: '更新失败',
        icon: 'none'
      })
    }
  }
}

// 删除商品
const removeItem = async (item: CartItem) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这件商品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteCartAPI([item.id])
          cartList.value = cartList.value.filter(cartItem => cartItem.id !== item.id)
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
        } catch (error) {
          console.error('删除商品失败:', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 结算
const checkout = () => {
  if (selectedItems.value.length === 0) {
    uni.showToast({
      title: '请选择要结算的商品',
      icon: 'none'
    })
    return
  }
  
  // TODO: 跳转到结算页面
  uni.navigateTo({
    url: '/pages/order/order'
  })
}



// 页面加载时获取购物车数据
onMounted(() => {
  getCartList()
  // 初始化猜你喜欢数据
  if (guessRef.value && guessRef.value.resetAndRefresh) {
    guessRef.value.resetAndRefresh()
  }
})

// 页面显示时刷新购物车数据
onShow(() => {
  getCartList()
  // 重置猜你喜欢数据
  if (guessRef.value && guessRef.value.resetAndRefresh) {
    guessRef.value.resetAndRefresh()
  }
})


</script>

<template>
  <scroll-view 
    scroll-y 
    class="scroll-view" 
    @scrolltolower="onScrollToLower"
    lower-threshold="100"
    enable-back-to-top
  >

    <!-- 已登录: 显示购物车 -->
    <template v-if="isLogin">
      <!-- 购物车列表 -->
      <view class="cart-list" v-if="cartList.length > 0">
        <!-- 优惠提示 -->
        <view class="tips">
          <text class="label">满减</text>
          <text class="desc">满1件, 即可享受9折优惠</text>
        </view>
        

        <!-- 商品列表 -->
        <view class="goods-list">
          <view 
            v-for="item in cartList" 
            :key="item.id" 
            class="cart-swipe"
          >
            <!-- 商品信息 -->
            <view class="goods" :class="{ 'invalid-goods': !item.isEffective }">
              <!-- 选中状态 -->
              <text 
                class="checkbox" 
                :class="{ 
                  checked: item.selected && item.isEffective,
                  disabled: !item.isEffective 
                }"
                @tap="item.isEffective ? toggleSelectItem(item) : null"
              ></text>
              <navigator
                :url="`/pages/goods/goods?id=${item.id}`"
                hover-class="none"
                class="navigator"
              >
                <image
                  mode="aspectFill"
                  class="picture"
                  :src="item.picture"
                ></image>
                <view class="meta">
                  <view class="name ellipsis">
                    {{ item.name }}
                    <text class="invalid-tag" v-if="!item.isEffective">失效</text>
                  </view>
                  <view class="attrsText ellipsis">
                    {{ item.attrsText || item.specs.map(spec => spec.valueName).join(' ') }}
                  </view>
                  <view class="price">{{ item.nowPrice }}</view>
                </view>
              </navigator>
              <!-- 商品数量 -->
              <view class="count">
                <text 
                  class="text"
                  :class="{ disabled: item.count <= 1 || !item.isEffective }"
                  @tap="item.isEffective ? decreaseCount(item) : null"
                >-</text>
                <input 
                  class="input" 
                  type="number" 
                  :value="item.count.toString()" 
                  disabled
                />
                <text 
                  class="text"
                  :class="{ disabled: item.count >= item.stock || !item.isEffective }"
                  @tap="item.isEffective ? increaseCount(item) : null"
                >+</text>
              </view>

            </view>
          </view>
        </view>
      </view>
      <!-- 购物车空状态 -->
      <view class="cart-blank" v-else>
        <image src="/static/images/blank_cart.png" class="image" />
        <text class="text">购物车还是空的，快来挑选好货吧</text>
        <navigator open-type="switchTab" url="/pages/index/index" hover-class="none">
          <button class="button">去首页看看</button>
        </navigator>
      </view>
      <!-- 吸底工具栏 -->
      <view class="toolbar">
        <text 
          class="all" 
          :class="{ checked: isAllSelected }"
          @tap="toggleSelectAll"
        >全选</text>
        <text class="text">合计:</text>
        <text class="amount">{{ selectedPrice }}</text>
        <view class="button-grounp">
          <view 
            class="button payment-button" 
            :class="{ disabled: selectedItems.length === 0 }"
            @tap="checkout"
          > 
            去结算({{ selectedCount }}) 
          </view>
        </view>
      </view>
    </template>
    <!-- 未登录: 提示登录 -->
    <view class="login-blank" v-else>
      <text class="text">登录后可查看购物车中的商品</text>
      <navigator url="/pages/login/login" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>
    <!-- 猜你喜欢 -->
    <XtxGuess ref="guessRef"></XtxGuess>
    <!-- 底部占位空盒子 -->
    <view class="toolbar-height"></view>
  </scroll-view>
</template>

<style lang="scss">
// 根元素
:host {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f7f7f8;
}

// 滚动容器
.scroll-view {
  flex: 1;
}

// 购物车列表
.cart-list {
  padding: 0 20rpx;

  // 优惠提示
  .tips {
    display: flex;
    align-items: center;
    line-height: 1;
    margin: 30rpx 10rpx;
    font-size: 26rpx;
    color: #666;

    .label {
      color: #fff;
      padding: 7rpx 15rpx 5rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      background-color: #27ba9b;
      margin-right: 10rpx;
    }
  }

  // 购物车商品
  .goods {
    display: flex;
    padding: 20rpx 20rpx 20rpx 80rpx;
    border-radius: 10rpx;
    background-color: #fff;
    position: relative;
    
    &.invalid-goods {
      opacity: 0.7;
      background-color: #f8f8f8;
      
      .name {
        color: #999;
      }
      
      .price {
        color: #999;
      }
      
      .picture {
        filter: grayscale(50%);
      }
    }

    .navigator {
      display: flex;
    }

    .checkbox {
      position: absolute;
      top: 0;
      left: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 100%;

      &::before {
        content: '\e6cd';
        font-family: 'erabbit' !important;
        font-size: 40rpx;
        color: #444;
      }

      &.checked::before {
        content: '\e6cc';
        color: #27ba9b;
      }
      
      &.disabled::before {
        color: #ccc;
      }
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
    }

    .name {
      height: 72rpx;
      font-size: 26rpx;
      color: #444;
      display: flex;
      align-items: center;
      
      .invalid-tag {
        margin-left: 12rpx;
        padding: 2rpx 8rpx;
        background-color: #ff4757;
        color: #fff;
        font-size: 20rpx;
        border-radius: 4rpx;
        line-height: 1;
        flex-shrink: 0;
      }
    }

    .attrsText {
      line-height: 1.8;
      padding: 0 15rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .price {
      line-height: 1;
      font-size: 26rpx;
      color: #444;
      margin-bottom: 2rpx;
      color: #cf4444;

      &::before {
        content: '￥';
        font-size: 80%;
      }
    }

    // 商品数量
    .count {
      position: absolute;
      bottom: 20rpx;
      right: 5rpx;

      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 220rpx;
      height: 48rpx;

      .text {
        height: 100%;
        padding: 0 20rpx;
        font-size: 32rpx;
        color: #444;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.disabled {
          color: #ccc;
        }
      }

      .input {
        height: 100%;
        text-align: center;
        border-radius: 4rpx;
        font-size: 24rpx;
        color: #444;
        background-color: #f6f6f6;
      }
    }
  }

  .cart-swipe {
    display: block;
    margin: 20rpx 0;
  }

  .cart-swipe-right {
    display: flex;
    height: 100%;

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      padding: 6px;
      line-height: 1.5;
      color: #fff;
      font-size: 26rpx;
      border-radius: 0;
    }

    .delete-button {
      background-color: #cf4444;
    }
  }
  

}

// 空状态
.cart-blank,
.login-blank {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;
  .image {
    width: 400rpx;
    height: 281rpx;
  }
  .text {
    color: #444;
    font-size: 26rpx;
    margin: 20rpx 0;
  }
  .button {
    width: 240rpx !important;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    border-radius: 60rpx;
    color: #fff;
    background-color: #27ba9b;
  }
}

// 吸底工具栏
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;

  .all {
    margin-left: 25rpx;
    font-size: 14px;
    color: #444;
    display: flex;
    align-items: center;
  }

  .all::before {
    font-family: 'erabbit' !important;
    content: '\e6cd';
    font-size: 40rpx;
    margin-right: 8rpx;
  }

  .checked::before {
    content: '\e6cc';
    color: #27ba9b;
  }

  .text {
    margin-right: 8rpx;
    margin-left: 32rpx;
    color: #444;
    font-size: 14px;
  }

  .amount {
    font-size: 20px;
    color: #cf4444;

    .decimal {
      font-size: 12px;
    }

    &::before {
      content: '￥';
      font-size: 12px;
    }
  }

  .button-grounp {
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    text-align: center;
    line-height: 72rpx;
    font-size: 13px;
    color: #fff;

    .button {
      width: 240rpx;
      margin: 0 10rpx;
      border-radius: 72rpx;
    }

    .payment-button {
      background-color: #27ba9b;

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}
// 底部占位空盒子
.toolbar-height {
  height: 100rpx;
}
</style>
