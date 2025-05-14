import myAxios from "@/utils/myAxios";

const fetchUserInfo = async () => await myAxios.get('/user/current')

export default fetchUserInfo