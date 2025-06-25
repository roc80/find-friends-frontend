<script setup lang="ts">
import {getUserTags} from "@/utils/UserUtil";
import {Tag, User} from "@/typing";
import {onMounted, ref, watch} from "vue";

const props = defineProps<{ userList: User[] }>()
const userTagsMap = ref<Record<number, Tag[]>>({})
onMounted(() => {
  loadAllUserTags();
})
const loadAllUserTags = async () => {
  if (!props.userList || props.userList.length === 0) {
    return
  }
  const tagPromises = props.userList.map(async (user: User) => {
    try {
      const tags = await getUserTags(user.userId);
      return {userId: user.userId, tags: tags}
    } catch (error) {
      console.error(`Failed to load tags for user ${user.userId}: `, error)
      return {userId: user.userId, tags: []}
    }
  });
  const userIdTags = await Promise.all(tagPromises);
  userIdTags.forEach(({userId, tags}) => {
    userTagsMap.value[userId] = tags;
  })
}

watch(() => props.userList, loadAllUserTags, {immediate: true});
</script>

<template>
  <div class="user-list">
    <van-empty :image-size="[200, 400]" v-if="!userList || userList.length == 0" description="未找到用户"/>
    <van-card class="custom-card" v-for="user in userList"
              :thumb=user.avatarUrl
              :title=user.userName
              :desc=user.email
    >
      <template #tags>
        <van-tag v-for="tag in userTagsMap[user.userId] || []" plain type="primary"
                 style="margin-top: 5px; margin-right: 5px">
          {{ tag.tagName }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="small">更多信息</van-button>
      </template>
    </van-card>
  </div>
</template>

<style scoped>
.custom-card {
  --van-card-thumb-radius: 60px;
  --van-card-thumb-size: 70px;
}
</style>