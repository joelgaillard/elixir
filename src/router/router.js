import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Chat from '../views/Chat.vue';
import Favorites from '../views/Favorites.vue';
import Account from '../views/Account.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Cocktail from '../views/Cocktail.vue';
import ChatRoom from '../views/ChatRoom.vue';

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
    },
    {
        path: '/chat/:id',
        name: 'ChatRoom',
        component: ChatRoom,
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: Favorites,
        },
    {
        path: '/account',
        name: 'Account',
        component: Account,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
