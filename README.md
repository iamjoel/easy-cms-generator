# 管理后台前端代码生产工具
该工具做的是生成，列表，新增，编辑，详情页。

## 做页面的步骤
第1步：加路由  
打开 `src/router/menu.js`。

如果是新增的一级菜单，要加配置  
```
const MENU_PREFIXS = {
  ...
  菜单key: 一级菜单值 // 这里是新增一级菜单
}
```

加页面路由配置    
```
// 路由配置
var routes = [
  // 配一组路由：列表页，新建，更新，查看详情页。
  ...addPageGroup(页面值, 一级菜单值),
  // 加一个页面
  {
    path: 页面路径,
    component: resolve => {
      lazyLoading(resolve, '一级菜单值/页面值/list|view/:id|update/:id')
    }
  }
  
]
```

第2步：侧栏菜单加新增的页面和数据权限 
如果菜单数据和权限是调接口的，让后端改。


如果菜单数据是存在前端的，改 `src/store/actions.js` 的 `fetchMenuAndLimit` 方法：
```
menu: [...,{
  "innerid": Random.guid(),
  "name": "一级菜单名",
  "icon": 'message',
  children: [{
      "innerid": Random.guid(),
      "name": "页面名",
      path: '/xxx/xxx/list',
  },]
}],
limit: {
  'limitKey1': 值,
  ...
}
```

第3步：后台接口配置  
在 setting.js 增加。
```
接口地址Key: addUrlGroup(`${SERVER_PREFIX}/xxx`)
```

第4步：列表页。

第5步：新增，编辑，详情页。

第6步：将 list.vue,list.js, update.vue, update.js 放入文件夹： `src/一级菜单/页面值` 中。











