import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Chat from '../views/Chat.vue';
import Favorites from '../views/Favorites.vue';
import Account from '../views/Account.vue';
import Login from '../views/Login.vue';
import Cocktail from '../views/Cocktail.vue';

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

function isAuthenticated() {
    return !!localStorage.getItem('token');
  }
  
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated()) {
        next({ name: 'Login' });
      } else {
        next();
      }
    } else {
      next();
    }
  });

export default router;
