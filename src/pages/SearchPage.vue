<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRouter} from "vue-router";
import myAxios from "@/utils/myAxios";
import {TagAPI} from "@/api/tag";
import {ResponseCode} from "@/enums/ResponseCode";
import {showFailToast, showSuccessToast} from "vant";
import {CommonResponse, TagTreeNode} from "@/typing";

interface TreeSelectItem {
  text: string;
  children?: { text: string; id: string; }[]
}

const treeItems = ref<TreeSelectItem[]>([])
const searchText = ref('')
const activeIds = ref<string[]>([])
const activeIndex = ref(0)
const isLoading = ref(false)

const router = useRouter()

const activeTagNames = computed(() => {
  if (!treeItems.value.length) return activeIds.value

  const allChildren = treeItems.value.flatMap(parent => parent.children || [])
  return activeIds.value.map(id => {
    const found = allChildren.find(child => child.id === id)
    return found ? found.text : id
  })
})

const allChildTags = computed(() => {
  return treeItems.value.flatMap(parent => parent.children || [])
})

onMounted(async () => {
  await fetchTagTree()
})

const fetchTagTree = async () => {
  try {
    isLoading.value = true
    const res = await myAxios.get<CommonResponse<TagTreeNode[]>>(TagAPI.getTagTree);

    if (res.code === ResponseCode.SUCCESS && res.data) {
      treeItems.value = convertToTreeSelectData(res.data)
      showSuccessToast('获取标签成功')
    } else {
      showFailToast('获取标签失败')
    }
  } catch (error) {
    console.error('获取标签树失败:', error)
    showFailToast('获取标签失败')
  } finally {
    isLoading.value = false
  }
}

const convertToTreeSelectData = (tagTree: TagTreeNode[]): TreeSelectItem[] => {
  // @ts-ignore
  return tagTree.map(node => ({
    text: node.tagName,
    children: node.children?.map(child => ({
      text: child.tagName,
      id: child.id,
    })),
  }));
};

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

const onRemoveTag = (index: number) => {
  activeIds.value.splice(index, 1)
}

const onSearchUser = () => {
  if (activeIds.value.length === 0) {
    showFailToast('请至少选择一个标签')
    return
  }

  router.push({
    path: '/search/tags',
    query: {
      tagNameList: JSON.stringify(activeTagNames.value),
    },
  })
}

const onClearAllTags = () => {
  activeIds.value = []
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
      <div class="section-header">
        <p class="section-title">已选择标签</p>
        <van-button
            v-if="activeIds.length > 0"
            type="default"
            size="small"
            @click="onClearAllTags"
        >
          清空
        </van-button>
      </div>

      <div class="selected-tags">
        <van-space wrap :size="14">
          <van-tag
              class="custom-tag"
              v-for="(tagName, index) in activeTagNames"
              :key="activeIds[index]"
              closeable
              round
              size="large"
              type="primary"
              @close="onRemoveTag(index)"
          >
            {{ tagName }}
          </van-tag>
        </van-space>
        <van-empty
            v-if="activeIds.length === 0"
            description="暂未选择任何标签"
            image-size="60"
        />
      </div>

      <van-divider/>

      <!-- 所有标签 -->
      <p class="section-title">所有标签</p>

      <van-loading v-if="isLoading" type="spinner" color="#1989fa">
        加载中...
      </van-loading>

      <van-tree-select
          v-else-if="treeItems.length > 0"
          v-model:active-id="activeIds"
          v-model:main-active-index="activeIndex"
          :items="treeItems"
      />

      <van-empty
          v-else
          description="暂无标签数据"
          image-size="80"
      />
    </div>

    <van-button
        id="button"
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

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}

.selected-tags {
  min-height: 60px;
  display: flex;
  align-items: center;
}

.custom-tag {
  padding: 10px 10px;
  font-size: 14px;
  border-radius: 16px;
  background: linear-gradient(45deg, #A1C4FD, #C2E9FB);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.custom-tag:hover {
  transform: translateY(-1px);
}

#button {
  margin-bottom: 20px;
  margin-top: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

#button:disabled {
  opacity: 0.5;
}
</style>