<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GoodsResult } from '@/types/goods'

// 定义组件props
interface Props {
  goods: GoodsResult
  mode?: 'cart' | 'buy' // 模式：加入购物车 或 立即购买
}

// 定义组件emits
interface Emits {
  (e: 'addToCart', skuId: string, quantity: number): void
  (e: 'buyNow', skuId: string, quantity: number): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'cart'
})

const emit = defineEmits<Emits>()

// SKU选择逻辑
// 当前选中的规格 {规格名: 规格值}
const selectedSpecs = ref<Record<string, string>>({})

// 当前选中的SKU
const selectedSku = computed(() => {
  const specKeys = Object.keys(selectedSpecs.value)
  if (specKeys.length !== props.goods.specs.length) {
    return null
  }
  
  return props.goods.skus.find(sku => {
    return sku.specs.every(spec => 
      selectedSpecs.value[spec.name] === spec.valueName
    )
  })
})

// 当前选中规格的文本描述
const selectedSpecsText = computed(() => {
  const specs = Object.entries(selectedSpecs.value)
  if (specs.length === 0) return ''
  
  return specs.map(([name, value]) => `${name}: ${value}`).join(', ')
})

// 判断某个规格值是否可选
const isSpecValueAvailable = (specName: string, valueName: string) => {
  // 创建临时选择状态
  const tempSelected = { ...selectedSpecs.value, [specName]: valueName }
  
  // 检查是否有匹配的SKU且有库存
  return props.goods.skus.some(sku => {
    // 检查当前SKU是否匹配所有已选择的规格
    const isMatch = sku.specs.every(spec => {
      const selectedValue = tempSelected[spec.name]
      return !selectedValue || selectedValue === spec.valueName
    })
    
    // 只有匹配且有库存的SKU才算可选
    return isMatch && sku.inventory > 0
  })
}

// 选择规格
const selectSpec = (specName: string, valueName: string) => {
  // 如果已经选中相同的值，则取消选择
  if (selectedSpecs.value[specName] === valueName) {
    delete selectedSpecs.value[specName]
  } else {
    selectedSpecs.value[specName] = valueName
  }
  
  // 触发响应式更新
  selectedSpecs.value = { ...selectedSpecs.value }
}

// 检查是否已选择完整规格
const isCompleteSelection = computed(() => {
  return Object.keys(selectedSpecs.value).length === props.goods.specs.length
})

// 选择数量
const quantity = ref(1)

// 加载状态
const isLoading = ref(false)

// 当前显示的商品图片
const currentImage = computed(() => {
  return selectedSku.value?.picture || props.goods.mainPictures[0]
})

// 当前显示的价格
const currentPrice = computed(() => {
  return selectedSku.value?.price || props.goods.price
})

// 当前显示的原价
const currentOldPrice = computed(() => {
  return selectedSku.value?.oldPrice || props.goods.oldPrice
})

// 当前显示的库存
const currentInventory = computed(() => {
  return selectedSku.value?.inventory || props.goods.inventory
})

// 最大可选数量
const maxQuantity = computed(() => {
  return Math.min(currentInventory.value, 999)
})

// 数量减少
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 数量增加
const increaseQuantity = () => {
  if (quantity.value < maxQuantity.value) {
    quantity.value++
  }
}

// 数量输入处理
const onQuantityInput = (e: any) => {
  const value = parseInt(e.detail.value)
  if (isNaN(value) || value < 1) {
    quantity.value = 1
  } else if (value > maxQuantity.value) {
    quantity.value = maxQuantity.value
  } else {
    quantity.value = value
  }
}

// 获取规格值的样式类名
const getSpecValueClass = (specName: string, valueName: string) => {
  const isSelected = selectedSpecs.value[specName] === valueName
  const isAvailable = isSpecValueAvailable(specName, valueName)
  
  return [
    'spec-value',
    {
      'selected': isSelected,
      'disabled': !isAvailable
    }
  ]
}

