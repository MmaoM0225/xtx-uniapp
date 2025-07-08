<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CategoryItem } from '@/types/home'

// 定义Props
interface Props {
  list: CategoryItem[]
  loading?: boolean
}

// 快捷入口数据类型
interface ShortcutItem {
  id: string | number
  icon: string
  name: string
  picture?: string
  action?: string
}

// 接收Props
const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

// 默认快捷入口数据（作为兜底数据）
const defaultShortcuts: ShortcutItem[] = [
  { id: 1, icon: '🛍️', name: '超市购物' },
  { id: 2, icon: '🍎', name: '生鲜果蔬' },
  { id: 3, icon: '👔', name: '服装搭配' },
  { id: 4, icon: '📱', name: '数码家电' },
  { id: 5, icon: '🏠', name: '家居用品' },
  { id: 6, icon: '💄', name: '美妆护肤' },
  { id: 7, icon: '📚', name: '图书文具' },
  { id: 8, icon: '🎮', name: '运动户外' },
]

// 根据分类名称获取对应图标
const getIconByName = (name: string): string => {
  const iconMap: Record<string, string> = {
    超市: '🛍️',
    生鲜: '🍎',
    服装: '👔',
    数码: '📱',
    家居: '🏠',
    美妆: '💄',
    图书: '📚',
    运动: '🎮',
    食品: '🍕',
    母婴: '🍼',
    汽车: '🚗',
    医药: '💊',
  }

  // 查找包含关键词的分类
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (name.includes(keyword)) {
      return icon
    }
  }

  return '🛍️' // 默认图标
}

// 显示用的快捷入口数据
const shortcuts = computed<ShortcutItem[]>(() => {
  if (props.list.length === 0) {
    return defaultShortcuts
  }

  // 转换API数据为快捷入口格式（显示全部分类）
  const apiShortcuts = props.list.map((item: CategoryItem, index: number) => ({
    id: item.id,
    icon: getIconByName(item.name) || '🛍️',
    name: item.name,
    picture: item.icon, // API返回的icon字段作为图片
  }))

  return apiShortcuts
})

// 快捷入口点击处理
const onShortcutClick = (item: ShortcutItem, index: number) => {
  console.log('点击分类:', item, index)

  if (item.action === 'test') {
    // 特殊处理测试功能
    uni
      .navigateTo({
        url: '/pages/test/test',
      })
      .catch(() => {
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none',
        })
      })
  } else {
    // 跳转到分类页面
    uni
      .switchTab({
        url: '/pages/category/category',
      })
      .catch(() => {
        uni.showToast({
          title: `${item.name} 功能开发中...`,
          icon: 'none',
        })
      })
  }
}
</script>

<template>
  <view class="category-panel">
    <!-- 分类标题 -->
    <view class="category-title">
      <text class="title-text">商品分类</text>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="category-loading">
      <view class="loading-grid">
        <view class="loading-item" v-for="n in 10" :key="n">
          <view class="loading-icon"></view>
          <view class="loading-text"></view>
        </view>
      </view>
    </view>

    <!-- 分类网格 -->
    <view v-else class="category-grid">
      <view
        class="category-item"
        v-for="(item, index) in shortcuts"
        :key="item.id"
        @click="onShortcutClick(item, index)"
      >
        <!-- 图标或图片 -->
        <view class="category-icon-wrapper">
          <image
            v-if="item.picture"
            :src="item.picture"
            class="category-image"
            mode="aspectFill"
            @error="() => {}"
          />
          <view v-else class="category-icon">{{ item.icon }}</view>
        </view>

        <!-- 分类名称 -->
        <text class="category-name">{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.category-panel {
  margin: 0 0 30rpx;
  background: #fff;
  border-radius: 0;
  padding: 30rpx;
  box-shadow: none;

  .category-title {
    margin-bottom: 30rpx;

    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .category-loading {
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20rpx;

      .loading-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8rpx;

        .loading-icon {
          width: 70rpx;
          height: 70rpx;
          border-radius: 14rpx;
          background: #f0f0f0;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .loading-text {
          width: 50rpx;
          height: 18rpx;
          border-radius: 9rpx;
          background: #f0f0f0;
          animation: pulse 1.5s ease-in-out infinite;
        }
      }
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20rpx;

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15rpx 10rpx;
      border-radius: 14rpx;
      background: #f8f9fa;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
        background: #e9ecef;
      }

      .category-icon-wrapper {
        width: 70rpx;
        height: 70rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8rpx;
        border-radius: 14rpx;
        overflow: hidden;

        .category-image {
          width: 100%;
          height: 100%;
          border-radius: 14rpx;
        }

        .category-icon {
          font-size: 40rpx;
          line-height: 1;
        }
      }

      .category-name {
        font-size: 22rpx;
        color: #666;
        text-align: center;
        line-height: 1.2;
      }
    }
  }
}
</style>
