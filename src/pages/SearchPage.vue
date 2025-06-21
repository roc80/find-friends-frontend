<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRouter} from "vue-router";
import {showFailToast, TreeSelectItem} from "vant";
import TagTree from "@/components/TagTree.vue";
import {Numeric} from "vant/es/utils";

const searchText = ref('')
const router = useRouter()
const treeItems = ref<TreeSelectItem[]>([])
const activeIds = ref<Numeric[]>([])

const onReceivedTreeItems = (value: TreeSelectItem[]) => {
  treeItems.value = value
}

const onActiveIdsChange = (value: Numeric[]) => {
  activeIds.value = value
}

const allChildTags = computed(() => {
  return treeItems.value.flatMap(parent => parent.children || [])
})

const onSearchTags = (val: string) => {
  if (!val.trim() || !allChildTags.value.length) {
    return
  }
  const foundTag = allChildTags.value.find(item => item.text === val.trim())
  if (foundTag) {
    // 检查是否已经选中，避免重复添加
    if (!activeIds.value.includes(foundTag.id)) {
      activeIds.value.push(foundTag.id)
    }
    searchText.value = ''
  } else {
    showFailToast(`未找到标签: ${val}`)
  }
}

const onCancel = () => {
  searchText.value = ''
  activeIds.value = []
  router.back()
}

const onSearchUser = () => {
  if (activeIds.value.length === 0) {
    showFailToast('请至少选择一个标签')
    return
  }

  router.push({
    path: '/search/tags',
    query: {
      tagIds: JSON.stringify(activeIds.value),
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

    <TagTree :active-ids="[]"
             @on-received-tree-items="onReceivedTreeItems"
             @on-active-ids-change="onActiveIdsChange"/>

    <van-button
        class="button"
        type="primary"
        block
        :disabled="activeIds.length === 0"
        @click="onSearchUser"
    >
      搜索 ({{ activeIds.length }})
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
  background: white;
  padding-bottom: 8px;
}

.button {
  margin-bottom: 20px;
  margin-top: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.button:disabled {
  opacity: 0.5;
}
</style>