import myAxios from "@/utils/myAxios";
import {CommonResponse, Tag} from "@/typing";
import {ResponseCode} from "@/enums/ResponseCode";

export async function getUserTags(userId: number): Promise<Tag[]> {
    try {
        const res = await myAxios.get<CommonResponse<Tag[]>>(`/user/${userId}/tags`);
        if (res.code === ResponseCode.SUCCESS) {
            return res.data || [];
        }
        console.warn(`Failed to get user tags: ${res.message || 'Unknown error'}`, res);
        return [];
    } catch (error) {
        console.error(`Request /user/${userId}/tags failed:`, error);
        return [];
    }
}