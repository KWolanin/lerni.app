import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const user = await getCurrentUser()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isLoginPage = to.path === '/login'

    if (requiresAuth && !user) {
      next({ path: '/login' })
    } else if (isLoginPage && user) {
      next({ path: '/' })
    } else {
      next()
    }
  })

  function getCurrentUser() {
    return new Promise((resolve, reject) => {
      const auth = getAuth()
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe()
        resolve(user)
      }, reject)
    })
  }


  return Router;
});
