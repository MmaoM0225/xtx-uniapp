<script setup lang="ts">
import { ref } from 'vue'
import UserNav from './components/UserNav.vue'
import XtxGuess from '@/components/XtxGuess.vue'
import { useGuessList } from '@/composables'

// 猜你喜欢组件实例
const guessRef = ref<any>(null)
// 使用组合式函数
const { onScrollToLower } = useGuessList(guessRef)

// 下拉刷新状态
const refresherTriggered = ref(false)

// 下拉刷新处理
const onRefresh = async () => {
  console.log('开始下拉刷新...')
  refresherTriggered.value = true
  
  try {
    // 重置猜你喜欢组件的数据
    if (guessRef.value) {
      guessRef.value.resetAndRefresh()
    }
    
    console.log('刷新完成')
  } catch (error) {
    console.error('刷新失败:', error)
  } finally {
    // 延迟关闭刷新状态，确保用户能看到刷新动画
    setTimeout(() => {
      refresherTriggered.value = false
    }, 500)
  }
}
</script>

<template>
  <view class="viewport">
    <!-- 用户信息导航 -->
    <UserNav />
    <!-- 猜你喜欢 -->
    <scroll-view
      class="page-scroll-view"
      :scroll-y="true"
      :enhanced="true"
      :show-scrollbar="false"
      :refresher-enabled="true"
      :refresher-threshold="80"
      :refresher-default-style="'black'"
      :refresher-background="'#f7f7f8'"
      :refresher-triggered="refresherTriggered"
      @scrolltolower="onScrollToLower"
      @refresherrefresh="onRefresh"
    >
      <view class="page-content">
        <view class="guess">
          <XtxGuess ref="guessRef" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f8;
  height: 100%;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-scroll-view {
  flex: 1;
  height: 0;
  margin-top: -120rpx;
  position: relative;
  z-index: 1;

  // 隐藏滚动条
  ::-webkit-scrollbar {
    display: none;
  }

  // 兼容 iOS
  &::-webkit-scrollbar {
    display: none;
  }

  // 火狐浏览器
  scrollbar-width: none;

  // IE 10+
  -ms-overflow-style: none;
}

.page-content {
  min-height: 100%;
  padding: 20rpx;
}

.guess {
  margin: 230rpx 0 20rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  background-color: #fff;
}
</style>
