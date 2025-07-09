<script setup lang="ts">
</script>

<template>
  <view class="popup-root">
    <view class="popup-header">
      <text class="title">配送地址</text>
    </view>
    <view class="popup-content">
      <view class="address-list">
        <view class="address-empty">
          <text class="icon-location"></text>
          <text class="text">您还没有收货地址，快去添加吧~</text>
          <navigator class="button" hover-class="none" url="/pages/address/address">添加地址</navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.popup-root {
  padding: 30rpx;
  border-radius: 20rpx 20rpx 0 0;
  background-color: #fff;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
  padding: 0 0 30rpx;
  .title {
    font-size: 32rpx;
    font-weight: normal;
    color: #333;
  }
}

.address-list {
  padding: 0 20rpx;
  .address-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 0;
    .icon-location {
      font-size: 96rpx;
      color: #ddd;
      margin-bottom: 20rpx;
    }
    .text {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 30rpx;
    }
    .button {
      width: 240rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      font-size: 26rpx;
      color: #fff;
      border-radius: 60rpx;
      background-color: #27ba9b;
    }
  }
}
</style> 