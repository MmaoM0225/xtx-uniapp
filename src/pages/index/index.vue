<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'

// 轮播图数据类型（组件使用）
interface SwiperItem {
  id: string | number
  imgUrl: string
  title?: string
  desc?: string
  link?: string
}

// 搜索处理
const onSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
  uni.showToast({
    title: `搜索: ${keyword}`,
    icon: 'none',
  })
}

// logo处理
const onLogo = () => {
  console.log('点击logo')
  uni.showToast({
    title: '小兔鲜儿',
    icon: 'none',
  })
}

// 消息处理
const onMessage = () => {
  console.log('点击消息')
  uni.showToast({
    title: '消息中心',
    icon: 'none',
  })
}

// 轮播图数据
const bannerList = ref<SwiperItem[]>([])
const bannerLoading = ref(false)

// 分类数据
const categoryList = ref<CategoryItem[]>([])
const categoryLoading = ref(false)

// 热门推荐数据
const hotList = ref<HotItem[]>([])
const hotLoading = ref(false)

// 猜你喜欢组件引用
const guessRef = ref<any>(null)

// 下拉刷新状态
const refresherTriggered = ref(false)

// 获取轮播图数据
const getHomeBanner = async () => {
  try {
    bannerLoading.value = true
    console.log('开始获取轮播图数据...')

    const res = await getHomeBannerAPI(1)
    console.log('轮播图API响应:', res)

    if (res.result && Array.isArray(res.result)) {
      // 数据转换：将API返回的BannerItem转换为组件需要的格式
      bannerList.value = res.result.map((item: BannerItem) => ({
        id: item.id,
        imgUrl: item.imgUrl,
        title: '', // API没有提供title，可以根据需要设置
        desc: '', // API没有提供desc，可以根据需要设置
        link: item.hrefUrl, // 将hrefUrl转换为link
      }))
    } else {
      console.warn('轮播图数据格式异常:', res)
      bannerList.value = []
    }
  } catch (error: any) {
    console.error('获取轮播图失败:', error)
    bannerList.value = []
  } finally {
    bannerLoading.value = false
  }
}

// 获取分类数据
const getHomeCategory = async () => {
  try {
    categoryLoading.value = true
    console.log('开始获取分类数据...')

    const res = await getHomeCategoryAPI()
    console.log('分类API响应:', res)

    if (res.result && Array.isArray(res.result)) {
      categoryList.value = res.result
      console.log('分类数据获取成功:', categoryList.value)
    } else {
      console.warn('分类数据格式异常:', res)
      categoryList.value = []
    }
  } catch (error: any) {
    console.error('获取分类数据失败:', error)
    categoryList.value = []
  } finally {
    categoryLoading.value = false
  }
}

// 获取热门推荐数据
const getHomeHot = async () => {
  try {
    hotLoading.value = true
    console.log('开始获取热门推荐数据...')

    const res = await getHomeHotAPI()
    console.log('热门推荐API响应:', res)

    if (res.result && Array.isArray(res.result)) {
      hotList.value = res.result
      console.log('热门推荐数据获取成功:', hotList.value)
    } else {
      console.warn('热门推荐数据格式异常:', res)
      hotList.value = []
    }
  } catch (error: any) {
    console.error('获取热门推荐数据失败:', error)
    hotList.value = []
  } finally {
    hotLoading.value = false
  }
}

// 轮播图点击处理
const onBannerClick = (item: SwiperItem, index: number) => {
  console.log('点击轮播图:', item, index)

  if (item.link) {
    // 如果是外部链接，可以在这里处理
    if (item.link.startsWith('http')) {
      uni.showModal({
        title: '提示',
        content: '即将跳转到外部链接',
        success: (res) => {
          if (res.confirm) {
            // 这里可以调用外部浏览器打开链接
            uni.showToast({
              title: '功能开发中...',
              icon: 'none',
            })
          }
        },
      })
    } else {
      // 内部页面跳转
      uni
        .navigateTo({
          url: item.link,
        })
        .catch(() => {
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none',
          })
        })
    }
  } else {
    uni.showToast({
      title: '该轮播图暂无跳转链接',
      icon: 'none',
    })
  }
}

// 轮播图切换处理
const onBannerChange = (current: number) => {
  console.log('轮播图切换到:', current)
}

// 滚动到底部处理
const onScrollToLower = () => {
  console.log('滚动到底部，开始加载更多数据')
  if (guessRef.value) {
    guessRef.value.loadMoreData()
  }
}

