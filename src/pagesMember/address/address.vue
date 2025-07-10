<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMemberAddressAPI, deleteMemberAddressByIdAPI } from '@/services/address'
import type { AddressItem } from '@/types/address'

// 地址列表
const addressList = ref<AddressItem[]>([])

// 获取地址列表
const getMemberAddress = async () => {
  const res = await getMemberAddressAPI()
  addressList.value = res.result
}

// 删除收货地址
const onDeleteAddress = async (id: string) => {
  try {
    const res = await uni.showModal({
      content: '确认删除收货地址？',
      confirmColor: '#27BA9B',
    })
    if (res.confirm) {
      await deleteMemberAddressByIdAPI(id)
      await getMemberAddress()
      uni.showToast({ icon: 'success', title: '删除成功' })
    }
  } catch (err) {
    uni.showToast({ icon: 'error', title: '删除失败' })
  }
}

// 页面显示时获取地址列表
onShow(() => {
  getMemberAddress()
})
</script>

<template>
  <view class="viewport">
    <!-- 地址列表 -->
    <scroll-view class="scroll-view" scroll-y>
      <view v-if="addressList.length" class="address">
        <view class="address-list">
          <!-- 收货地址项 -->
          <view class="item" v-for="item in addressList" :key="item.id">
            <view class="item-content">
              <view class="user">
                {{ item.receiver }}
                <text class="contact">{{ item.contact }}</text>
                <text v-if="item.isDefault === 1" class="badge">默认</text>
              </view>
              <view class="locate">{{ item.fullLocation + item.address }}</view>
              <navigator
                class="edit"
                hover-class="none"
                :url="`/pagesMember/addressForm/addressForm?id=${item.id}`"
              >
                修改
              </navigator>
              <button class="delete-button" @tap="onDeleteAddress(item.id)">删除</button>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="blank">暂无收货地址</view>
    </scroll-view>
    <!-- 添加按钮 -->
    <view class="add-btn">
      <navigator hover-class="none" url="/pagesMember/addressForm/addressForm">
        新建地址
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;

  .scroll-view {
    padding-top: 20rpx;
  }
}

.address {
  padding: 0 20rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item-content {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    padding: 40rpx 10rpx 38rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;

    .edit {
      position: absolute;
      top: 36rpx;
      right: 130rpx;
      padding: 2rpx 0 2rpx 20rpx;
      border-left: 1rpx solid #666;
      font-size: 26rpx;
      color: #666;
      line-height: 1;
    }

    .delete-button {
      position: absolute;
      top: 32rpx;
      right: 30rpx;
      padding: 2rpx 20rpx;
      font-size: 26rpx;
      color: #666;
      line-height: 1;
      background: none;
      border: none;

      &::after {
        border: none;
      }
    }
  }

  .item:last-child .item-content {
    border: none;
  }

  .user {
    width: 100%;
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
    flex: 1;
    line-height: 1.6;
    font-size: 26rpx;
    color: #333;
    margin-right: 100rpx;
  }
}

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}

.add-btn {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;

  // 点击反馈
  &:active {
    background-color: #219a7f;
  }
}
</style>