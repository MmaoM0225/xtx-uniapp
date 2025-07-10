import type { Ref } from 'vue'

// 猜你喜欢组件实例类型
type GuessInstance = {
  loadMoreData: () => void
}

/**
 * 滚动触底加载更多
 * @param guessRef 猜你喜欢组件实例
 */
export const useGuessList = (guessRef: Ref<GuessInstance | null>) => {
  // 滚动触底处理
  const onScrollToLower = () => {
    console.log('滚动到底部，开始加载更多数据')
    if (guessRef.value) {
      guessRef.value.loadMoreData()
    }
  }

  // 返回方法
  return {
    onScrollToLower,
  }
}
