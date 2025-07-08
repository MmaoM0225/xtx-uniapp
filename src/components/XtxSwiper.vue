<script setup lang="ts">
import { ref, computed } from 'vue'

// 轮播图数据类型
interface SwiperItem {
  id: string | number
  imgUrl: string
  title?: string
  desc?: string
  link?: string
  [key: string]: any
}

// 组件属性
interface Props {
  list: SwiperItem[]
  autoplay?: boolean
  interval?: number
  circular?: boolean
  indicatorDots?: boolean
  indicatorColor?: string
  indicatorActiveColor?: string
  height?: string
  borderRadius?: string
  showTitle?: boolean
  showDesc?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  autoplay: true,
  interval: 5000,
  circular: true,
  indicatorDots: true,
  indicatorColor: 'rgba(255, 255, 255, 0.3)',
  indicatorActiveColor: '#fff',
  height: '300rpx',
  borderRadius: '0rpx',
  showTitle: false,
  showDesc: false,
})

// 事件定义
const emit = defineEmits<{
  click: [item: SwiperItem, index: number]
  change: [current: number]
}>()

// 当前轮播项索引
const currentIndex = ref(0)

// 计算属性
const swiperStyle = computed(() => ({
  height: props.height,
  borderRadius: props.borderRadius,
}))

// 轮播图变化事件
const onSwiperChange = (e: any) => {
  currentIndex.value = e.detail.current
  emit('change', e.detail.current)
}

// 点击轮播项
const onItemClick = (item: SwiperItem, index: number) => {
  emit('click', item, index)
}

// 格式化图片URL
const formatImageUrl = (url: string) => {
  if (!url) return ''
  // 如果是相对路径，不做处理
  if (url.startsWith('/') || url.startsWith('./')) {
    return url
  }
  // 如果是完整的HTTP URL，直接返回
  if (url.startsWith('http')) {
    return url
  }
  // 其他情况返回原始URL
  return url
}
</script>

<template>
  <view class="xtx-swiper" :style="swiperStyle">
    <swiper
      class="swiper-container"
      :autoplay="autoplay"
      :interval="interval"
      :circular="circular"
      :indicator-dots="indicatorDots"
      :indicator-color="indicatorColor"
      :indicator-active-color="indicatorActiveColor"
      @change="onSwiperChange"
    >
      <swiper-item
        v-for="(item, index) in list"
        :key="item.id || index"
        class="swiper-item"
        @click="onItemClick(item, index)"
      >
        <!-- 图片 -->
        <image
          class="swiper-image"
          :src="formatImageUrl(item.imgUrl)"
          mode="aspectFill"
          :lazy-load="true"
        />

        <!-- 内容遮罩层 -->
        <view v-if="showTitle || showDesc" class="swiper-content">
          <!-- 标题 -->
          <text v-if="showTitle && item.title" class="swiper-title">
            {{ item.title }}
          </text>

          <!-- 描述 -->
          <text v-if="showDesc && item.desc" class="swiper-desc">
            {{ item.desc }}
          </text>
        </view>
      </swiper-item>
    </swiper>

    <!-- 自定义指示器（可选） -->
    <view v-if="!indicatorDots && list.length > 1" class="custom-indicators">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="indicator-dot"
        :class="{ active: index === currentIndex }"
      />
    </view>
  </view>
</template>

<style lang="scss">
.xtx-swiper {
  position: relative;
  width: 100%;
  overflow: hidden;

  .swiper-container {
    width: 100%;
    height: 100%;

    .swiper-item {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      .swiper-image {
        width: 100%;
        height: 100%;
        display: block;
        transition: transform 0.3s ease;

        &:active {
          transform: scale(0.98);
        }
      }

      .swiper-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
        padding: 40rpx 30rpx 30rpx;
        color: #fff;

        .swiper-title {
          display: block;
          font-size: 32rpx;
          font-weight: 600;
          margin-bottom: 10rpx;
          text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
          line-height: 1.4;
        }

        .swiper-desc {
          display: block;
          font-size: 24rpx;
          opacity: 0.9;
          line-height: 1.5;
          text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.5);
        }
      }
    }
  }

  // 自定义指示器样式
  .custom-indicators {
    position: absolute;
    bottom: 20rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12rpx;

    .indicator-dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transition: all 0.3s ease;

      &.active {
        background: #fff;
        transform: scale(1.2);
      }
    }
  }
}

// 不同尺寸的轮播图样式
.xtx-swiper {
  // 小尺寸轮播图
  &.size-small {
    .swiper-container .swiper-item .swiper-content {
      padding: 20rpx 20rpx 15rpx;

      .swiper-title {
        font-size: 28rpx;
        margin-bottom: 8rpx;
      }

      .swiper-desc {
        font-size: 22rpx;
      }
    }
  }

  // 大尺寸轮播图
  &.size-large {
    .swiper-container .swiper-item .swiper-content {
      padding: 60rpx 40rpx 40rpx;

      .swiper-title {
        font-size: 40rpx;
        margin-bottom: 15rpx;
      }

      .swiper-desc {
        font-size: 28rpx;
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 750rpx) {
  .xtx-swiper {
    .swiper-container .swiper-item .swiper-content {
      padding: 30rpx 20rpx 20rpx;

      .swiper-title {
        font-size: 28rpx;
      }

      .swiper-desc {
        font-size: 22rpx;
      }
    }

    .custom-indicators {
      bottom: 15rpx;

      .indicator-dot {
        width: 10rpx;
        height: 10rpx;
      }
    }
  }
}

// 加载状态
.xtx-swiper {
  &.loading {
    .swiper-container {
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        content: '加载中...';
        color: #999;
        font-size: 24rpx;
      }
    }
  }
}
</style>
