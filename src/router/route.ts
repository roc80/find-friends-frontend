import {createRouter, createWebHashHistory} from "vue-router";
import SearchPage from "@/pages/SearchPage.vue";
import UserPage from "@/pages/UserPage.vue";
import IndexPage from "@/pages/IndexPage.vue";
import UserEditPage from "@/pages/UserEditPage.vue";
import SearchResultPage from "@/pages/SearchResultPage.vue";
import UserLogin from "@/pages/UserLogin.vue";
import BasicLayout from "@/layout/BasicLayout.vue";

const routes = [
    {path: '/user/login', component: UserLogin},
    {path: '/', redirect: '/home'},
    {
        path: "/",
        component: BasicLayout,
        children: [
            {path: "home", component: IndexPage},
            {path: "search", component: SearchPage},
            {path: "user", component: UserPage},
            {path: "user/edit", component: UserEditPage, meta: {title: '修改用户信息'}},
            {path: "search/tags", component: SearchResultPage, meta: {title: '根据标签查询用户'}},
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router