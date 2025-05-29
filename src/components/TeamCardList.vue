<script setup lang="ts">
import {parseTags} from "@/utils/UserUtil";
import {Team} from "@/typing";

const props = defineProps<{ teamList: Team[] | null}>()
</script>

<template>
  <div class="team-list">
    <van-empty v-if="!teamList || teamList.length == 0" description="暂无"/>
    <van-card class="custom-card" v-for="team in teamList"
              :thumb=team.avatarUrl
              :title=team.userName
              :desc=team.email
    >
      <template #tags>
        <van-tag v-for="tagName in parseTags(team.tags)" plain type="primary" style="margin-top: 5px; margin-right: 5px">
          {{ tagName }}
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