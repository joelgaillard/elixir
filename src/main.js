import { createApp } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'; // Importer les styles de Font Awesome
import './assets/base.css';
import './assets/global-styles.css'; // Importer les styles globaux
import App from './App.vue'
import router from './router/router'

const app = createApp(App)

app.use(router)
app.mount('#app')