// 处理规格选择
const handleSpecSelect = (specName: string, valueName: string) => {
  if (isSpecValueAvailable(specName, valueName)) {
    selectSpec(specName, valueName)
  }
}

// 加入购物车
const handleAddToCart = () => {
  // 防止重复提交
  if (isLoading.value) {
    return
  }
  
  if (!isCompleteSelection.value) {
    uni.showToast({
      title: '请选择完整的商品规格',
      icon: 'none'
    })
    return
  }
  
  if (!selectedSku.value) {
    uni.showToast({
      title: '商品规格不存在',
      icon: 'none'
    })
    return
  }
  
  if (selectedSku.value.inventory <= 0) {
    uni.showToast({
      title: '商品库存不足',
      icon: 'none'
    })
    return
  }
  
  if (quantity.value > selectedSku.value.inventory) {
    uni.showToast({
      title: '购买数量不能超过库存',
      icon: 'none'
    })
    return
  }
  
  isLoading.value = true
  emit('addToCart', selectedSku.value.id, quantity.value)
  
  // 延迟重置加载状态，防止快速重复点击
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}

// 立即购买
const handleBuyNow = () => {
  // 防止重复提交
  if (isLoading.value) {
    return
  }
  
  if (!isCompleteSelection.value) {
    uni.showToast({
      title: '请选择完整的商品规格',
      icon: 'none'
    })
    return
  }
  
  if (!selectedSku.value) {
    uni.showToast({
      title: '商品规格不存在',
      icon: 'none'
    })
    return
  }
  
  if (selectedSku.value.inventory <= 0) {
    uni.showToast({
      title: '商品库存不足',
      icon: 'none'
    })
    return
  }
  
  if (quantity.value > selectedSku.value.inventory) {
    uni.showToast({
      title: '购买数量不能超过库存',
      icon: 'none'
    })
    return
  }
  
  isLoading.value = true
  emit('buyNow', selectedSku.value.id, quantity.value)
  
  // 延迟重置加载状态
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}


</script>

