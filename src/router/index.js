import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import plane from '@/components/main'
import article from '@/components/article/article'
import save from '@/components/article/option/save'
import detail from '@/components/article/option/detail'
import persons from '@/components/persons/persons'
import psave from '@/components/persons/option/psave'
import pdetail from '@/components/persons/option/pdetail'
import news from '@/components/news/news'
import nsave from '@/components/news/option/save'
import ndetail from '@/components/news/option/detail'
import config from '@/components/config/config'
import upload from '@/components/upload/upload'

//import test from '@/components/cropper'
import test from '@/components/doTest'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/test',
      component: test
    },
    {
      path: '/admin',
      name: 'login',
      component: login
    },
    {
      path: '/admin/main',
      name: 'main',
      component: plane,
      children: [
        {
          path: '/admin/main/article',
          component: article
        },
        {
          path: '/admin/main/article/save',
          component: save
        },
        {
          path: '/admin/main/article/detail',
          component: detail
        },
        {
          path: '/admin/main/person',
          component: persons
        },
        {
          path: '/admin/main/person/save',
          component: psave
        },
        {
          path: '/admin/main/person/detail',
          component: pdetail
        },
        {
          path: '/admin/main/news',
          component: news
        },
        {
          path: '/admin/main/news/save',
          component: nsave
        },
        {
          path: '/admin/main/news/detail',
          component: ndetail
        },
        {
          path: '/admin/main/config',
          component: config
        },
        {
          path: '/admin/main/upload',
          component: upload
        }
      ]
    }
  ]
})
