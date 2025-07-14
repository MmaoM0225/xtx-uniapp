<script setup lang="ts">
import { ref } from 'vue'
import { getMemberAddressAPI } from '@/services/address'
import type { AddressItem } from '@/types/address'

// 地址列表
const addressList = ref<AddressItem[]>([])

// 获取地址列表
const getMemberAddress = async () => {
  const res = await getMemberAddressAPI()
  addressList.value = res.result
}

// 初始化时获取地址列表
getMemberAddress()
</script>

<template>
  <view class="popup-root">
    <view class="popup-header">
      <text class="title">配送地址</text>
      <navigator class="extra" hover-class="none" url="/pagesMember/address/address">
        管理地址
      </navigator>
    </view>
    <view class="popup-content">
      <view class="address-list">
        <!-- 收货地址项 -->
        <view v-if="addressList.length" class="address-list">
          <view
            class="address-item"
            v-for="item in addressList"
            :key="item.id"
            @tap="$emit('select', item)"
          >
            <view class="user">
              {{ item.receiver }}
              <text class="contact">{{ item.contact }}</text>
              <text v-if="item.isDefault === 1" class="badge">默认</text>
            </view>
            <view class="locate">{{ item.fullLocation }} {{ item.address }}</view>
          </view>
        </view>
        <!-- 空状态 -->
        <view v-else class="address-empty">
          <text class="icon-location"></text>
          <text class="text">您还没有收货地址，快去添加吧~</text>
          <navigator class="button" hover-class="none" url="/pagesMember/address/address">
            添加地址
          </navigator>
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
  .extra {
    font-size: 26rpx;
    color: #666;
  }
}

.address-list {
  padding: 0 20rpx;
  
  .address-item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #ddd;
    &:last-child {
      border: none;
    }
    
    .user {
      font-size: 28rpx;
      margin-bottom: 20rpx;
      color: #333;

      .contact {
        color: #666;
      }

      .badge {
        display: inline-block;
        padding: 4rpx 10rpx 2rpx 14rpx;
        margin: 2rpx 0 0 10rpx;
        font-size: 26rpx;
        color: #27ba9b;
        border-radius: 6rpx;
        border: 1rpx solid #27ba9b;
      }
    }

    .locate {
      line-height: 1.6;
      font-size: 26rpx;
      color: #333;
    }
  }

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