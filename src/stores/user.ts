import {defineStore} from 'pinia';
import myAxios from "@/utils/myAxios";
import {showSuccessToast} from "vant";

export const defaultUserState: API.User = {
        userName: '',
        avatarUrl: '',
        userId: 0,
        gender: '',
        email: '',
        phone: '',
        userRole: '',
        createDatetime: '',
        state: '',
        tags: '',
};

interface UserState {
    userState: API.User | null;
    isLoading: boolean;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userState: null,
        isLoading: false,
    }),

    actions: {
        // 获取用户信息（从后端）
        async fetchUser() {
            this.isLoading = true;
            try {
                const res = await myAxios.get<API.CommonResponse<API.User | null>>('/user/current');
                if (res.code === 20000 && res.data) {
                    this.userState = res.data;
                    // 存储到 localStorage 以便页面刷新后恢复
                    this.saveToStorage();
                    console.log('用户信息加载成功', this.userState);
                    return true;
                } else {
                    // 如果后端返回无用户信息，清除本地存储
                    this.clearStorage();
                    this.userState = null;
                    return false;
                }
            } catch (e) {
                console.log('用户未登录或登录已过期', e);
                // 请求失败时也清除本地存储
                this.clearStorage();
                this.userState = null;
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        // 初始化用户状态（应用启动时调用）
        async initUser() {
            // 1. 先从 localStorage 恢复用户信息（避免白屏）
            this.loadFromStorage();

            // 2. 然后从后端验证用户状态
            // 如果本地有用户信息，或者需要检查登录状态，都要请求后端
            const isValid = await this.fetchUser();

            // 3. 如果后端验证失败，清除本地状态
            if (!isValid) {
                this.userState = null;
            }
        },

        // 登录成功后设置用户信息
        setUser(user: API.User) {
            this.userState = user;
            this.saveToStorage();
            console.log('用户登录成功', user);
        },

        async logout() {
            try {
                // 1. 通知后端清除 session
                const res = await myAxios.post<API.CommonResponse<boolean>>('/user/logout');
                if (res.data) {
                    console.log('后端登录状态已清除');
                } else {
                    console.error('退出登录时清除后端状态失败');
                }
            } catch (e) {
                console.error('退出登录时清除后端状态失败', e);
            } finally {
                // 即使后端请求失败，也要清除前端状态
                this.userState = null;
                this.clearStorage();
                console.log('用户已退出登录');
                showSuccessToast('退出登录成功')
            }
        },

        // 保存到本地存储
        saveToStorage() {
            if (this.userState) {
                try {
                    localStorage.setItem('userInfo', JSON.stringify(this.userState));
                } catch (e) {
                    console.error('保存用户信息到本地存储失败', e);
                }
            }
        },

        // 从本地存储加载
        loadFromStorage() {
            try {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    this.userState = JSON.parse(userInfo) as API.User;
                    console.log('从本地存储恢复用户信息', this.userState);
                }
            } catch (e) {
                console.error('从本地存储加载用户信息失败', e);
                this.clearStorage();
            }
        },

        // 清除本地存储
        clearStorage() {
            try {
                localStorage.removeItem('userInfo');
            } catch (e) {
                console.error('清除本地存储失败', e);
            }
        },
    },

    getters: {
        isAuthenticated: (state: UserState) => state.userState !== null,

        currentUser: (state: UserState) => state.userState,

        userName: (state: UserState) => state.userState?.userName || '',

        userRole: (state: UserState) => state.userState?.userRole || '',

        loading: (state: UserState) => state.isLoading,
    },
});

export const initUserState = async () => {
    const userStore = useUserStore();
    await userStore.initUser();
};