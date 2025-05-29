<script setup lang="ts">


import {useRouter} from "vue-router";
import {ref, watch} from "vue";
import {CommonResponse, Team} from "@/typing";
import TeamCardList from "@/components/TeamCardList.vue";
import myAxios from "@/utils/myAxios";
import {TeamAPI} from "@/api/team";

const router = useRouter()
const active = ref(0)
const doCreateTeam = () => {
  router.push('/team/create')
}
const allTeam = ref<Team[] | null>(null)
const joinedTeam = ref<Team[] | null>(null)
const ownedTeam = ref<Team[] | null>(null)
watch(active, async (newName) => {
  const currentTabIndex = Number(newName)
  switch (currentTabIndex) {
    case 0: {
      try {
        const res = await myAxios.get<CommonResponse<Team[]>>(TeamAPI.retrieveByPage, {
          params: {
            pageNum: 1,
            pageSize: 10
          }
        });
        allTeam.value = res.data;
      } catch (error) {
        console.error('获取所有队伍失败：', error);
      }
      break;
    }
    case 1: {
      try {
        const res = await myAxios.get<CommonResponse<Team[]>>(TeamAPI.retrieveMyJoined);
        joinedTeam.value = res.data;
      } catch (error) {
        console.error('获取已加入的队伍失败：', error);
      }
      break;
    }
    case 2: {
      try {
        const res = await myAxios.get<CommonResponse<Team[]>>(TeamAPI.retrieveMyOwned);
        ownedTeam.value = res.data;
      } catch (error) {
        console.error('获取自己管理的队伍失败：', error);
      }
      break;
    }
  }

}, {immediate: true});
</script>

<template>
  <div id="container">
    <van-button id="button" type="primary" block @click="doCreateTeam">
      创建队伍
    </van-button>
    <van-tabs v-model:active="active">
      <van-tab :name="0" title="所有的">
        <TeamCardList :team-list="allTeam"/>
      </van-tab>
      <van-tab :name="1" title="已加入的">
        <TeamCardList :team-list="joinedTeam"/>
      </van-tab>
      <van-tab :name="2" title="自己管理的">
        <TeamCardList :team-list="ownedTeam"/>
      </van-tab>
    </van-tabs>


  </div>
</template>

<style scoped>
#container {
  margin-left: 10px;
  margin-right: 10px;
}

#button {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>