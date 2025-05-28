import {createRouter, createWebHashHistory} from "vue-router";
import SearchPage from "@/pages/SearchPage.vue";
import UserPage from "@/pages/UserPage.vue";
import IndexPage from "@/pages/IndexPage.vue";
import UserEditPage from "@/pages/UserEditPage.vue";
import SearchResultPage from "@/pages/SearchResultPage.vue";
import UserLogin from "@/pages/UserLogin.vue";
import BasicLayout from "@/layout/BasicLayout.vue";
import TeamPage from "@/pages/TeamPage.vue";
import {useUserStore} from "@/stores/user";

const routes = [
    {path: '/user/login', component: UserLogin, meta: {title: '用户登录'}},

    {path: "/search", component: SearchPage, meta: {title: '搜索用户'}},

    {path: "/search/tags", component: SearchResultPage, meta: {title: '查询结果'}},

    {path: '/', redirect: '/home'},

    {
        path: "/",
        component: BasicLayout,
        children: [
            {path: "home", component: IndexPage, meta: {title: '首页'}},
            {path: "team", component: TeamPage, meta: {title: '组队'}},
            {path: "user", component: UserPage, meta: {title: '我的'}},
            {path: "user/edit", component: UserEditPage, meta: {title: '修改个人信息'}},
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(async (to, _, next): Promise<void> => {
    const userStore = useUserStore();
    if (to.path === '/user/login') {
        if (userStore.isAuthenticated) {
            const redirect = to.query.redirect as string;
            if (redirect) {
                next(redirect);
            } else {
                next('/');
            }
            return;
        }
        next();
        return;
    }
    if (userStore.isAuthenticated) {
        next();
    } else {
        next({
            path: '/user/login',
            query: {redirect: to.path}
        });
    }
});

export default router