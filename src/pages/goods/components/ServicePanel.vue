<script setup lang="ts">
</script>

<template>
  <view class="popup-root">
    <view class="popup-header">
      <text class="title">服务说明</text>
    </view>
    <view class="popup-content">
      <view class="service-list">
        <view class="service-item">
          <view class="item-title">
            <text class="title-icon icon-check"></text>
            <text class="title-text">无忧退货</text>
          </view>
          <view class="item-content">
            自收到商品之日起30天内，可在线申请无忧退货服务（食品等特殊商品除外）
          </view>
        </view>
        <view class="service-item">
          <view class="item-title">
            <text class="title-icon icon-check"></text>
            <text class="title-text">快速退款</text>
          </view>
          <view class="item-content">
            收到退货包裹并确认无误后，将在48小时内办理退款，
            退款将原路返回，不同银行处理时间不同，预计1-5个工作日到账
          </view>
        </view>
        <view class="service-item">
          <view class="item-title">
            <text class="title-icon icon-check"></text>
            <text class="title-text">免费包邮</text>
          </view>
          <view class="item-content">
            单笔订单金额（不含运费）满88元免邮费，不满88元收取10元邮费
          </view>
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

.service-list {
  padding: 0 20rpx;
  .service-item {
    margin-bottom: 20rpx;
    .item-title {
      display: flex;
      align-items: center;
      line-height: 1;
      margin-bottom: 10rpx;
      .title-icon {
        font-size: 24rpx;
        color: #27ba9b;
        margin-right: 10rpx;
      }
      .title-text {
        font-size: 26rpx;
        color: #333;
      }
    }
    .item-content {
      font-size: 24rpx;
      color: #666;
      line-height: 1.5;
    }
  }
}
</style> 