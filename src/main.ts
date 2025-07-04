import {createApp} from 'vue'
import "vant/lib/index.css";
import App from "@/App.vue";
import router from "@/router/route";
import {createPinia} from "pinia";
import {initUserState} from "@/stores/UserLoginState";
import {setupVant} from "@/plugins/setupVant";

const app = createApp(App);
setupVant(app);
app.use(router)
app.use(createPinia());
async function bootstrap() {
    try {
        await initUserState();
        console.log("用户状态初始化完成");
    } catch (error) {
        console.error("用户状态初始化失败:", error);
    } finally {
        app.mount('#app');
    }
}

bootstrap();