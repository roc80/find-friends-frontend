import { createApp } from 'vue'
import * as Vant from 'vant'
import "vant/lib/index.css";
import App from "@/App.vue";
import router from "@/router/route";

const app = createApp(App);
// TODO@lp 上线前改为按需引入
app.use(Vant);

app.use(router)
app.mount('#app');