<template>
  <view class="sku-panel">
    <!-- 头部商品信息 -->
    <view class="sku-header">
      <image class="goods-image" :src="currentImage" mode="aspectFill" />
      <view class="goods-info">
        <view class="price-info">
          <text class="current-price">¥{{ currentPrice }}</text>
          <text class="old-price" v-if="currentOldPrice !== currentPrice">¥{{ currentOldPrice }}</text>
        </view>
        <view class="inventory-info">库存{{ currentInventory }}件</view>
        <view class="selected-specs" v-if="selectedSpecsText">
          已选择：{{ selectedSpecsText }}
        </view>
      </view>
    </view>

    <!-- 规格选择区域 -->
    <view class="specs-section">
      <view class="spec-group" v-for="spec in goods.specs" :key="spec.id">
        <view class="spec-name">{{ spec.name }}</view>
        <view class="spec-values">
          <view
            v-for="value in spec.values"
            :key="value.name"
            :class="getSpecValueClass(spec.name, value.name)"
            @tap="handleSpecSelect(spec.name, value.name)"
          >
            <!-- 如果有图片则显示图片 -->
            <image
              v-if="value.picture"
              :src="value.picture"
              class="spec-image"
              mode="aspectFill"
            />
            <text class="spec-text">{{ value.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 数量选择区域 -->
    <view class="quantity-section">
      <view class="quantity-label">数量</view>
      <view class="quantity-controls">
        <view class="quantity-btn" :class="{ disabled: quantity <= 1 }" @tap="decreaseQuantity">
          <text class="icon-minus">-</text>
        </view>
        <input
          class="quantity-input"
          type="number"
          :value="quantity.toString()"
          @input="onQuantityInput"
        />
        <view class="quantity-btn" :class="{ disabled: quantity >= maxQuantity }" @tap="increaseQuantity">
          <text class="icon-plus">+</text>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="action-buttons">
      <view class="btn-group">
        <view 
          class="btn btn-cart" 
          :class="{ disabled: isLoading }"
          @tap="handleAddToCart"
        >
          {{ isLoading ? '加入中...' : '加入购物车' }}
        </view>
        <view 
          class="btn btn-buy" 
          :class="{ disabled: isLoading }"
          @tap="handleBuyNow"
        >
          {{ isLoading ? '处理中...' : '立即购买' }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.sku-panel {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;
  overflow-y: auto;
}

.sku-header {
  display: flex;
  padding: 30rpx;
  border-bottom: 1rpx solid #eaeaea;
  position: relative;
  
  .goods-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
  }
  
  .goods-info {
    flex: 1;
    
    .price-info {
      display: flex;
      align-items: baseline;
      margin-bottom: 10rpx;
      
      .current-price {
        font-size: 36rpx;
        font-weight: bold;
        color: #cf4444;
        margin-right: 20rpx;
      }
      
      .old-price {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
      }
    }
    
    .inventory-info {
      font-size: 24rpx;
      color: #666;
      margin-bottom: 10rpx;
    }
    
    .selected-specs {
      font-size: 24rpx;
      color: #333;
    }
  }
  
  .close-btn {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .icon-close {
      font-size: 40rpx;
      color: #999;
    }
  }
}

.specs-section {
  padding: 30rpx;
  
  .spec-group {
    margin-bottom: 40rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .spec-name {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
      font-weight: 500;
    }
    
    .spec-values {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      .spec-value {
        min-width: 80rpx;
        height: 60rpx;
        border: 2rpx solid #eee;
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20rpx;
        background-color: #fff;
        position: relative;
        
        &.selected {
          border-color: #27ba9b;
          background-color: #f0fdf4;
          
          .spec-text {
            color: #27ba9b;
          }
        }
        
        &.disabled {
          border-color: #eee;
          background-color: #f5f5f5;
          position: relative;
          
          .spec-text {
            color: #ccc;
          }
          
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2rpx;
            height: 80%;
            background-color: #ccc;
            transform: translate(-50%, -50%) rotate(45deg);
          }
        }
        
        .spec-image {
          width: 40rpx;
          height: 40rpx;
          border-radius: 6rpx;
          margin-right: 10rpx;
        }
        
        .spec-text {
          font-size: 24rpx;
          color: #333;
          white-space: nowrap;
        }
      }
    }
  }
}

.quantity-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-top: 1rpx solid #eaeaea;
  
  .quantity-label {
    font-size: 28rpx;
    color: #333;
  }
  
  .quantity-controls {
    display: flex;
    align-items: center;
    
    .quantity-btn {
      width: 60rpx;
      height: 60rpx;
      border: 1rpx solid #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      
      &.disabled {
        background-color: #f5f5f5;
        color: #ccc;
      }
      
      &:first-child {
        border-radius: 10rpx 0 0 10rpx;
      }
      
      &:last-child {
        border-radius: 0 10rpx 10rpx 0;
      }
      
      .icon-minus,
      .icon-plus {
        font-size: 32rpx;
        color: #666;
      }
    }
    
    .quantity-input {
      width: 100rpx;
      height: 60rpx;
      border: 1rpx solid #eee;
      border-left: none;
      border-right: none;
      text-align: center;
      font-size: 28rpx;
      background-color: #fff;
    }
  }
}

.action-buttons {
  padding: 30rpx;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  
  .btn-group {
    display: flex;
    gap: 20rpx;
    
    .btn {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      font-weight: 500;
      
      &.btn-cart {
        background-color: #ffa726;
        color: #fff;
      }
      
      &.btn-buy {
        background-color: #27ba9b;
        color: #fff;
      }
      
      &.disabled {
        opacity: 0.6;
        pointer-events: none;
      }
    }
  }
}
</style> 