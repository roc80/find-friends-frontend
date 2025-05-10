import {createRouter, createWebHashHistory} from "vue-router";
import SearchPage from "@/pages/SearchPage.vue";
import UserPage from "@/pages/UserPage.vue";
import IndexPage from "@/pages/IndexPage.vue";
import UserEditPage from "@/pages/UserEditPage.vue";

const routes = [
    {path: '/', component: IndexPage},
    {path: '/search', component: SearchPage},
    {path: '/user', component: UserPage},
    {path: '/user/edit', component: UserEditPage},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router