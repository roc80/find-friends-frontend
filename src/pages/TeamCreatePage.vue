<script setup lang="ts">

import {ref} from "vue";
import myAxios from "@/utils/myAxios";
import {TeamAPI} from "@/api/team";
import {showToast} from "vant";
import {TeamJoinType} from "@/enums/TeamJoinType";
import {CommonResponse, TeamCreateRequest} from "@/typing";
import {useRouter} from "vue-router";
import {ResponseCode} from "@/enums/ResponseCode";

let teamCreateRequest = ref<TeamCreateRequest>({
  name: '',
  maxNum: 1,
  joinType: TeamJoinType.PUBLIC,
})
const router = useRouter()
const doCreateTeam = async () => {
  const res = await myAxios.post<CommonResponse<boolean>>(TeamAPI.create, teamCreateRequest.value)
  if (res.code === ResponseCode.SUCCESS && res.data && res.data) {
    showToast({
      message: '队伍创建成功',
      icon: 'success',
    })
    await router.replace('/team')
  } else {
    showToast({
      message: `队伍创建失败 ${res.message + res.description}`,
      icon: 'fail',
    })
  }
}


</script>

<template>
  <div id="container">
    <van-form @submit="doCreateTeam">
      <van-cell-group inset>
        <van-field
            v-model="teamCreateRequest.name"
            name="name"
            label="队伍名称"
            placeholder="请输入队伍名称（必填）"
            :rules="[{ required: true, message: '请输入队伍名称（必填）' }]"
        />
        <van-field
            v-model="teamCreateRequest.description"
            rows="1"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
        <van-field name="stepper" label="队伍最大人数">
          <template #input>
            <van-stepper v-model="teamCreateRequest.maxNum" min="1" max="20" integer/>
          </template>
        </van-field>

        <van-radio-group id="radio-group"  v-model="teamCreateRequest.joinType" direction="horizontal">
          <van-radio :name="TeamJoinType.PUBLIC">
            公开
            <template #icon="{ checked }">
              <svg class="svg-icon"
                   :class="{ active: checked }"
                   xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 32 32">
                <path
                    d="M22.5 13c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5s8.5-3.8 8.5-8.5s-3.8-8.5-8.5-8.5zm6.5 8h-3c0-2-.3-4-.9-5.5c2.1 1 3.7 3 3.9 5.5zm-6.5 7c-.4-.2-1.3-1.8-1.5-5h2.9c-.2 3.2-1 4.8-1.4 5zM21 21c.1-3.8 1.1-5.8 1.4-6c.4.2 1.4 2.2 1.5 6H21zm-1.1-5.5c-.6 1.5-.8 3.5-.9 5.5h-3c.2-2.5 1.8-4.5 3.9-5.5zM16.2 23H19c.1 1.6.4 3.2.9 4.5c-1.8-.8-3.2-2.5-3.7-4.5zm8.9 4.5c.5-1.3.8-2.8.9-4.5h2.9c-.6 2-2 3.7-3.8 4.5z"/>
                <path
                    d="M25.8 10c-.9-4.6-5-8-9.8-8c-4.8 0-8.9 3.4-9.8 8.1c-3.5.7-6.2 3.7-6.2 7.4C0 21.6 3.4 25 7.5 25H11v-2H7.5c-3 0-5.5-2.5-5.5-5.5c0-2.9 2.2-5.3 5.1-5.5H8v-.9c.5-4 3.9-7.1 8-7.1c3.7 0 6.8 2.6 7.7 6h2.1z"/>
              </svg>
            </template>
          </van-radio>

          <van-radio :name="TeamJoinType.SECRET">
            加密
            <template #icon="{ checked }">
              <svg class="svg-icon"
                   :class="{ active: checked }"
                   xmlns="http://www.w3.org/2000/svg" width="200" height="200"
                   viewBox="0 0 32 32">
                <path
                    d="M21 2a8.998 8.998 0 0 0-8.612 11.612L2 24v6h6l10.388-10.388A9 9 0 1 0 21 2Zm0 16a7.013 7.013 0 0 1-2.032-.302l-1.147-.348l-.847.847l-3.181 3.181L12.414 20L11 21.414l1.379 1.379l-1.586 1.586L9.414 23L8 24.414l1.379 1.379L7.172 28H4v-3.172l9.802-9.802l.848-.847l-.348-1.147A7 7 0 1 1 21 18Z"/>
                <circle cx="22" cy="10" r="2" fill="#000000"/>
              </svg>
            </template>
          </van-radio>

          <van-radio :name="TeamJoinType.PRIVATE">
            不可加入
            <template #icon="{ checked }">
              <svg class="svg-icon"
                   :class="{ active: checked }"
                   xmlns="http://www.w3.org/2000/svg" width="200" height="200"
                   viewBox="0 0 582 1000">
                <path
                    d="M582 413v356q0 32-32 32H32q-32 0-32-32V413q0-10 3-16.5t7-10t12-5t13-2t15.5 0t14.5.5V253h1q9-87 74-140.5T293 59t151 62.5T515 273h1l2 107q4 0 14.5-.5t15 0t13 2t12 5t6.5 10t3 16.5zM421 251q0-51-37-74t-91-23q-53 0-92 25.5T162 256v124h259V251z"/>
              </svg>
            </template>
          </van-radio>
        </van-radio-group>

        <van-field v-if="teamCreateRequest.joinType == TeamJoinType.SECRET"
                   v-model="teamCreateRequest.joinKey"
                   placeholder="请输入入队密钥"
                   :rules="[{ required: true, message: '请输入入队密钥（必填）' }]"
                   name="joinKey"
                   label="入队密钥"/>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          创建
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped>
#container {
  margin-top: 30px;
}
.svg-icon {
  width: 20px;
  height: 20px;
  fill: #ccc; /* 未选中为灰色 */
  transition: fill 0.3s;
}

.svg-icon.active {
  fill: #1989fa; /* 选中为蓝色 */
}

#radio-group {
  display: flex;
  justify-content: space-evenly;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>