<script setup lang="ts">
import {ref} from 'vue'

const searchText = ref('')
const onSearch = (val: string) => {
  const list = originalTagNameList.flatMap(parent => parent.children)
  for (let item of list) {
    if (item.text === val) {
      activeIds.value.push(item.id)
      searchText.value = ''
      break
    }
  }

}
const onCancel = () => {
  searchText.value = ''
  activeIds.value = []
}
const activeIds = ref<string[]>([])
const activeIndex = ref(0)
// todo items从后台请求
const originalTagNameList = [
  {
    text: '编程语言',
    children: [
      {text: 'Java', id: 'Java'},
      {text: 'C++', id: 'C++'},
    ],
  },
  {
    text: '身份',
    children: [
      {text: '中学', id: '中学'},
      {text: '大学', id: '大学'},
      {text: '研究生', id: '研究生'},
      {text: '在职', id: '在职'},
      {text: 'gap', id: 'gap'},
      {text: '数字游民', id: '数字游民'},
    ],
  },
]
let tagNameList = [...originalTagNameList]

const onRemoveTag = (index: number) => {
  activeIds.value = activeIds.value.filter((id) =>
      id !== activeIds.value[index]
  )
}


</script>

<template>
  <form action="/">
    <van-search
        autofocus
        v-model="searchText"
        show-action
        placeholder="请输入标签名称"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>

  <p style="font-size: 20px;">
    已选择标签
  </p>
  <div>
    <van-space wrap :size="18">
      <van-tag class="custom-tag"
               v-for="(activeId, index) in activeIds"
               closeable
               round
               size="large"
               type="primary"
               @close="onRemoveTag(index)"
      >
        {{ activeId }}
      </van-tag>
    </van-space>
  </div>
  <van-divider/>
  <p style="font-size: 20px;">
    所有标签
  </p>
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagNameList"
  />

</template>

<style scoped>
.custom-tag {
  padding: 10px 10px;
  font-size: 14px;
  border-radius: 16px;
  background: linear-gradient(45deg, #A1C4FD, #C2E9FB)
}
</style>