<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { getHotAPI } from '@/services/hot'
import type { HotResult, HotGoodsItem, HotSubType } from '@/types/hot'
import type { IResData } from '@/utils/request'
import type { ApiResult } from '@/types/global'

// 热门页面配置
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]

// 页面参数
const query = ref<{
  type: string
}>({
  type: ''
})

// 页面数据
const hotData = ref<HotResult>()
const currentGoodsList = ref<HotGoodsItem[]>([])
const loading = ref(false)
const finished = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const apiPath = ref('')

// state additions
const subTypes = ref<HotSubType[]>([])
const selectedSubTypeId = ref('')

// 获取热门推荐数据
const getHotData = async (isLoadMore = false) => {
  if (loading.value || (finished.value && isLoadMore)) return
  
  try {
    loading.value = true
    console.log('获取热门推荐数据...', query.value)
    
    const res = await getHotAPI(apiPath.value, {
      subType: selectedSubTypeId.value,
      page: currentPage.value,
      pageSize: pageSize.value
    })

    const resultData = res.result

    if (resultData) {
      
      // 获取商品列表（根据选中的子类型）
      let goodsList: HotGoodsItem[] = []
      if (resultData.subTypes && resultData.subTypes.length > 0) {
        // 找到选中的子类型
        const selectedSubType = resultData.subTypes.find(st => st.id === selectedSubTypeId.value)

        if (selectedSubType && selectedSubType.goodsItems) {
          goodsList = selectedSubType.goodsItems.items || []
        }
      }
      
      if (isLoadMore) {
        // 加载更多
        currentGoodsList.value = [...currentGoodsList.value, ...goodsList]
      } else {
        // 首次加载
        hotData.value = resultData
        subTypes.value = resultData.subTypes || []
        
        // 设置默认选中的子类型ID
        if (!selectedSubTypeId.value && subTypes.value.length > 0) {
          selectedSubTypeId.value = subTypes.value[0].id
        }
        
        // 根据选中的子类型获取商品列表
        const selectedSubType = subTypes.value.find(st => st.id === selectedSubTypeId.value)
        if (selectedSubType && selectedSubType.goodsItems) {
          currentGoodsList.value = selectedSubType.goodsItems.items || []
        } else {
          currentGoodsList.value = goodsList
        }
        
        currentPage.value = 1
        finished.value = false
        // 同步本地 goodsList 为 currentGoodsList，确保日志中长度正确
        goodsList = currentGoodsList.value
      }
      
      // 检查是否还有更多数据
      if (goodsList.length < pageSize.value) {
        finished.value = true
      } else {
        currentPage.value++
      }
      
    } else {
      console.warn('热门推荐数据格式异常:', res)
    }
    
  } catch (error) {
    console.error('获取热门推荐数据失败:', error)
  } finally {
    loading.value = false
  }
}



// 商品点击处理
const onGoodsClick = (item: any) => {
  // 跳转到商品详情页
  uni.navigateTo({
    url: `/pages/goods/goods?id=${item.id}`,
  })
}

// navigation change handler
const onTabClick = (st: HotSubType) => {
  if (st.id === selectedSubTypeId.value) return
  selectedSubTypeId.value = st.id
  currentPage.value = 1
  finished.value = false
  
  // 从现有数据中获取对应子类型的商品
  if (hotData.value && hotData.value.subTypes) {
    const selectedSubType = hotData.value.subTypes.find(subType => subType.id === st.id)
    if (selectedSubType && selectedSubType.goodsItems) {
      currentGoodsList.value = selectedSubType.goodsItems.items || []
    }
  }
}

// 页面加载
onLoad((options) => {
  console.log('热门页面加载，参数:', options)
  
  if (options) {
    query.value.type = options.type || '1'
  }
  
  // 根据type查找对应的配置并设置标题
  const hotConfig = hotMap.find(config => config.type === query.value.type)
  const pageTitle = hotConfig ? hotConfig.title : '热门推荐'
  
  console.log('根据type查找到的配置:', hotConfig)
  console.log('设置页面标题:', pageTitle)
  
  // 设置导航栏标题
  uni.setNavigationBarTitle({
    title: pageTitle
  })
  
  // 获取数据
  apiPath.value = hotConfig?.url || ''
  getHotData()
})

// 触底加载更多
onReachBottom(() => {
  console.log('触底加载更多')
  getHotData(true)
})

// 格式化价格
const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2)
}


</script>

