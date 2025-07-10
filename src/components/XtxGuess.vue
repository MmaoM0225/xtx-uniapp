<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { GuessItem } from '@/types/home'
import type { PageParams } from '@/types/global'
import { getHomeGuessLikeAPI } from '@/services/home'

// 猜你喜欢数据
const guessList = ref<GuessItem[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const isLoadingMore = ref(false)

// 获取猜你喜欢数据
const getGuessData = async (isLoadMore: boolean = false) => {
  try {
    // 如果是加载更多，设置加载更多状态；如果是初次加载，设置loading状态
    if (isLoadMore) {
      if (isLoadingMore.value || !hasMore.value) {
        console.log('正在加载或没有更多数据了')
        return
      }
      isLoadingMore.value = true
    } else {
      loading.value = true
      currentPage.value = 1
      hasMore.value = true
    }

    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
    }

    console.log('开始获取猜你喜欢数据...', params, isLoadMore ? '(加载更多)' : '(初次加载)')

    const res = await getHomeGuessLikeAPI(params)
    console.log('猜你喜欢API完整响应:', JSON.stringify(res, null, 2))

    // 更宽松的数据格式检查
    if (res && res.result) {
      const result = res.result as any // 使用any类型进行更宽松的检查

      let newItems: GuessItem[] = []

      // 检查result是否直接是数组
      if (Array.isArray(result)) {
        newItems = result
        console.log('猜你喜欢数据获取成功(直接数组):', newItems.length, '条数据')
      }
      // 检查result.items是否是数组
      else if (result.items && Array.isArray(result.items)) {
        // 数据格式转换，确保类型正确
        newItems = result.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          desc: item.desc,
          price: parseFloat(item.price) || 0, // 字符串转数字
          picture: item.picture,
          discount: item.discount || 10, // 默认无折扣
          orderNum: item.orderNum || 0,
        }))
        console.log('猜你喜欢数据获取成功(items数组):', newItems.length, '条数据')

        // 更新分页信息
        if (result.page && result.pages) {
          currentPage.value = result.page
          hasMore.value = result.page < result.pages
          console.log(`分页信息: 当前页${result.page}/${result.pages}, 还有更多: ${hasMore.value}`)
        }
      }
      // 检查result本身是否有数据属性
      else if (result.data && Array.isArray(result.data)) {
        newItems = result.data
        console.log('猜你喜欢数据获取成功(data数组):', newItems.length, '条数据')
      } else {
        console.warn('猜你喜欢数据格式异常，result结构:', result)
        newItems = []
      }

      // 根据是否为加载更多来决定数据处理方式
      if (isLoadMore) {
        // 加载更多：追加数据
        guessList.value = [...guessList.value, ...newItems]
        console.log('加载更多完成，总数据量:', guessList.value.length)
      } else {
        // 初次加载：替换数据
        guessList.value = newItems
        console.log('初次加载完成，数据量:', guessList.value.length)
      }

      // 如果返回的数据少于pageSize，说明没有更多数据了
      if (newItems.length < pageSize.value) {
        hasMore.value = false
        console.log('数据量少于pageSize，没有更多数据了')
      }
    } else {
      console.warn('猜你喜欢API响应格式异常:', res)
      if (!isLoadMore) {
        guessList.value = []
      }
    }
  } catch (error: any) {
    console.error('获取猜你喜欢数据失败:', error)
    if (!isLoadMore) {
      guessList.value = []
    }
  } finally {
    if (isLoadMore) {
      isLoadingMore.value = false
    } else {
      loading.value = false
    }
    console.log('猜你喜欢数据请求完成，loading状态:', loading.value)
    console.log('猜你喜欢数据列表长度:', guessList.value.length)
    console.log('还有更多数据:', hasMore.value)
  }
}

// 商品点击处理
const onGuessClick = (item: GuessItem) => {
  // 跳转到商品详情页
  uni.navigateTo({
    url: `/pages/goods/goods?id=${item.id}`,
  })
}

// 格式化价格显示
const formatPrice = (price: number) => {
  return price.toFixed(2)
}

// 格式化销量显示
const formatOrderNum = (orderNum: number) => {
  if (orderNum >= 1000) {
    return (orderNum / 1000).toFixed(1) + 'k'
  }
  return orderNum.toString()
}

// 加载更多数据
const loadMoreData = async () => {
  if (hasMore.value && !isLoadingMore.value) {
    currentPage.value++
    await getGuessData(true)
  }
}

