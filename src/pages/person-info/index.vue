<script setup lang="ts">
import type { DateValue } from 'tdesign-mobile-vue'
import { Message } from 'tdesign-mobile-vue'
import userInfo from '@/store/userInfo'
import { formatDate } from '@/utils/date'

interface ValidationResultItem {
  valid: boolean
  message?: string
}

interface FieldValidationResult {
  [fieldName: string]: ValidationResultItem[]
}

type ValidateResult = true | FieldValidationResult

const form = ref(null)
const router = useRouter()

// 表单数据
const formData = reactive({
  name: '蔡少宣',
  birthday: '1994年9月27日',
  phone: '18899998888',
  idCard: '',
  email: '',
  profession: '设计师/艺术从业者',
})

// 是否设为默认
const isDefault = ref(false)

// 显示日期选择器
const showDatePicker = ref(false)

// 显示职业选择器
const showProfessionPicker = ref(false)

// 日期选择器值
const datePickerValue = ref <DateValue> ('1994-09-27')

// 职业选择器值
const professionPickerValue = ref(['设计师/艺术从业者'])

// 职业选项
const professionColumns = [
  [{
    label: '学生',
    value: '学生',
  }, {
    label: '计算机从业者',
    value: '计算机从业者',
  }, {
    label: '设计师/艺术从业者',
    value: '设计师/艺术从业者',
  }, {
    label: '医务人员',
    value: '医务人员',
  }, {
    label: '自由职业者',
    value: '自由职业者',
  }],
]

function onDateConfirm(value: DateValue) {
  if (value) {
    formData.birthday = formatDate(value)
  }
  showDatePicker.value = false
}

function onDateCancel() {
  showDatePicker.value = false
}

// 处理职业选择
function onProfessionConfirm(value: any) {
  if (value && value[0]) {
    formData.profession = value[0]
  }
  showProfessionPicker.value = false
}

// 表单验证规则
const rules = {
  name: [{
    required: true,
    message: '请输入姓名',
  }, {
    validator: (val: string) => {
      const len = val.trim().length
      if (len < 2) {
        return {
          result: false,
          message: '姓名至少 2 个字符',
        }
      }
      return {
        result: true,
        message: '',
      }
    },
  }],
  birthday: [{
    required: true,
    message: '请选择生日',
  }],
  phone: [{
    required: true,
    message: '请输入手机号',
  }, {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的电话号码',
  }],
  idCard: [{
    required: true,
    message: '请输入身份证号码',
  }, {
    pattern: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i,
    message: '请输入正确的身份证号码',
  }],
  email: [{
    pattern: /^[a-z0-9][\w.-]*[a-z0-9]@[a-z0-9]+\.[a-z]+$/i,
    message: '请输入正确的邮箱',
  }],
}

function isFormValid(validationResult: ValidateResult): boolean {
  return Object.values(validationResult).every(rules =>
    Array.isArray(rules) && rules.every(rule => rule.result === true),
  )
}

// 确认保存
async function handleConfirm() {
  if (!form.value)
    return
  // @ts-expect-error - 等待 TDesign 类型修复
  form.value.validate().then((result: ValidateResult) => {
    if (isFormValid(result)) {
      // 添加到userInfo store 由于mock数据会刷新重置 目前先保存在store里便于数据展示
      // 实际使用时应该保存至后端的接口中
      userInfo.addPerson({
        name: formData.name,
        // 仅做演示用途，但避免存储敏感信息
        birthday: formData.birthday,
        phone: formData.phone,
        idCard: '',
        email: '',
        profession: formData.profession,
        isDefault: isDefault.value,
      })
      router.back()
    }
    else {
      Message.error({
        content: '请完善表单内容',
        duration: 2000,
      })
    }
  })
}
</script>

<template>
  <header>
    <t-navbar title="个人信息" left-arrow :on-left-click="$router.back" />
  </header>
  <main>
    <div class="container">
      <!-- 表单内容 -->
      <div>
        <t-form ref="form" :data="formData" :rules="rules" label-align="left" show-error-message label-width="97px" @submit="handleConfirm">
          <!-- 设为默认开关 -->
          <t-form-item label="设为默认" name="isDefault" content-align="right">
            <t-switch v-model="isDefault" />
          </t-form-item>
          <!-- 姓名 -->
          <t-form-item label="姓名" name="name" required>
            <t-input v-model="formData.name" placeholder="请输入姓名" maxlength="30" borderless align="left" />
          </t-form-item>

          <!-- 生日 -->
          <t-form-item label="生日" name="birthday" required>
            <div class="input-with-icon">
              <t-input v-model="formData.birthday" placeholder="请选择生日" borderless align="left" readonly @click="showDatePicker = true" />
              <CalendarIcon size="20px" @click="showDatePicker = true" />
            </div>
          </t-form-item>

          <!-- 手机号 -->
          <t-form-item label="手机号" name="phone" required>
            <t-input v-model="formData.phone" :maxlength="11" placeholder="请输入手机号" borderless align="left" />
          </t-form-item>

          <!-- 身份证 -->
          <t-form-item label="身份证" name="idCard" required>
            <t-input v-model="formData.idCard" :maxlength="18" placeholder="请输入您的身份证号码" borderless align="left" />
          </t-form-item>

          <!-- 邮箱 -->
          <t-form-item label="邮箱" name="email">
            <t-input v-model="formData.email" :maxlength="35" placeholder="请输入您的邮箱" borderless align="left" />
          </t-form-item>

          <!-- 职业 -->
          <t-form-item label="职业" name="profession" arrow>
            <t-input v-model="formData.profession" placeholder="请选择职业" borderless align="left" readonly @click="showProfessionPicker = true" />
          </t-form-item>
        </t-form>
      </div>
    </div>

    <!-- 底部确认按钮 -->
    <div class="bottom-action">
      <t-button theme="primary" block size="large" @click="handleConfirm">
        确定
      </t-button>
    </div>

    <!-- 日期选择器 -->
    <t-popup v-model="showDatePicker" placement="bottom">
      <t-date-time-picker :value="datePickerValue" title="选择生日" :mode="['date']" start="1950-01-01" end="2010-12-31" format="YYYY-MM-DD" @confirm="onDateConfirm" @cancel="onDateCancel" />
    </t-popup>

    <!-- 职业选择器 -->
    <t-popup v-model="showProfessionPicker" placement="bottom">
      <t-picker v-model="professionPickerValue" title="选择职业" :columns="professionColumns" @confirm="onProfessionConfirm" @cancel="showProfessionPicker = false" />
    </t-popup>
  </main>
</template>

<style lang="less" scoped>
@import './index.less';
</style>
