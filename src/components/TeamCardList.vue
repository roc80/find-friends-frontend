<template>
  <van-empty v-if="!teams || teams.length == 0" description="暂无数据"/>
  <div class="team-list">
    <van-cell
        v-for="team in teams"
        :key="team.id"
        class="team-item"
        clickable
    >
      <div class="team-content" :class="getTeamClass(team.joinType)">
        <!-- 队伍基本信息 -->
        <div class="team-header">
          <div class="team-title">
            <h3 class="team-name">{{ team.name }}</h3>
            <span class="team-id">ID: {{ team.id }}</span>
          </div>
          <div class="team-stats">
            <van-tag :type="getJoinTypeTagType(team.joinType)">
              {{ getJoinTypeText(team.joinType) }}
            </van-tag>
          </div>
        </div>

        <!-- 队伍描述 -->
        <div class="team-description">
          {{ truncateDescription(team.description) }}
        </div>

        <!-- 队伍信息行 -->
        <div class="team-info">
          <div class="team-meta">
            <van-icon name="clock-o" size="14"/>
            <span class="create-time">{{ formatDateTime(team.createDatetime) }}</span>
          </div>
          <div class="team-count">
            <van-icon name="friends-o" size="14"/>
            <span>{{ team.members.length }}/{{ team.maxNum }} 人</span>
          </div>
        </div>

        <!-- 成员头像区域 (GitHub风格) -->
        <div class="members-section" v-if="team.members.length > 0">
          <div class="members-avatars">
            <div
                v-for="(member, index) in getDisplayMembers(team.members)"
                :key="member.userId"
                class="member-avatar"
                :style="{ zIndex: team.members.length - index }"
            >
              <van-image
                  :src="member.avatarUrl"
                  width="32"
                  height="32"
                  round
                  fit="cover"
                  :alt="member.userName"
                  @error="e => e.target.src = '/default_avatar.svg'"
              />
            </div>
            <!-- 显示更多成员数量 -->
            <div
                v-if="team.members.length > maxDisplayAvatars"
                class="more-members"
            >
              +{{ team.members.length - maxDisplayAvatars }}
            </div>
          </div>
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script setup lang="ts">
import {Team, User} from "@/typing";
import {TeamJoinType} from "@/enums/TeamJoinType";
import {TagType} from "vant/lib/tag/types";

defineProps<{ teams: Team[] }>();
const maxDisplayAvatars = 8
// 获取队伍样式类
const getTeamClass = (joinType: TeamJoinType) => {
  const classMap: Record<TeamJoinType, string> = {
    [TeamJoinType.PUBLIC]: 'team-public',
    [TeamJoinType.SECRET]: 'team-secret',
    [TeamJoinType.PRIVATE]: 'team-private',
  }
  return classMap[joinType] || 'team-default'
}

// 获取加入类型标签样式
const getJoinTypeTagType = (joinType: TeamJoinType) => {
  const typeMap: Record<TeamJoinType, TagType> = {
    [TeamJoinType.PUBLIC]: 'success',
    [TeamJoinType.SECRET]: 'primary',
    [TeamJoinType.PRIVATE]: 'default',
  }
  return typeMap[joinType] || 'default'
}

// 获取加入类型文本
const getJoinTypeText = (joinType: TeamJoinType) => {
  const textMap: Record<TeamJoinType, string> = {
    [TeamJoinType.PUBLIC]: '任何人都可加入',
    [TeamJoinType.SECRET]: '输入密码加入',
    [TeamJoinType.PRIVATE]: '不可加入',
  }
  return textMap[joinType] || joinType
}

// 截断描述文本
const truncateDescription = (description: string | null) => {
  if (!description) return ''
  return description.length > 100 ? description.slice(0, 100) + '...' : description
}

// 格式化日期时间
const formatDateTime = (datetime: Date | string | number) => {
  const date = new Date(datetime); // 统一转为 Date 类型
  if (isNaN(date.getTime())) {
    return '时间格式错误'; // 兜底处理无效日期
  }
  const now = new Date().getTime()
  const diff = now - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// 获取要显示的成员列表
const getDisplayMembers = (members: User[]) => {
  return members.slice(0, maxDisplayAvatars)
}
</script>

<style scoped>
.team-list {
  background-color: #f8f9fa;
  margin: 16px;
}

.team-item {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e1e4e8;
  transition: all 0.2s ease;
}

.team-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 不同类型队伍的背景色 */
::v-deep(.team-public) {
  background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%);
  border-left: 4px solid #22c55e;
}

::v-deep(.team-secret) {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
  border-left: 4px solid #3b82f6;
}

::v-deep(.team-private) {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-left: 4px solid #64748b;
}

.team-content {
  padding: 16px;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.team-title {
  flex: 1;
}

.team-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.team-id {
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
}

.team-stats {
  margin-left: 12px;
}

.team-description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  word-break: break-word;
}

.team-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 13px;
  color: #6b7280;
}

.team-meta,
.team-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.create-time {
  margin-left: 2px;
}

/* 成员头像区域 - GitHub风格 */
.members-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}

.members-avatars {
  display: flex;
  align-items: center;
  gap: -8px; /* 负边距实现重叠效果 */
}

.member-avatar {
  position: relative;
  width: 32px;
  height: 32px;
  margin-left: -8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  overflow: hidden; /* 确保图片不超出圆形容器 */
  transition: all 0.2s ease;
  cursor: pointer;
}

:deep(.van-image) {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.member-avatar:first-child {
  margin-left: 0;
}

.member-avatar:hover {
  transform: translateY(-2px);
  z-index: 999 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.more-members {
  background: #f3f4f6;
  border: 2px solid #ffffff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  margin-left: -8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.more-members:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .team-list {
    margin: 12px;
  }

  .team-item {
    margin-bottom: 8px;
  }

  .team-content {
    padding: 12px;
  }

  .team-name {
    font-size: 16px;
  }

  .team-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .members-avatars {
    gap: -6px;
  }

  .member-avatar {
    margin-left: -6px;
  }

  .more-members {
    margin-left: -6px;
  }
}

/* VantUI样式覆盖 */
:deep(.van-cell) {
  padding: 0;
  background: transparent;
}

:deep(.van-cell__value) {
  width: 100%;
}

:deep(.van-image__img) {
  transition: all 0.2s ease;
}
</style>