<template>
  <view class="hot-page">
    <!-- 顶部横幅 -->
    <view class="hot-banner" v-if="hotData?.bannerPicture">
      <image
        :src="hotData.bannerPicture"
        class="banner-image"
        mode="aspectFill"
        @error="() => {}"
      />
    </view>
    
    <!-- 子类型Tabs -->
    <scroll-view scroll-x class="subtype-tabs" v-if="subTypes.length">
      <view
        class="tab-item"
        v-for="st in subTypes"
        :key="st.id"
        :class="{ active: st.id === selectedSubTypeId }"
        @click="onTabClick(st)"
      >
        {{ st.title }}
      </view>
    </scroll-view>

    <!-- 商品列表 -->
    <view class="goods-list">
      <!-- 加载状态 -->
      <view v-if="loading && !hotData" class="loading-skeleton">
        <view class="skeleton-item" v-for="i in 6" :key="i">
          <view class="skeleton-image"></view>
          <view class="skeleton-info">
            <view class="skeleton-line short"></view>
            <view class="skeleton-line long"></view>
            <view class="skeleton-line medium"></view>
          </view>
        </view>
      </view>
      
      <!-- 商品网格 -->
      <view v-else-if="currentGoodsList.length" class="goods-grid">
        <view
          class="goods-item"
          v-for="item in currentGoodsList"
          :key="item.id"
          @click="onGoodsClick(item)"
        >
          <!-- 商品图片 -->
          <view class="goods-image-wrapper">
            <image
              :src="item.picture"
              class="goods-image"
              mode="aspectFill"
              loading="lazy"
            />

          </view>
          
          <!-- 商品信息 -->
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-desc">{{ item.desc }}</text>
            
            <!-- 价格 -->
            <view class="goods-footer">
              <view class="price-container">
                <text class="price-symbol">¥</text>
                <text class="price-value">{{ formatPrice(item.price) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-else class="empty-state">
        <view class="empty-icon">📦</view>
        <text class="empty-text">暂无商品数据</text>
      </view>
    </view>
    
    <!-- 加载更多状态 -->
    <view v-if="loading && hotData" class="loading-more">
      <view class="loading-spinner">⏳</view>
      <text class="loading-text">正在加载更多...</text>
    </view>
    
    <!-- 没有更多数据 -->
    <view v-if="finished && currentGoodsList.length" class="no-more">
      <text class="no-more-text">没有更多商品了~</text>
    </view>
  </view>
</template>

<style lang="scss">
.hot-page {
  min-height: 100vh;
  background: #f5f5f5;
  
  .hot-banner {
    width: 100%;
    height: 200rpx;
    position: relative;
    overflow: hidden;
    
    .banner-image {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
  }
  
  .subtype-tabs {
    background: #fff;
    padding: 0 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    white-space: nowrap;
    
    .tab-item {
      display: inline-block;
      padding: 24rpx 32rpx;
      font-size: 28rpx;
      color: #666;
      position: relative;
      transition: all 0.3s ease;
      
      &.active {
        color: #ff4757;
        font-weight: 600;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background: #ff4757;
          border-radius: 2rpx;
        }
      }
      
      &:active {
        opacity: 0.7;
      }
    }
  }
  
  .goods-list {
    padding: 20rpx;
    
    .loading-skeleton {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
      
      .skeleton-item {
        background: #fff;
        border-radius: 12rpx;
        overflow: hidden;
        
        .skeleton-image {
          width: 100%;
          height: 200rpx;
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .skeleton-info {
          padding: 20rpx;
          display: flex;
          flex-direction: column;
          gap: 12rpx;
          
          .skeleton-line {
            height: 24rpx;
            background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
            border-radius: 4rpx;
            
            &.short {
              width: 60%;
            }
            
            &.medium {
              width: 80%;
            }
            
            &.long {
              width: 100%;
            }
          }
        }
      }
    }
    
    .goods-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
      
      .goods-item {
        background: #fff;
        border-radius: 12rpx;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        
        &:active {
          transform: scale(0.98);
        }
        
        .goods-image-wrapper {
          position: relative;
          width: 100%;
          height: 200rpx;
          
          .goods-image {
            width: 100%;
            height: 100%;
            display: block;
          }
          
          .discount-tag {
            position: absolute;
            top: 8rpx;
            right: 8rpx;
            background: #ff4757;
            border-radius: 8rpx;
            padding: 4rpx 8rpx;
            
            .discount-text {
              font-size: 18rpx;
              color: #fff;
              font-weight: 600;
              line-height: 1;
            }
          }
        }
        
        .goods-info {
          padding: 20rpx;
          
          .goods-name {
            font-size: 26rpx;
            font-weight: 600;
            color: #333;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 8rpx;
          }
          
          .goods-desc {
            font-size: 22rpx;
            color: #666;
            line-height: 1.2;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 12rpx;
          }
          
          .goods-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            .price-container {
              display: flex;
              align-items: baseline;
              color: #ff4757;
              font-weight: 600;
              
              .price-symbol {
                font-size: 20rpx;
              }
              
              .price-value {
                font-size: 28rpx;
              }
            }
            
            .order-container {
              .order-text {
                font-size: 20rpx;
                color: #999;
              }
            }
          }
        }
      }
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 120rpx 0;
      
      .empty-icon {
        font-size: 120rpx;
        margin-bottom: 30rpx;
        opacity: 0.6;
      }
      
      .empty-text {
        font-size: 28rpx;
        color: #999;
      }
    }
  }
  
  .loading-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx 0;
    gap: 20rpx;
    
    .loading-spinner {
      font-size: 32rpx;
      animation: spin 1s linear infinite;
    }
    
    .loading-text {
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .no-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx 0;
    
    .no-more-text {
      font-size: 26rpx;
      color: #999;
      position: relative;
      
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 60rpx;
        height: 1rpx;
        background: #ddd;
      }
      
      &::before {
        left: -80rpx;
      }
      
      &::after {
        right: -80rpx;
      }
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>