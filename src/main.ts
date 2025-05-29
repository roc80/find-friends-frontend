import {createApp} from 'vue'
import * as Vant from 'vant'
import "vant/lib/index.css";
import App from "@/App.vue";
import router from "@/router/route";
import {createPinia} from "pinia";
import {initUserState} from "@/stores/UserLoginState";

const app = createApp(App);
const pinia = createPinia();

// TODO@lp 上线前改为按需引入
app.use(Vant);

app.use(pinia)
// 初始化用户状态
try {
    await initUserState();
    console.log('用户状态初始化完成');
} catch (error) {
    console.error('用户状态初始化失败', error);
}


app.use(router)
app.mount('#app');
