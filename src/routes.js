import Home from './pages/Home.vue'
import Map from './pages/Map.vue'
import Settings from './pages/Settings.vue'
import NotFound from './pages/NotFound.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'

export default [
    { path: '/login', component: Login, name: 'Login', meta: { layout: 'auth', title: 'Вход' } },
    { path: '/register', component: Register, name: 'Register', meta: { layout: 'auth', title: 'Регистрация' } },
    { path: '/', component: Home, name: 'Home', meta: { title: 'Главная', requiresAuth: true } },
    { path: '/map', component: Map, name: 'Map', meta: { title: 'Карта', requiresAuth: true } },
    { path: '/settings', component: Settings, name: 'Settings', meta: { title: 'Настройки', requiresAuth: true } },
    {
        path: '/profile',
        component: () =>
            import ('./pages/Profile.vue'),
        name: 'Profile',
        meta: { title: 'Профиль', requiresAuth: true }
    },
    {
        path: '/tasks',
        component: () =>
            import ('./pages/Tasks.vue'),
        name: 'Tasks',
        meta: { title: 'Задачи', requiresAuth: true }
    },
    {
        path: '/help',
        component: () =>
            import ('./pages/Help.vue'),
        name: 'Help',
        meta: { title: 'Помощь' }
    },
    {
        path: '/messages',
        component: () =>
            import ('./pages/Messages.vue'),
        name: 'Messages',
        meta: { title: 'Сообщения', requiresAuth: true }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: '404' } },
]