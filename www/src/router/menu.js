import {menuConfig} from '@/setting'

// 路由配置
var routes = [
  {
    path: '/basic/:type',
    component: resolve => {
      lazyLoading(resolve, 'basic', true)
    },
  },
  {
    path: '/entity/list/:type',
    component: resolve => {
      lazyLoading(resolve, 'entity/List')
    },
  },
  {
    path: '/entity/entity/update/:id',
    component: resolve => {
      lazyLoading(resolve, 'entity/entity/Update')
    },
  },
  {
    path: '/page/list/:type',
    component: resolve => {
      lazyLoading(resolve, 'page', true)
    },
  },
  {
    path: '/page/listPage/update/:id',
    component: resolve => {
      lazyLoading(resolve, 'page/listPage/Update')
    },
  },
  {
    path: '/page/updatePage/update/:id',
    component: resolve => {
      lazyLoading(resolve, 'page/updatePage/Update')
    },
  },
  {
    path: '/menu/list',
    component: resolve => {
      lazyLoading(resolve, 'menu/menu/List')
    },
  },
]


function addRoute(filePath, routePath) {
  routes.push({
    path: routePath,
    component: resolve => {
      lazyLoading(resolve, filePath)
    }
  })
}


const lazyLoading = (resolve, name, index = false) => {
  require.ensure([], function(require) {
    resolve(require(`@/views/${name}${index ? '/Index' : ''}.vue`));
  })
}

export default routes
