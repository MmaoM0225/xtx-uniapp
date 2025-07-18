<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { 
  postMemberAddressAPI, 
  getMemberAddressByIdAPI, 
  putMemberAddressByIdAPI 
} from '@/services/address'
import type { AddressParams } from '@/types/address'

// 获取页面参数
const query = defineProps<{
  id?: string
}>()

// 动态设置标题
const setPageTitle = () => {
  // 有 id 是修改，没有 id 是新建
  const title = query.id ? '修改地址' : '新建地址'
  uni.setNavigationBarTitle({ title })
}

// 表单数据
const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
})

// 获取收货地址详情
const getMemberAddressById = async () => {
  if (!query.id) return
  const res = await getMemberAddressByIdAPI(query.id)
  const data = res.result
  // 渲染表单数据
  Object.assign(form.value, data)
}

// 修改地区
const onRegionChange = (ev: any) => {
  // 省市区文字列表
  const [province, city, county] = ev.detail.value
  // 更新省市区文字
  form.value.fullLocation = province + ' ' + city + ' ' + county
  // 更新省市区编码
  const [provinceCode, cityCode, countyCode] = ev.detail.code
  Object.assign(form.value, { provinceCode, cityCode, countyCode })
}

// 修改默认地址
const onSwitchChange = (ev: any) => {
  form.value.isDefault = ev.detail.value ? 1 : 0
}

// 表单验证
const verify = () => {
  if (!form.value.receiver) {
    uni.showToast({ icon: 'none', title: '请填写收货人姓名' })
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(form.value.contact)) {
    uni.showToast({ icon: 'none', title: '请填写正确的手机号码' })
    return false
  }
  if (!form.value.fullLocation) {
    uni.showToast({ icon: 'none', title: '请选择所在地区' })
    return false
  }
  if (!form.value.address) {
    uni.showToast({ icon: 'none', title: '请填写详细地址' })
    return false
  }
  return true
}

// 提交表单
const onSubmit = async () => {
  // 验证表单
  if (!verify()) return

  // 准备请求参数
  const data: AddressParams = {
    receiver: form.value.receiver,
    contact: form.value.contact,
    provinceCode: form.value.provinceCode,
    cityCode: form.value.cityCode,
    countyCode: form.value.countyCode,
    address: form.value.address,
    isDefault: form.value.isDefault,
  }

  try {
    // 新建和修改逻辑
    if (query.id) {
      // 修改地址
      await putMemberAddressByIdAPI(query.id, data)
      uni.showToast({ icon: 'success', title: '修改成功' })
    } else {
      // 新建地址
      await postMemberAddressAPI(data)
      uni.showToast({ icon: 'success', title: '添加成功' })
    }
    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch (error) {
    uni.showToast({ icon: 'error', title: '操作失败' })
  }
}

// 页面加载
onLoad(() => {
  // 设置页面标题
  setPageTitle()
  // 有 id 才需要查询地址详情
  if (query.id) {
    getMemberAddressById()
  }
})
</script>

<template>
  <view class="content">
    <form>
      <!-- 表单内容 -->
      <view class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="form.receiver" />
      </view>
      <view class="form-item">
        <text class="label">手机号码</text>
        <input class="input" placeholder="请填写收货人手机号码" v-model="form.contact" />
      </view>
      <view class="form-item">
        <text class="label">所在地区</text>
        <picker class="picker" mode="region" :value="form.fullLocation.split(' ')" @change="onRegionChange">
          <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="form.address" />
      </view>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch 
          class="switch" 
          color="#27ba9b" 
          :checked="form.isDefault === 1"
          @change="onSwitchChange"
        />
      </view>
    </form>
  </view>
  <!-- 提交按钮 -->
  <button class="button" @tap="onSubmit">保存并使用</button>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx 40rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
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