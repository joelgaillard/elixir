import { createApp } from "vue";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/base.css";
import "./assets/global-styles.css";
import App from "./App.vue";
import router from "./router/router";

const app = createApp(App);

app.use(router);
app.mount("#app");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/worker.js")
    .then(function (registration) {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch(function (error) {
      console.error("Service Worker registration failed:", error);
    });
}
