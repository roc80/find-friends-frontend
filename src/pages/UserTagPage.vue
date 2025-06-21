<script setup lang="ts">
import TagTree from "@/components/TagTree.vue";
import {onMounted, ref} from "vue";
import {CommonResponse, Tag, User} from "@/typing";
import {getUserTags} from "@/utils/UserUtil";
import {defaultUserState, useUserStore} from "@/stores/UserLoginState";
import myAxios from "@/utils/myAxios";
import {UserAPI} from "@/api/user";
import {ResponseCode} from "@/enums/ResponseCode";
import {showFailToast, showSuccessToast} from "vant";
import {Numeric} from "vant/es/utils";
import {useRouter} from "vue-router";

const router = useRouter()
const currentUser: User = useUserStore().currentUser ?? defaultUserState;
let tags = ref<Tag[]>([])
let tagIds = ref<Numeric[]>([])
onMounted(async () => {
  tags.value = await getUserTags(currentUser.userId)
  tagIds.value = tags.value.map((tag) => tag.id)
})

const onActiveIdsChange = (value: Numeric[]) => {
  tagIds.value = value
}

const doUpdateTag = async () => {
  const res = await myAxios.post<CommonResponse<number>>(UserAPI.updateMyTags, {
    "tagIdList": tagIds.value,
  })
  if (res.code === ResponseCode.SUCCESS) {
    showSuccessToast(`共添加${res.data}个tag到当前用户`)
    await router.replace('/user')
  } else {
    showFailToast(`更新失败, ${res.message}, ${res.description}`)
  }
}
</script>

<template>
  <div class="page-container">
    <TagTree :activeIds="tagIds"
             @on-active-ids-change="onActiveIdsChange"/>
    <div id="fixed-button">
      <van-button class="button" type="primary" block @click="doUpdateTag">
        更新标签
      </van-button>
    </div>
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

#fixed-button {
  position: sticky;
  bottom: 50px;
  z-index: 10;
  background: white;
}

.button {
  margin-bottom: 20px;
  margin-top: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0; /* 防止按钮被压缩 */
}
</style>