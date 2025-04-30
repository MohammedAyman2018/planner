
export default defineNuxtRouteMiddleware((to, from) => {
    try {
        const authToken = useCookie('auth_token')

        if (!authToken.value) {
            return navigateTo('/login')
        }

        return true
    } catch (error) {
        console.error('Auth middleware error:', error)
        return navigateTo('/login')
    }
})