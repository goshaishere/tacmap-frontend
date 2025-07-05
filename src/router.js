import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from './store/auth'
import { storeToRefs } from 'pinia'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({ name: 'Login' })
    } else if ((to.name === 'Login' || to.name === 'Register') && auth.isAuthenticated) {
        next({ name: 'Home' })
    } else {
        next()
    }
})

export default router