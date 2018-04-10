import standardizeMenu from '@/assets/utils/standardize-menu-config'
var HOST
var useFEMock = false

HOST = 'http://127.0.0.1:8002'

export var SERVER_PREFIX = `${HOST}`

// 基础数据
import roles from './base/roles.js'
export var rolesConfig = roles
import dict from './base/dict.js'
export var dictConfig = dict
import entities from './base/entities.js'
export var entitiesConfig = entities
import navMenu from './base/nav-menu.js'
export var navMenuConfig = navMenu
import uitlFns from './base/util-fns.js'
export var uitlFnsConfig = uitlFns
import listPages from './base/list-pages.js'
export var listPagesConfig = listPages
import updatePages from './base/update-pages.js'
export var updatePagesConfig = updatePages

// 页面
var _menuConfig = [
  {
    id: 'dashboard',
    name: '仪表盘',
    pages: [{
      type: 'dashboard',
      filePath: 'dashboard',
      routePath: 'dashboard'
    }]
  },
  {
    id: 'generator',
    name: '代码生成器',
    children: [{
      id: 'roles',
      name: '角色',
    },
    {
      id: 'dict',
      name: '字典',
    },
    {
      id: 'entities',
      name: '实体',
    },
    {
      id: 'listPage',
      name: '生成列表页',
    },{
      id: 'updatePage',
      name: '生成编辑页',
    },]
  }
]

export const urls = {
}

const DEFAULT_PAGES = [{
  type: 'list'
},{
  type: 'update'
},{
  type: 'view'
},]


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



