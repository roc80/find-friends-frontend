import {TeamJoinType} from "@/enums/TeamJoinType";

export type User = {
    userName: string;
    avatarUrl: string;
    userId: number;
    gender: string;
    email: string;
    phone: string;
    userRole: string;
    createDatetime: string;
    state: string;
};

export type CommonResponse<T> = {
    code: number;
    message: string;
    description: string;
    data: T | null;
    dateTime: Date;
};

export type PageResponse<T> = {
    records: T[];
    pageNum: number;
    pageSize: number;
    hasMore: boolean;
}

export type TeamCreateRequest = {
    name: string;
    description?: string;
    joinKey?: string;
    maxNum: number;
    joinType: TeamJoinType;
}

export type TeamUpdateRequest = {
    id: number;
    name: string;
    description: string | undefined;
    ownerUserId: number;
    maxNum: number;
    status: number | undefined;
    joinKey: string | undefined;
    joinType: TeamJoinType;
    memberIdList: number[];
}

export type Team = {
    id: number;
    name: string;
    description: string | undefined;
    maxNum: number;
    ownerUserId: number;
    joinType: TeamJoinType;
    joinKey: string | undefined;
    createDatetime: Date;
    members: User[];
};

export type TagTreeNode = {
    id: number;
    tagName: string;
    children: TagTreeNode[];
};

export type Tag = {
    id: number;
    tagName: string;
    createDatetime: string;
}