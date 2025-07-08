<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义props
interface Props {
  title?: string
  showSearch?: boolean
  showMessage?: boolean
  showLogo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showSearch: true,
  showMessage: true,
  showLogo: true,
})

// 定义事件
const emit = defineEmits<{
  search: [keyword: string]
  message: []
  logo: []
}>()

// 搜索关键词
const searchKeyword = ref('')

// 安全区域高度
const safeAreaTop = ref(0)

// 获取系统信息
const getSystemInfo = () => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    console.log('系统信息:', systemInfo)

    // 默认状态栏高度
    let statusBarHeight = systemInfo.statusBarHeight || 0

    // 针对不同平台的兼容处理
    // #ifdef MP-WEIXIN
    // 微信小程序：直接使用statusBarHeight
    statusBarHeight = systemInfo.statusBarHeight || 0
    // #endif

    // #ifdef H5
    // H5端：通常不需要状态栏高度，除非是在移动端浏览器
    statusBarHeight = 0
    // #endif

    // #ifdef APP-PLUS
    // App端：使用statusBarHeight
    statusBarHeight = systemInfo.statusBarHeight || 0
    // #endif

    // #ifdef MP-ALIPAY
    // 支付宝小程序
    statusBarHeight = systemInfo.statusBarHeight || 0
    // #endif

    // #ifdef MP-BAIDU
    // 百度小程序
    statusBarHeight = systemInfo.statusBarHeight || 0
    // #endif

    // #ifdef MP-TOUTIAO
    // 字节跳动小程序
    statusBarHeight = systemInfo.statusBarHeight || 0
    // #endif

    // 设置安全区域高度
    safeAreaTop.value = statusBarHeight

    console.log('平台:', systemInfo.platform)
    console.log('状态栏高度:', statusBarHeight)
    console.log('屏幕宽度:', systemInfo.screenWidth)
    console.log('屏幕高度:', systemInfo.screenHeight)
  } catch (error) {
    console.error('获取系统信息失败:', error)
    safeAreaTop.value = 0
  }
}

// 组件挂载时获取系统信息
onMounted(() => {
  getSystemInfo()
})

// 搜索功能
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    emit('search', searchKeyword.value.trim())
  }
}

// 消息功能
const handleMessage = () => {
  emit('message')
  uni.showToast({
    title: '消息中心',
    icon: 'none',
  })
}

// logo点击
const handleLogo = () => {
  emit('logo')
  uni.showToast({
    title: '小兔鲜儿',
    icon: 'none',
  })
}
</script>

