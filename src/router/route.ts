import {createRouter, createWebHashHistory, RouteLocationNormalizedLoaded} from "vue-router";
import SearchPage from "@/pages/SearchPage.vue";
import UserPage from "@/pages/UserPage.vue";
import IndexPage from "@/pages/IndexPage.vue";
import UserEditPage from "@/pages/UserEditPage.vue";
import SearchResultPage from "@/pages/SearchResultPage.vue";
import UserLogin from "@/pages/UserLoginPage.vue";
import BasicLayout from "@/layout/BasicLayout.vue";
import TeamPage from "@/pages/TeamPage.vue";
import {useUserStore} from "@/stores/UserLoginState";
import TeamCreatePage from "@/pages/TeamCreatePage.vue";
import TeamUpdatePage from "@/pages/TeamUpdatePage.vue";

const routes = [
    {path: '/user/login', component: UserLogin, meta: {title: '登录'}},

    {path: "/search", component: SearchPage,},

    {path: "/search/tags", component: SearchResultPage,},

    {path: '/', redirect: '/home'},

    {
        path: "/",
        component: BasicLayout,
        children: [
            {path: "home", component: IndexPage, meta: {title: '首页'}},
            {path: "team", component: TeamPage, meta: {title: '组队'}},
            {path: "team/create", component: TeamCreatePage, meta: {title: '创建队伍'}},
            {
                path: "team/update",
                component: TeamUpdatePage,
                meta: {title: '修改队伍'},
                props: (route: RouteLocationNormalizedLoaded) => ({
                    teamId: route.query.teamId as string | null
                })
            },
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