import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AddNode from '../views/AddNode.vue';
import Login from '../views/Login_neo4j.vue';
import QueryNode from '@/views/QueryNode.vue';
import DeleteNode from '@/views/DeleteNode.vue';
import QueryRelationship from '@/views/QueryRelationship.vue';
import test from '@/views/test_code.vue'
import AllGraph from '@/views/AllGraph.vue';

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta:{
      requireAuth: true
    }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/addnode',
    name: 'addnode',
    component: AddNode,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/querynode',
    name: 'querynode',
    component: QueryNode
  },
  {
    path: '/deletenode',
    name: 'deletenode',
    component: DeleteNode
  },
  {
    path: '/queryrelationship',
    name: 'queryrelationship',
    component: QueryRelationship
  },
  {
    path: '/test',
    name: 'test',
    component: test
  },
  {
    path: '/allgraph',
    name: 'allgraph',
    component: AllGraph
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');//获取token
  if (token || to.path === '/login') {//有token或者在login页面下通行
    next();
  } else {
    alert('无权访问');
    next('/login');
  }
})
export default router;