<template>
  <view class="custom-navbar">
    <!-- 状态栏占位 -->
    <view class="navbar-placeholder" :style="{ height: safeAreaTop + 'px' }"></view>

    <!-- 导航栏内容 -->
    <view class="navbar-content">
      <!-- 第一行：Logo和品牌描述 -->
      <view class="navbar-top">
        <view v-if="showLogo" class="logo-container" @click="handleLogo">
          <image class="logo-image" src="/static/images/logo.png" mode="aspectFit"></image>
          <view class="brand-divider">|</view>
          <text class="brand-description">新鲜·快捷·亲民</text>
        </view>
      </view>

      <!-- 第二行：搜索框和消息 -->
      <view class="navbar-bottom">
        <!-- 搜索框或标题 -->
        <view class="search-container">
          <!-- 搜索框 -->
          <view v-if="showSearch" class="search-box">
            <view class="search-icon">🔍</view>
            <input
              v-model="searchKeyword"
              class="search-input"
              type="text"
              placeholder="搜索商品"
              confirm-type="search"
              @confirm="handleSearch"
            />
            <view class="search-btn" @click="handleSearch">搜索</view>
          </view>

          <!-- 标题 -->
          <text v-else class="navbar-title">{{ title }}</text>
        </view>

        <!-- 消息通知 -->
        <view v-if="showMessage" class="message-container" @click="handleMessage">
          <view class="message-wrapper">
            <view class="message-icon">🔔</view>
            <view class="message-badge">3</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.custom-navbar {
  background: linear-gradient(135deg, #27ba9b 0%, #1ea67a 100%);
  position: relative;
  box-shadow: 0 2rpx 10rpx rgba(39, 186, 155, 0.3);

  .navbar-placeholder {
    // 高度通过JS动态设置
    background: transparent;
  }

  .navbar-content {
    display: flex;
    flex-direction: column;
    padding: 20rpx 30rpx;

    .navbar-top {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 20rpx;

      .logo-container {
        display: flex;
        align-items: center;

        .logo-image {
          width: 160rpx;
          height: 64rpx;
        }

        .brand-divider {
          color: rgba(255, 255, 255, 0.6);
          font-size: 28rpx;
          margin: 0 20rpx;
          font-weight: 300;
        }

        .brand-description {
          color: rgba(255, 255, 255, 0.8);
          font-size: 24rpx;
          font-weight: 400;
          letter-spacing: 2rpx;
          text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
        }
      }
    }

    .navbar-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .search-container {
        flex: 1;
        margin-right: 30rpx;

        .search-box {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50rpx;
          height: 64rpx;
          display: flex;
          align-items: center;
          padding: 0 30rpx;
          box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
          border: 1rpx solid rgba(255, 255, 255, 0.8);

          .search-icon {
            font-size: 28rpx;
            margin-right: 20rpx;
            color: #999;
          }

          .search-input {
            flex: 1;
            font-size: 28rpx;
            color: #333;

            &::placeholder {
              color: #999;
            }
          }

          .search-btn {
            background: linear-gradient(135deg, #27ba9b, #1ea67a);
            color: #fff;
            font-size: 24rpx;
            padding: 8rpx 16rpx;
            border-radius: 20rpx;
            margin-left: 20rpx;
            font-weight: 500;
          }
        }

        .navbar-title {
          font-size: 32rpx;
          font-weight: 600;
          color: #fff;
          text-align: center;
          text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
        }
      }

      .message-container {
        .message-wrapper {
          position: relative;
          padding: 10rpx;

          .message-icon {
            font-size: 32rpx;
            color: #fff;
            text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
          }

          .message-badge {
            position: absolute;
            top: 0;
            right: 0;
            background: linear-gradient(135deg, #ff4757, #ff3838);
            color: #fff;
            font-size: 18rpx;
            width: 32rpx;
            height: 32rpx;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            border: 2rpx solid #fff;
            font-weight: 600;
            box-shadow: 0 2rpx 8rpx rgba(255, 71, 87, 0.4);
          }
        }
      }
    }
  }
}

// 暗黑模式适配
@media (prefers-color-scheme: dark) {
  .custom-navbar {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.5);

    .navbar-content {
      .navbar-top {
        .logo-container {
          .brand-divider {
            color: rgba(255, 255, 255, 0.5);
          }

          .brand-description {
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }

      .navbar-bottom {
        .search-container {
          .search-box {
            background: rgba(255, 255, 255, 0.1);
            border: 1rpx solid rgba(255, 255, 255, 0.2);

            .search-input {
              color: #fff;

              &::placeholder {
                color: rgba(255, 255, 255, 0.6);
              }
            }

            .search-icon {
              color: rgba(255, 255, 255, 0.8);
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 750rpx) {
  .custom-navbar {
    .navbar-content {
      padding: 15rpx 20rpx;

      .navbar-top {
        margin-bottom: 15rpx;

        .logo-container {
          .logo-image {
            width: 120rpx;
            height: 48rpx;
          }

          .brand-divider {
            font-size: 24rpx;
            margin: 0 15rpx;
          }

          .brand-description {
            font-size: 20rpx;
            letter-spacing: 1rpx;
          }
        }
      }

      .navbar-bottom {
        .search-container {
          margin-right: 20rpx;

          .search-box {
            height: 60rpx;
            padding: 0 24rpx;

            .search-input {
              font-size: 26rpx;
            }

            .search-btn {
              font-size: 22rpx;
              padding: 6rpx 12rpx;
            }
          }
        }
      }
    }
  }
}
</style>
