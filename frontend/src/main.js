import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VSnacks from "vue-snacks";

const app = createApp(App);

app.use(VSnacks);

app.mount('#app');
