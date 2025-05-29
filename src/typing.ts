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
    tags?: string;
};

export type CommonResponse<T> = {
    code: number;
    message: string;
    description: string;
    data: T | null;
    dateTime: Date;
};

export type TeamCreateRequest = {
    name: string;
    description?: string;
    joinKey?: string;
    maxNum: number;
    joinType: TeamJoinType;
}

export type Team = {
//         val id: Long? = null,
    id: number;
//         val name: String? = null,
    name: string;
//         val description: String? = null,
    description?: string;
//         val maxNum: Int? = null,
    maxNum: number;
//         val ownerUserId: Long? = null,
    ownerUserId: number;
//         val joinType: TeamTypeEnum? = null,
    joinType: TeamJoinType;
//         val createDatetime: Date? = null,
    createDatetime: Date;
//         val members: List<UserDTO>? = null
    members: User[];
};