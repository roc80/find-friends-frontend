<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from "vue-router";

const searchText = ref('')
const onSearchTags = (val: string) => {
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
  history.back()
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
  {
    text: '性别',
    children: [
      {text: '男', id: '男'},
      {text: '女', id: '女'},
    ],
  },
]

const onRemoveTag = (index: number) => {
  activeIds.value = activeIds.value.filter((id) =>
      id !== activeIds.value[index]
  )
}
const router = useRouter()
const onSearchUser = () => {
  router.push({
    path: '/search/tags',
    query: {
      tagNameList: activeIds.value,
    },
  })
}

</script>

<template>
  <div class="page-container">

    <div class="fixed-part">
      <form action="/">
        <van-search
            v-model="searchText"
            show-action
            placeholder="请输入标签名称"
            @search="onSearchTags"
            @cancel="onCancel"
        />
      </form>
    </div>

    <div class="scrollable-content">
      <!-- 已选择标签 -->
      <p style="font-size: 20px;">已选择标签</p>
      <div>
        <van-space wrap :size="14">
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

      <!-- 所有标签 -->
      <p style="font-size: 20px;">所有标签</p>

      <van-tree-select
          v-model:active-id="activeIds"
          v-model:main-active-index="activeIndex"
          :items="originalTagNameList"
      />

    </div>

    <van-button id="button" type="primary" block @click="onSearchUser">
      搜索
    </van-button>

  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin-left: 14px;
  margin-right: 14px;
}

.fixed-part {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-right: 10px;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
}

.custom-tag {
  padding: 10px 10px;
  font-size: 14px;
  border-radius: 16px;
  background: linear-gradient(45deg, #A1C4FD, #C2E9FB);
}
#button {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>