<script setup lang="ts">
import { ref } from 'vue'
import { getPhoneNumber, postLoginDemo } from '@/services/login'
import { useMemberStore } from '@/stores'

// 用户模块 Store
const memberStore = useMemberStore()

// 表单数据
const form = ref({
  account: '',
  password: ''
})

// 登录方法
const onLogin = () => {
  // TODO: 实现登录逻辑
}

// 手机号快速登录
const onGetPhoneNumber = async (event: any) => {
  try {
    // 获取用户手机号并登录
    const res = await getPhoneNumber(event)
    // 存储用户信息
    memberStore.setProfile(res.result)
    // 成功提示
    uni.showToast({ title: '登录成功' })
    // 跳转到我的页面
    uni.switchTab({ url: '/pages/my/my' })
  } catch (err) {
    uni.showToast({ title: '登录失败', icon: 'error' })
  }
}

// 模拟登录
const onDemoLogin = async () => {
  try {
    // 模拟手机号登录
    const res = await postLoginDemo('13123456789')
    // 存储用户信息
    memberStore.setProfile(res.result)
    // 成功提示
    uni.showToast({ title: '登录成功' })
    setTimeout(() => {
      // 跳转到我的页面
      uni.switchTab({ url: '/pages/my/my' })
    }, 1000)
  } catch (err) {
    uni.showToast({ title: '登录失败', icon: 'error' })
  }
}
</script>

<template>
  <view class="viewport">
    <!-- 主体 -->
    <view class="login">
      <!-- logo -->
      <view class="logo">
        <image src="/static/images/logo_icon.png" mode="aspectFit"></image>
      </view>
      <!-- 表单 -->
      <view class="form">
        <view class="input">
          <text class="label">账号</text>
          <input type="text" placeholder="请输入用户名/手机号码" v-model="form.account" />
        </view>
        <view class="input">
          <text class="label">密码</text>
          <input type="safe-password"  placeholder="请输入密码" v-model="form.password" />
        </view>
        <button class="button" @tap="onLogin">登录</button>
      </view>
      <!-- 其他登录方式 -->
      <view class="other">
        <view class="caption">
          <text class="line"></text>
          <text class="text">其他登录方式</text>
          <text class="line"></text>
        </view>
        <view class="options">
          <button class="phone" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
            手机号快速登录
          </button>
          <button class="demo" @tap="onDemoLogin">模拟登录</button>
        </view>
      </view>
      <!-- 用户协议 -->
      <view class="agreement">
        登录/注册即视为同意
        <navigator url="" class="link">《用户协议》</navigator>
        和
        <navigator url="" class="link">《隐私政策》</navigator>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

// 导航栏
.navbar {
  position: relative;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
  .back {
    position: absolute;
    left: 0;
    padding: 0 20rpx;
  }
  .title {
    font-size: 32rpx;
    font-weight: bold;
  }
}

.login {
  padding: 40rpx 60rpx;
  // logo
  .logo {
    display: flex;
    justify-content: center;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
    image {
      width: 200rpx;
      height: 200rpx;
    }
  }
  // 表单
  .form {
    .input {
      position: relative;
      margin-bottom: 40rpx;
      .label {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
        display: block;
      }
      input {
        width: 100%;
        height: 80rpx;
        padding: 0 20rpx;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 28rpx;
      }
      .password-eye {
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
        font-size: 40rpx;
      }
    }
    .button {
      width: 100%;
      height: 80rpx;
      background-color: #27ba9b;
      color: #fff;
      border-radius: 40rpx;
      margin-top: 60rpx;
      font-size: 28rpx;
    }
  }
  // 其他登录
  .other {
    margin-top: 60rpx;
    .caption {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40rpx;
      .line {
        width: 100rpx;
        height: 1px;
        background-color: #ddd;
      }
      .text {
        color: #999;
        padding: 0 20rpx;
        font-size: 26rpx;
      }
    }
    .options {
      display: flex;
      justify-content: space-around;
      margin-top: 30rpx;
      button {
        width: 45%;
        height: 80rpx;
        border: 1px solid #ccc;
        border-radius: 40rpx;
        font-size: 26rpx;
        color: #444;
        background-color: #fff;
      }
      .phone {
        color: #27ba9b;
        border-color: #27ba9b;
      }
    }
  }
  // 用户协议
  .agreement {
    position: fixed;
    bottom: 40rpx;
    left: 20rpx;
    right: 20rpx;
    text-align: center;
    font-size: 24rpx;
    color: #999;
    .link {
      color: #27ba9b;
      display: inline;
    }
  }
}
</style>