// 下拉刷新处理
const onRefresh = async () => {
  console.log('开始下拉刷新...')
  refresherTriggered.value = true
  
  try {
    // 并行获取所有数据
    await Promise.all([
      getHomeBanner(),
      getHomeCategory(),
      getHomeHot()
    ])
    
    // 重置猜你喜欢组件的数据
    if (guessRef.value) {
      guessRef.value.resetAndRefresh()
    }
    
    console.log('刷新完成')
  } catch (error) {
    console.error('刷新失败:', error)
  } finally {
    // 延迟关闭刷新状态，确保用户能看到刷新动画
    setTimeout(() => {
      refresherTriggered.value = false
    }, 500)
  }
}

// 页面加载
onLoad(() => {
  // 获取轮播图数据
  getHomeBanner()
  // 获取分类数据
  getHomeCategory()
  // 获取热门推荐数据
  getHomeHot()
})
</script>

<template>
  <view class="index-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar @search="onSearch" @logo="onLogo" @message="onMessage" />

    <!-- 可滚动的页面内容 -->
    <scroll-view
      class="page-scroll-view"
      :scroll-y="true"
      :enhanced="true"
      :show-scrollbar="false"
      :refresher-enabled="true"
      :refresher-threshold="80"
      :refresher-default-style="'black'"
      :refresher-background="'#f5f5f5'"
      :refresher-triggered="refresherTriggered"
      @scrolltolower="onScrollToLower"
      @refresherrefresh="onRefresh"
    >
      <view class="page-content">
        <!-- 轮播图区域 -->
        <view class="banner-section">
          <!-- 轮播图骨架屏 -->
          <view v-if="bannerLoading" class="banner-skeleton">
            <view class="skeleton-container">
              <view class="skeleton-image"></view>
              <view class="skeleton-indicators">
                <view class="skeleton-dot" v-for="i in 3" :key="i"></view>
              </view>
            </view>
          </view>

          <!-- 轮播图内容 -->
          <XtxSwiper
            v-else-if="bannerList.length > 0"
            :list="bannerList"
            height="300rpx"
            border-radius="0rpx"
            :show-title="false"
            :show-desc="false"
            @click="onBannerClick"
            @change="onBannerChange"
          />

          <!-- 空状态 -->
          <view v-else class="banner-empty">
            <view class="empty-content">
              <text class="empty-text">暂无轮播图数据</text>
            </view>
          </view>
        </view>

        <!-- 前台分类 -->
        <CategoryPanel :list="categoryList" :loading="categoryLoading" />

        <!-- 热门推荐 -->
        <HotPanel :list="hotList" :loading="hotLoading" />
        <!-- 猜你喜欢 -->
        <XtxGuess ref="guessRef" />
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
.index-page {
  background: #f5f5f5;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .page-scroll-view {
    flex: 1;
    height: 0; // 这是为了让flex正常工作
    background: #f5f5f5;

    .page-content {
      padding-top: 0;
      min-height: 100%;

      // 轮播图区域
      .banner-section {
        margin: 20rpx 0 30rpx 0;
        width: 100%;

        .banner-skeleton {
          height: 300rpx;
          width: 100%;
          border-radius: 0rpx;
          overflow: hidden;

          .skeleton-container {
            position: relative;
            height: 100%;
            width: 100%;

            .skeleton-image {
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
              background-size: 200% 100%;
              animation: shimmer 2s infinite;
            }

            .skeleton-indicators {
              position: absolute;
              bottom: 20rpx;
              left: 50%;
              transform: translateX(-50%);
              display: flex;
              gap: 10rpx;

              .skeleton-dot {
                width: 12rpx;
                height: 12rpx;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                animation: skeleton-pulse 1.5s ease-in-out infinite;

                &:nth-child(1) {
                  animation-delay: 0s;
                }
                &:nth-child(2) {
                  animation-delay: 0.3s;
                }
                &:nth-child(3) {
                  animation-delay: 0.6s;
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

          @keyframes skeleton-pulse {
            0%, 100% {
              opacity: 0.6;
            }
            50% {
              opacity: 1;
            }
          }
        }

        .banner-empty {
          height: 300rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 0rpx;

          .empty-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20rpx;

            .empty-text {
              font-size: 28rpx;
              color: #999;
            }
          }
        }
      }
    }
  }
}
</style>
