import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import store from "./store";
const app = createApp(App);

import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday"; //加載外掛
import "dayjs/locale/zh-tw"; //加載語言套件

dayjs.locale("zh-tw");
app.config.globalProperties.$dayjs = dayjs.extend(weekday);

import mitt from "mitt";
app.config.globalProperties.$emitter = mitt();

app.use(store);
app.mount("#app");
