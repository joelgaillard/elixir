import { createApp } from 'vue'
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/dist/quasar.css';
import '@fortawesome/fontawesome-free/css/all.css'; // Importer les styles de Font Awesome
import './assets/base.css';
import './assets/global-styles.css'; // Importer les styles globaux
import App from './App.vue'
import router from './router/router'

const app = createApp(App)

app.use(Quasar, {
  plugins: {},
})

app.use(router)
app.mount('#app')