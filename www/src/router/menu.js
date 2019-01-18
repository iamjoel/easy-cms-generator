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

  // 带实体类型id的列表
  {
    path: '/basic/entities/create/:typeId',
    component: resolve => {
      lazyLoading(resolve, 'basic/entities/List')
    },
  },
]

// 页面的路由的定义
// menuConfig.forEach(menu => {
//   var parentId = menu.id
//   if(menu.children) { // 二级菜单
//     menu.children.forEach(pageGroup => {
//       pageGroup.pages.forEach(page => {
//         addRoute(page.filePath, page.routePath)
//       })
//     })
//   } else { // 一级路由
//     menu.pages.forEach(page => {
//       addRoute(page.filePath, page.routePath)
//     })
//   }
// })

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
