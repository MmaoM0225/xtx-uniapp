<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import XtxSwiper from '@/components/XtxSwiper.vue'
import { getCategoryTopAPI } from '@/services/category'
import { getHomeBannerAPI } from '@/services/home'
import type { CategoryTopItem, CategoryChild } from '@/types/category'
import type { BannerItem } from '@/types/home'

// 加载状态
const loading = ref(true)

// 一级分类列表
const categories = ref<CategoryTopItem[]>([])
// 选中分类ID
const selectedCategoryId = ref('')
// 轮播图列表
const banners = ref<BannerItem[]>([])
// 二级分类
const childCategories = ref<CategoryChild[]>([])

// 更新视图数据（仅更新子分类）
const updateView = (id: string) => {
  const cat = categories.value.find(c => c.id === id)
  if (cat) {
    childCategories.value = cat.children
  } else {
    childCategories.value = []
  }
}

// 分类点击
const handleCategoryClick = (cat: CategoryTopItem) => {
  if (cat.id === selectedCategoryId.value) return
  selectedCategoryId.value = cat.id
  updateView(cat.id)
}

// 页面加载，获取分类和页面轮播图
onLoad(async () => {
  loading.value = true
  try {
    const [catRes, bannerRes] = await Promise.all([
      getCategoryTopAPI(),
      getHomeBannerAPI(2)
    ])
    categories.value = catRes.result
    banners.value = bannerRes.result
    if (categories.value.length > 0) {
      selectedCategoryId.value = categories.value[0].id
      updateView(selectedCategoryId.value)
    }
  } catch (err) {
    console.error('获取分类或轮播图数据失败:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <view class="category-page">
    <!-- 左侧一级分类 -->
    <scroll-view class="left-menu" scroll-y>
      <template v-if="loading">
        <view class="menu-item skeleton" v-for="i in 8" :key="i"></view>
      </template>
      <template v-else>
        <view
          class="menu-item"
          v-for="cat in categories"
          :key="cat.id"
          :class="{ active: cat.id === selectedCategoryId }"
          @click="handleCategoryClick(cat)"
        >
          {{ cat.name }}
        </view>
      </template>
    </scroll-view>

    <!-- 右侧内容 -->
    <view class="right-content">
      <!-- 轮播图区域 -->
      <template v-if="loading">
        <view class="banner-skeleton skeleton"></view>
      </template>
      <template v-else>
        <XtxSwiper
          class="banner-swiper"
          :list="banners"
          height="240rpx"
          border-radius="0rpx"
        />
      </template>

      <!-- 二级分类网格 -->
      <view class="child-grid">
        <template v-if="loading">
          <view class="child-item skeleton-item" v-for="i in 8" :key="i">
            <view class="child-img skeleton"></view>
            <text class="child-name skeleton"></text>
          </view>
        </template>
        <template v-else>
          <view
            class="child-item"
            v-for="child in childCategories"
            :key="child.id"
          >
            <image :src="child.picture" class="child-img" mode="aspectFill" />
            <text class="child-name">{{ child.name }}</text>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.category-page {
  display: flex;
  height: 100vh;
  background: #f5f5f5;

  .left-menu {
    /* 固定宽度，禁止收缩 */
    flex: 0 0 150rpx;
    max-width: 150rpx;
    width: 150rpx;
    background: #f0f0f0;
    border-right: 1rpx solid #eee;

    .menu-item {
      padding: 30rpx 20rpx;
      font-size: 28rpx;
      color: #333;
      text-align: center;
      border-bottom: 1rpx solid #f0f0f0;

      &.active {
        background: #fff;
        font-weight: 600;
        color: #27ba9b;
      }
    }
  }

  .right-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .banner-swiper {
      width: 100%;
      height: 240rpx;
    }

    .child-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
      padding: 20rpx;
      background: #f5f5f5;

      .child-item {
        /* 固定高度，不随容器伸缩 */
        height: 260rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20rpx;
        /* 添加背景颜色和圆角 */
        background: #fff;
        border-radius: 12rpx;

        .child-img {
          width: 160rpx;
          height: 160rpx;
          border-radius: 12rpx;
        }
        .child-name {
          margin-top: 12rpx;
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}

/* Skeleton 样式 */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

}
.menu-item.skeleton {
  height: 80rpx;
  margin-bottom: 10rpx;
  border-radius: 8rpx;
}
.banner-skeleton {
  width: 100%;
  height: 360rpx;
  border-radius: 0;
  margin-bottom: 20rpx;
}
.skeleton-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}
.skeleton-item .child-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}
.skeleton-item .child-name {
  width: 80rpx;
  height: 30rpx;
  border-radius: 4rpx;
}
</style>
