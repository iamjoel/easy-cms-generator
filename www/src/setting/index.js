import standardizeMenu from '@/assets/utils/standardize-menu-config'
var HOST
var useFEMock = false

// HOST = 'http://127.0.0.1:8002'
HOST = 'http://192.168.2.109:8002'

export var SERVER_PREFIX = `${HOST}`

// 基础数据
import navMenu from './base/nav-menu.js'
export var navMenuConfig = navMenu
import uitlFns from './base/util-fns.js'
export var uitlFnsConfig = uitlFns

// 页面
var _menuConfig = [{
    id: 'dashboard',
    name: '基本信息',
    pages: [{
      type: 'dashboard',
      filePath: 'dashboard',
      routePath: '/'
    }]
  },
  {
    id: 'basic',
    name: '基础数据',
    children: [{
      id: 'roles',
      name: '角色',
    },
    {
      id: 'dict',
      name: '字典',
    },
    {
      id: 'entity',
      name: '实体',
    }]
  },
  {
    id: 'page',
    name: '页面',
    children: [{
    id: 'listPage',
    name: '生成列表页',
    }, {
      id: 'updatePage',
      name: '生成编辑页',
    },]
  },
  {
    id: 'router-menu',
    name: '路由和菜单',
    children: [{
      id: 'router',
      name: '路由',
    },
    {
      id: 'menu',
      name: '菜单',
    },]
  },
]

export const urls = {
}

const DEFAULT_PAGES = [{
  type: 'list'
}, {
  type: 'update'
}, {
  type: 'view'
}, ]


// 标准化
export var menuConfig = standardizeMenu(_menuConfig, DEFAULT_PAGES, urls, SERVER_PREFIX)
console.log(menuConfig)
// 接口地址

// 权限值
export const LIMIT_KEY = {
  'ADD': 1,
  'EDIT': 2,
  'DELETE': 4,
  'LIST': 8,
  'QUERY': 16,
  'ADUIT': 32,
}

export const ERROR_CODE_MAP = {
  19: '没有权限'
}
