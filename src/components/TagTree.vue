<script setup lang="ts">

import {computed, onMounted, ref, watch} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import myAxios from "@/utils/myAxios";
import {CommonResponse, Tag, TagTreeNode} from "@/typing";
import {TagAPI} from "@/api/tag";
import {ResponseCode} from "@/enums/ResponseCode";
import {Numeric} from "vant/es/utils";

const treeItems = ref<TreeSelectItem[]>([])
const activeIds = ref<Numeric[]>([])
const activeIndex = ref(0)
const isLoading = ref(false)

// 创建标签弹窗相关状态
const showCreateDialog = ref(false)
const showParentPicker = ref(false)
const createTagType = ref<'parent' | 'child'>('child')
const newTagName = ref('')
const selectedParentId = ref<number | null>(null)
const selectedParentName = ref('')
const isCreating = ref(false)

interface Emits {
  (event: 'on-received-tree-items', value: TreeSelectItem[]): void;

  (event: 'on-active-ids-change', value: Numeric[]): void;
}

interface Props {
  activeIds: Numeric[];
}

interface TreeSelectItem {
  id: number;
  text: string;
  children?: TreeSelectItem[]
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

watch(() => props.activeIds, (newActiveIds) => {
  activeIds.value = newActiveIds
}, {immediate: true})

watch(activeIds, (newActiveIds) => {
  emit('on-active-ids-change', newActiveIds)
}, {deep: true})

const activeTagNames = computed(() => {
  if (!treeItems.value.length) return []
  const tagIdNameMap = new Map<Numeric, string>()
  treeItems.value.forEach((parent) => {
    parent?.children?.forEach((child) => {
      tagIdNameMap.set(child.id, child.text)
    })
  })
  return activeIds.value.filter(id => tagIdNameMap.has(id)).map(id => tagIdNameMap.get(id))
})

const parentOptions = computed(() => {
  return treeItems.value.map(item => ({
    text: item.text,
    // van-picker中每列选中时，返回的是选中项的value字段，这里需要把父标签id返回。
    value: item.id,
  }))
})

const isFormValid = computed(() => {
  const hasTagName = newTagName.value.trim().length > 0
  if (createTagType.value === 'parent') {
    return hasTagName
  } else {
    return hasTagName && selectedParentId.value !== null
  }
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
      emit('on-received-tree-items', treeItems.value)
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

const convertToTreeSelectData = (tagTreeNodes: TagTreeNode[]): TreeSelectItem[] => {
  return tagTreeNodes.map(node => ({
    id: node.id,
    text: node.tagName,
    children: node.children?.map(child => ({
      text: child.tagName,
      id: child.id,
    })),
  }));
};

const onRemoveTag = (index: number) => {
  activeIds.value.splice(index, 1)
}

const onClearAllTags = () => {
  activeIds.value = []
}

interface TagCreateRequest {
  tagName: string,
  parentId: number,
  isParent: number,
}

const doCreateTag = async (tagCreateRequest: TagCreateRequest) => {
  const res = await myAxios.post<CommonResponse<Tag>>(TagAPI.createTag, tagCreateRequest);
  if (res.code === ResponseCode.SUCCESS) {
    showSuccessToast(`创建Tag: ${res?.data?.tagName} 成功`)
    await fetchTagTree()
  } else {
    showFailToast(`创建Tag: ${res?.data?.tagName} 失败`)
  }
}

const createTag = () => {
  showCreateDialog.value = true
  resetCreateForm()
}

const resetCreateForm = () => {
  newTagName.value = ''
  createTagType.value = 'child'
  selectedParentId.value = null
  selectedParentName.value = ''
}

const onCreateTypeChange = (type: 'parent' | 'child') => {
  createTagType.value = type
  if (type === 'parent') {
    selectedParentId.value = null
    selectedParentName.value = ''
  }
}

const onParentSelect = ({selectedValues}: any) => {
  selectedParentId.value = selectedValues[0] as number
  selectedParentName.value = parentOptions.value.find(p => p.value === selectedValues[0])?.text || ''
  showParentPicker.value = false
}

const confirmCreateTag = async () => {
  if (!isFormValid.value) {
    showFailToast('请填写完整信息')
    return
  }

  try {
    isCreating.value = true

    await doCreateTag({
      tagName: newTagName.value.trim(),
      parentId: createTagType.value === 'parent' ? 0 : selectedParentId.value!,
      isParent: createTagType.value === 'parent' ? 1 : 0
    })

    showCreateDialog.value = false

  } catch (error) {
    console.error('创建标签失败:', error)
    showFailToast('创建标签失败')
  } finally {
    isCreating.value = false
  }
}

const cancelCreateTag = () => {
  showCreateDialog.value = false
  resetCreateForm()
}

</script>

<template>
  <div class="scrollable-content">
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

    <p class="section-title">所有标签</p>

    <van-loading v-if="isLoading" type="spinner" color="#1989fa">
      加载中...
    </van-loading>

    <van-tree-select class="tree-select"
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

    <van-button type="primary" id="create-tag-btn" @click="createTag">
      没有合适的标签？创建新标签
    </van-button>

    <van-dialog
        v-model:show="showCreateDialog"
        title="创建新标签"
        :show-cancel-button="true"
        :confirm-button-loading="isCreating"
        :confirm-button-disabled="!isFormValid"
        @confirm="confirmCreateTag"
        @cancel="cancelCreateTag"
    >
      <div class="create-tag-form">
        <div class="form-section">
          <div class="form-label">标签类型</div>
          <van-radio-group v-model="createTagType" direction="horizontal">
            <van-radio name="parent" @click="onCreateTypeChange('parent')">
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? '/icons/active-icon.svg' : '/icons/inactive-icon.svg'"/>
              </template>
              创建父标签
            </van-radio>
            <van-radio name="child" @click="onCreateTypeChange('child')">
              <template #icon="props">
                <img class="img-icon" :src="props.checked ? '/icons/active-icon.svg' : '/icons/inactive-icon.svg'"/>
              </template>
              创建子标签
            </van-radio>
          </van-radio-group>
          <div class="form-hint">
            <span v-if="createTagType === 'parent'">父标签可以包含多个子标签</span>
            <span v-else>子标签需要归属于某个父标签</span>
          </div>
        </div>

        <div class="form-section">
          <div class="form-label">标签名称</div>
          <van-field
              v-model="newTagName"
              placeholder="请输入标签名称"
              clearable
              maxlength="20"
              show-word-limit
          />
        </div>

        <div v-if="createTagType === 'child'" class="form-section">
          <div class="form-label">选择父标签</div>
          <van-field
              v-if="parentOptions.length > 0"
              v-model="selectedParentName"
              placeholder="请选择父标签"
              readonly
              is-link
              @click="showParentPicker = true"
          />
          <van-empty
              v-else
              description="暂无父标签，请先创建父标签"
              image-size="60"
          />
        </div>
      </div>
    </van-dialog>

    <van-popup
        v-model:show="showParentPicker"
        position="bottom"
        round
        :safe-area-inset-bottom="true"
    >
      <van-picker
          :columns="parentOptions"
          @confirm="onParentSelect"
          @cancel="showParentPicker = false"
      />
    </van-popup>
  </div>
</template>

<style scoped>
.scrollable-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
}

.section-title {
  font-size: 20px;
  margin: 0;
  font-weight: 600;
  width: 100%;
}

.tree-select {
  width: 100%;
}

.selected-tags {
  min-height: 60px;
  display: flex;
  align-items: center;
  width: 100%;
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

#create-tag-btn {
  margin-top: 20px;
}

.create-tag-form {
  padding: 20px 16px;
}

.form-section {
  margin-bottom: 24px;
}

.form-label {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
  display: block;
}

.form-hint {
  font-size: 12px;
  color: #969799;
  margin-top: 8px;
  line-height: 1.4;
}

.img-icon {
  width: 20px;
  height: 20px;
}

:deep(.van-radio-group--horizontal .van-radio) {
  margin-right: 24px;
}

:deep(.van-radio__label) {
  font-size: 14px;
  color: #323233;
}

:deep(.van-picker) {
  background: #fff;
}
</style>