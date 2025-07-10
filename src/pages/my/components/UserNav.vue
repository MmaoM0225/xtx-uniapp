<script setup lang="ts">
import { useMemberStore } from '@/stores'

// 获取会员信息
const memberStore = useMemberStore()

// 跳转到登录页
const toLogin = () => {
  uni.navigateTo({ url: '/pages/login/login' })
}

// 跳转到设置页
const toSettings = () => {
  uni.navigateTo({ url: '/pagesMember/settings/settings' })
}

// 跳转到个人信息页
const toProfile = () => {
  if (memberStore.profile) {
    uni.navigateTo({ url: '/pagesMember/profile/profile' })
  } else {
    uni.navigateTo({ url: '/pages/login/login' })
  }
}

// 订单类型
const orderTypes = [
  { type: 1, text: '待付款', icon: 'icon-currency' },
  { type: 2, text: '待发货', icon: 'icon-gift' },
  { type: 3, text: '待收货', icon: 'icon-check' },
  { type: 4, text: '待评价', icon: 'icon-comment' },
]
</script>

<template>
  <view class="user-nav">
    <!-- 背景图 -->
    <view class="nav-bg">
      <image src="/static/images/center_bg.png" mode="heightFix" />
    </view>
    <!-- 用户信息 -->
    <view class="nav-content">
      <template v-if="memberStore.profile">
        <!-- 已登录 -->
        <view class="user-info" @tap="toProfile">
          <view class="avatar">
            <image :src="memberStore.profile.avatar" mode="aspectFill" />
          </view>
          <view class="info">
            <view class="nickname">{{ memberStore.profile.nickname || '微信用户' }}</view>
            <view class="mobile">{{ memberStore.profile.mobile }}</view>
          </view>
        </view>
      </template>
      <template v-else>
        <!-- 未登录 -->
        <view class="login" @tap="toLogin">
          <view class="avatar">
            <image src="/static/images/logo_icon.png" mode="aspectFill" />
          </view>
          <view class="info">
            <view class="nickname">未登录</view>
            <view class="mobile">点击登录账号</view>
          </view>
        </view>
      </template>
      <!-- 设置按钮 -->
      <view class="settings" @tap="toSettings">
        <text class="icon-setting">⚙️</text>
      </view>
    </view>
    <!-- 订单服务 -->
    <view class="order-wrapper">
      <view class="orders">
        <!-- 订单标题 -->
        <view class="title">
          <text class="text">我的订单</text>
          <navigator class="navigator" url="/pages/order/order">
            全部订单 <text class="icon">></text>
          </navigator>
        </view>
        <!-- 订单分类 -->
        <view class="order-types">
          <navigator
            class="order-type"
            v-for="item in orderTypes"
            :key="item.type"
            :url="`/pages/order/order?type=${item.type}`"
          >
            <text :class="item.icon"></text>
            <text class="text">{{ item.text }}</text>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.user-nav {
  position: relative;
  height: 480rpx;
  margin: 0;

  .nav-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 480rpx;
    margin: 0;
    z-index: 1;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-content {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 40rpx;
    padding-top: 80rpx;
    z-index: 2;

    .settings {
      position: absolute;
      top: 50%;
      right: 40rpx;
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(-50%);
      
      .icon-setting {
        font-size: 42rpx;
        color: #fff;
      }
    }
  }

  .user-info,
  .login {
    display: flex;
    align-items: center;
    width: 100%;
    height: 200rpx;
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 30rpx;
      border: 4rpx solid #fff;
      image {
        width: 100%;
        height: 100%;
        background-color: #eee;
      }
    }
    .info {
      color: #fff;
      .nickname {
        font-size: 36rpx;
        margin-bottom: 20rpx;
        font-weight: bold;
      }
      .mobile {
        font-size: 26rpx;
      }
    }
  }

  .order-wrapper {
    position: relative;
    margin: -120rpx 20rpx 0;
    padding: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    z-index: 2;

    .orders {
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        .text {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
        }
        .navigator {
          font-size: 24rpx;
          color: #999;
          .icon {
            font-size: 24rpx;
          }
        }
      }

      .order-types {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .order-type {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text {
            &[class^="icon-"] {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 60rpx;
              height: 60rpx;
              margin-bottom: 10rpx;
              font-size: 34rpx;
              border-radius: 50%;
              color: #27ba9b;
              background-color: #e6f5f2;
            }
          }
          .text {
            font-size: 24rpx;
            color: #333;
          }
        }
      }
    }
  }
}
</style> 