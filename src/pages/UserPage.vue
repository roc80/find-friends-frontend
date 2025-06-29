<script setup lang="ts">
import {useRouter} from "vue-router";
import {defaultUserState, useUserStore} from "@/stores/UserLoginState";
import {CommonResponse, User} from "@/typing";
import {onMounted, ref} from "vue";
import myAxios from "@/utils/myAxios";
import {UserAPI} from "@/api/user";
import {ResponseCode} from "@/enums/ResponseCode";
import {showFailToast, showSuccessToast} from "vant";

const userStore = useUserStore();
let currentUser: User = userStore.currentUser ?? defaultUserState;

onMounted(async () => {
  await userStore.fetchUser();
  currentUser = userStore.currentUser ?? defaultUserState;
})

const userEditPagePath = '/user/edit';
const router = useRouter()
const goEditPage = (key: string, fieldName: string) => {
  if (key in currentUser) {
    const typedKey = key as keyof User;
    router.push({
      path: userEditPagePath,
      query: {
        key: key,
        name: fieldName,
        value: currentUser[typedKey]
      },
    })
  }
}

const onLogout = async () => {
  await useUserStore().logout();
  await router.push('/');
}

const goUserTagPage = () => {
  router.push('/user/tags');
}

const fileInput = ref<HTMLInputElement | null>(null)

const triggerUpload = () => {
  fileInput.value?.click()
}

// 处理选择文件后的上传
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', currentUser.userId.toString())

  try {
    const res = await myAxios.post<CommonResponse<string>>(UserAPI.uploadAvatar, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if (res.code === ResponseCode.SUCCESS) {
      currentUser.avatarUrl = typeof res.data === 'string' ? res.data : ''
      showSuccessToast('上传成功')
      location.reload()
    } else {
      showFailToast('上传失败')
      console.error(`上传失败: ${res.message}, ${res.description}`)
    }
  } catch (error) {
    showFailToast('上传头像出错')
    console.error('上传头像出错', error)
  } finally {
    target.value = ''
  }
}
</script>

<template>
  <div class="user-profile">
    <!-- 头像 -->
    <div style="display:flex; justify-content: center;">
      <div @click="triggerUpload" style="cursor: pointer;">
        <van-image
            :src="currentUser.avatarUrl"
            round
            fit="cover"
            width="100"
            height="100"
        />
      </div>

      <!-- 隐藏的文件选择器 -->
      <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleFileChange"
      />
    </div>

    <van-cell-group>
      <!-- 用户名 -->
      <van-cell title="用户名" :value=currentUser.userName is-link @click="goEditPage('userName', '用户名')"/>

      <!-- 性别 -->
      <van-cell title="性别" :value="currentUser.gender" is-link @click="goEditPage('gender', '性别')"/>

      <!-- 邮箱 -->
      <van-cell title="邮箱" :value="currentUser.email" is-link @click="goEditPage('email', '邮箱')"/>

      <!-- 电话 -->
      <van-cell title="电话" :value="currentUser.phone" is-link @click="goEditPage('phone', '电话')"/>

      <!-- 用户角色 -->
      <van-cell title="用户角色" :value="currentUser.userRole"/>

      <!-- 创建时间 -->
      <van-cell title="注册时间" :value="currentUser.createDatetime"/>

      <!-- 标签 -->
      <van-cell title="标签" is-link @click="goUserTagPage"/>
    </van-cell-group>
  </div>

  <van-button id="button" type="primary" block @click="onLogout">
    退出登录
  </van-button>
</template>

<style scoped>
#button {
  margin: 20px 20px; /*上下20 左右20*/
  width: calc(100% - 40px); /*屏幕宽度 - margin*/
}
</style>