// 重新获取数据
const resetAndRefresh = async () => {
  guessList.value = []
  currentPage.value = 1
  hasMore.value = true
  await getGuessData(false)
}

// 暴露方法给父组件
defineExpose({
  loadMoreData,
  resetAndRefresh,
})

// 组件挂载时获取数据
onMounted(() => {
  console.log('XtxGuess组件挂载，开始获取数据...')
  getGuessData(false)
})
</script>

<template>
  <view class="guess-panel">
    <!-- 猜你喜欢标题 -->
    <view class="guess-title">
      <text class="title-text">猜你喜欢</text>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="guess-loading">
      <view class="loading-grid">
        <view class="loading-item" v-for="i in 4" :key="i">
          <view class="loading-image"></view>
          <view class="loading-info">
            <view class="loading-line short"></view>
            <view class="loading-line long"></view>
            <view class="loading-line medium"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空数据状态 -->
    <view v-else-if="guessList.length === 0" class="guess-empty">
      <view class="empty-icon">📦</view>
      <text class="empty-text">暂无猜你喜欢的商品</text>
    </view>

    <!-- 商品网格 -->
    <view v-else class="guess-grid">
      <view
        class="guess-item"
        v-for="item in guessList"
        :key="item.id"
        @click="onGuessClick(item)"
      >
        <view class="guess-image-wrapper">
          <image
            :src="item.picture"
            class="guess-image"
            mode="aspectFill"
            :alt="item.name"
            loading="lazy"
          />
          <!-- 折扣标签 -->
          <view v-if="item.discount < 10" class="discount-tag">
            <text class="discount-text">{{ item.discount }}折</text>
          </view>
        </view>

        <!-- 商品信息 -->
        <view class="guess-info">
          <!-- 商品名称 -->
          <text class="guess-name">{{ item.name }}</text>

          <!-- 商品描述 -->
          <text class="guess-desc">{{ item.desc }}</text>

          <!-- 价格和销量 -->
          <view class="guess-footer">
            <view class="price-container">
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ formatPrice(item.price) }}</text>
            </view>

            <view class="order-container">
              <text class="order-text">已售{{ formatOrderNum(item.orderNum) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多状态 -->
    <view v-if="isLoadingMore" class="loading-more">
      <view class="loading-spinner">⏳</view>
      <text class="loading-text">正在加载更多...</text>
    </view>

    <!-- 没有更多数据提示 -->
    <view v-else-if="!hasMore && guessList.length > 0" class="no-more">
      <text class="no-more-text">没有更多数据了~</text>
    </view>
  </view>
</template>

<style lang="scss">
.guess-panel {
  margin: 0 0 30rpx;
  background: #fff;
  border-radius: 0;
  padding: 30rpx;
  box-shadow: none;

  .guess-title {
    margin-bottom: 30rpx;
    text-align: center;

    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 60rpx;
        height: 2rpx;
        background: linear-gradient(90deg, transparent, #27ba9b, transparent);
      }

      &::before {
        left: -80rpx;
      }

      &::after {
        right: -80rpx;
      }
    }
  }

  .guess-loading {
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;

      .loading-item {
        display: flex;
        flex-direction: column;
        border-radius: 12rpx;
        overflow: hidden;
        background: #f8f9fa;

        .loading-image {
          width: 100%;
          height: 200rpx;
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .loading-info {
          padding: 20rpx;
          display: flex;
          flex-direction: column;
          gap: 8rpx;

          .loading-line {
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

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  }

  .guess-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;

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

  .guess-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;

    .guess-item {
      display: flex;
      flex-direction: column;
      border-radius: 12rpx;
      overflow: hidden;
      background: #f8f9fa;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.98);
        background: #e9ecef;
      }

      .guess-image-wrapper {
        position: relative;
        width: 100%;
        height: 200rpx;
        overflow: hidden;

        .guess-image {
          width: 100%;
          height: 100%;
          background: #eee;
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

      .guess-info {
        padding: 20rpx;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        flex: 1;

        .guess-name {
          font-size: 26rpx;
          font-weight: 600;
          color: #333;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .guess-desc {
          font-size: 22rpx;
          color: #666;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .guess-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 8rpx;

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

  .loading-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx 0;
    gap: 20rpx;
    width: 100%;
    text-align: center;

    .loading-spinner {
      font-size: 32rpx;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      font-size: 28rpx;
      color: #666;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .no-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx 0;
    width: 100%;
    text-align: center;

    .no-more-text {
      font-size: 28rpx;
      color: #999;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 60rpx;
        height: 1rpx;
        background: #e5e5e5;
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
</style>
