<template>
  <van-dialog
      v-model:show="visible"
      :title=title
      show-cancel-button
      @confirm="handleConfirm"
  >
    <van-field v-model="inputText" :placeholder=placeholder />
  </van-dialog>
</template>

<script setup lang="ts">
import {ref} from 'vue'

defineProps<{
  title: string,
  placeholder: string,
}>();

const visible = ref(false)
const inputText = ref<string>('')
let resolver: any

// 打开弹窗并返回 Promise
const open = async () => {
  visible.value = true
  inputText.value = ''
  return new Promise((resolve) => {
    resolver = resolve
  })
}

const handleConfirm = () => {
  visible.value = false
  resolver(inputText.value)
}

defineExpose({open})
</script>
