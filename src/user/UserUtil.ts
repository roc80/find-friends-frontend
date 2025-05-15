import myAxios from "@/utils/myAxios";

const fetchUserInfo = async () => await myAxios.get('/user/current')

export function parseTags(tags?: string | null): string[] {
    if (!tags || tags.trim() === '') return [];
    try {
        return JSON.parse(tags);
    } catch (e) {
        console.error('Error parsing tags:', e);
        return [];
    }
}

export default fetchUserInfo
