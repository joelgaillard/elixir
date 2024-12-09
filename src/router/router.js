import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Chat from '../views/Chat.vue';
import Favorites from '../views/Favorites.vue';
import Account from '../views/Account.vue';
import Login from '../views/Login.vue';
import Cocktail from '../views/Cocktail.vue';
import { isAuthenticated } from '../store/user';
import { is } from 'quasar';

const routes = [
    {
        path: '/',
        alias: '/cocktails',
        name: 'Home',
        component: Home,
    },
    {
        path: '/cocktails/:id',
        name: 'Cocktail',
        component: Cocktail,
        props: true
        
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: Favorites,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/account',
        name: 'Account',
        component: Account,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
  // Vérifie si la route nécessite une authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Vérifie si l'utilisateur est authentifié
    if (!isAuthenticated.value) {
      next({ name: 'Login' });
    } else {
      // Continue la navigation si authentifié
      next();
    }
  } else {
    // Continue la navigation si la route ne nécessite pas d'authentification
    next();
  }
});

export default router;
