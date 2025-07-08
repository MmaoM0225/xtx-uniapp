<script setup lang="ts">
import { computed } from 'vue'
import type { HotItem } from '@/types/home'

// 定义Props
interface Props {
  list: HotItem[]
  loading?: boolean
}

// 接收Props
const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

// 热门商品点击处理
const onHotClick = (item: HotItem, index: number) => {
  console.log('点击热门商品:', item, index)

  if (item.target) {
    // 如果是外部链接，可以在这里处理
    if (item.target.startsWith('http')) {
      uni.showModal({
        title: '提示',
        content: '即将跳转到外部链接',
        success: (res) => {
          if (res.confirm) {
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
          url: item.target,
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
      title: '该商品暂无跳转链接',
      icon: 'none',
    })
  }
}

// 处理图片加载错误
const handleImageError = (e: any) => {
  console.log('图片加载失败:', e)
  // 可以设置默认图片或其他处理逻辑
}
</script>

<template>
  <view class="hot-panel">
    <!-- 热门商品标题 -->
    <view class="hot-title">
      <text class="title-text">热门推荐</text>
      <text class="more-text">更多 ></text>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="hot-loading">
      <view class="loading-grid">
        <view class="loading-item" v-for="n in 4" :key="n">
          <view class="loading-image">
            <!-- 模拟主图 -->
            <view class="loading-main-image"></view>
            <!-- 模拟副图 -->
            <view class="loading-second-image"></view>
          </view>
          <view class="loading-title"></view>
          <view class="loading-desc"></view>
        </view>
      </view>
    </view>

    <!-- 热门商品网格 -->
    <view v-else-if="list.length > 0" class="hot-grid">
      <view
        class="hot-item"
        v-for="(item, index) in list"
        :key="item.id"
        @click="onHotClick(item, index)"
      >
        <!-- 商品图片展示 -->
        <view class="hot-image-wrapper">
          <!-- 有图片时的展示 -->
          <view v-if="item.pictures && item.pictures.length > 0" class="image-container">
            <!-- 主图片 -->
            <view class="main-image-wrapper">
              <image
                :src="item.pictures[0]"
                class="main-image"
                mode="aspectFill"
                :alt="`${item.alt}-主图`"
                loading="lazy"
                @error="handleImageError"
              />
            </view>

            <!-- 第二张图片 -->
            <view v-if="item.pictures.length > 1" class="second-image-wrapper">
              <image
                :src="item.pictures[1]"
                class="second-image"
                mode="aspectFill"
                :alt="`${item.alt}-副图`"
                loading="lazy"
                @error="handleImageError"
              />
              <!-- 更多图片提示 -->
              <view v-if="item.pictures.length > 2" class="more-images-overlay">
                <text class="more-text">+{{ item.pictures.length - 2 }}</text>
              </view>
            </view>
          </view>

          <!-- 兜底图片 -->
          <image
            v-else
            src="/static/images/blank.png"
            class="hot-image"
            mode="aspectFill"
            :alt="item.alt"
          />
        </view>

        <!-- 商品信息 -->
        <view class="hot-info">
          <text class="hot-title-text">{{ item.title }}</text>
          <text class="hot-alt-text">{{ item.alt }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="hot-empty">
      <view class="empty-content">
        <text class="empty-text">暂无热门推荐</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.hot-panel {
  margin: 0 0 30rpx;
  background: #fff;
  border-radius: 0;
  padding: 30rpx;
  box-shadow: none;

  .hot-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;

    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .more-text {
      font-size: 24rpx;
      color: #27ba9b;
    }
  }

  .hot-loading {
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;

      .loading-item {
        display: flex;
        flex-direction: column;
        gap: 12rpx;

        .loading-image {
          position: relative;
          width: 100%;
          height: 180rpx;
          border-radius: 12rpx;
          background: #f8f9fa;
          display: flex;
          flex-direction: row;
          gap: 4rpx;
          padding: 4rpx;

          .loading-main-image {
            width: 60%;
            height: 100%;
            border-radius: 8rpx;
            background: #f0f0f0;
            animation: pulse 1.5s ease-in-out infinite;
          }

          .loading-second-image {
            width: 40%;
            height: 100%;
            border-radius: 8rpx;
            background: #f0f0f0;
            animation: pulse 1.5s ease-in-out infinite 0.2s;
          }
        }

        .loading-title {
          width: 80%;
          height: 24rpx;
          border-radius: 12rpx;
          background: #f0f0f0;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .loading-desc {
          width: 60%;
          height: 20rpx;
          border-radius: 10rpx;
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

  .hot-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;

    .hot-item {
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

      .hot-image-wrapper {
        position: relative;
        width: 100%;
        height: 180rpx;
        overflow: hidden;

        .image-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          gap: 4rpx;

          .main-image-wrapper {
            width: 60%;
            height: 100%;

            .main-image {
              width: 100%;
              height: 100%;
              background: #eee;
              border-radius: 8rpx 0 0 8rpx;
            }
          }

          .second-image-wrapper {
            position: relative;
            width: 40%;
            height: 100%;

            .second-image {
              width: 100%;
              height: 100%;
              background: #eee;
              border-radius: 0 8rpx 8rpx 0;
            }

            .more-images-overlay {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              background: rgba(0, 0, 0, 0.6);
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 0 8rpx 8rpx 0;

              .more-text {
                font-size: 20rpx;
                color: #fff;
                font-weight: 600;
              }
            }
          }
        }

        .hot-image {
          width: 100%;
          height: 100%;
          background: #eee;
        }
      }

      .hot-info {
        padding: 20rpx;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .hot-title-text {
          font-size: 26rpx;
          font-weight: 600;
          color: #333;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hot-alt-text {
          font-size: 22rpx;
          color: #666;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }

  .hot-empty {
    padding: 80rpx 0;

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
</style>
