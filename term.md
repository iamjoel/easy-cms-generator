# 术语
资源；资源分类；角色；菜单；写死的字典，基本配置。

## 资源
对应数据库一张表。 资源会生成 
* 生成创建表的 SQL
  * 当前资源对应的表的 SQL 语句。
  * 创建多对多的表的SQL。
* 管理后台前端的
  * 实体代码。
  * 前端路由及处理页面。
* 服务器端
  * 路由和权限及处理的 Controller 和 Service。

每个资源格式如下: 

```
{
  id: guid,
  name: '表名',
  classifyId: guid, // 分类
  classifyName: '分类', // 分类
  db: { // 表相关的配置
    pk: 'id', // 主键，默认值id
    relation: [{ // 表的关联关系。1对多，多对多。
      canEdit: true, // 是否能在管理后台中做新增和编辑。
      editName: '关联关系名称',
      field: 'xxId', // 这张表的关联字段。
      isMoreToMore: true,
      comment: '备注',
      relatedTable: { // 相关的表
        name: 'xx', // 表名
        filed: 'id'
      },
      moreFileds: [ // 多对多的情况下，添加的一些额外字段。
        {
          name: 'other',
          label: '其他字段',
          comment: '备注',
          dataType: 'other', // 数据类型
          stringLenth: '20', // 如果是字符串
          rules: [ // 验证规则
            { 
              type: 'required',
              validType: '', //什么时候验证。 all,add,edit
            },
            ...
          ]
        },
        ...
      ]
    }]
  },
  fields: [ // 字段
    {
      name: 'age',
      label: '年龄',
      comment: '备注',
      dataType: 'int', // 数据类型
      stringLenth: '20', // 如果是字符串
      rules: [ // 验证规则
        { 
          type: 'required',
          validType: '', // all,add,edit
        },
        ...
      ],
      showType: 'all', // 什么时候展示。支持： all, list(列表), detail 
    },
    ...
  ],
  feRoute: [ // 前端的路由
    { 
      type: 'list', // 支持 list, detail, add, edit, del, other（其他）
      url: '/api/表名/list', // 路径
      controllerPath: 'classifyName?/表名/List.vue' // 路径。只有在 list 和 detail 时，会选。 因为 detail, add, edit 共用同一个路由。
      searchCondition: [ // 在 list 时才能选
        { 
          name: 'name',
          label: '姓名',
          type: 'string', // string, dict, remote-dict, entity, bool
        },
        ...
      ]
    },
    ...
  ],
  serverRoute: [ // 后端路由
    {
      type: 'list', // // 支持 list, detail, add, edit, del, other（其他）
      url: '/api/表名/list', // 路径
      controllerPath: 'app/classifyName?/表名/controller.list' // 路径,
      isPublic: true, // 是公共路由，会加上 /public/表名/list 的路由
      allow: [], // 允许的角色。如果 isPublic 为true ，则无视 allow。
    },
    ...
  ],
}
```

### 数据类型(dataType)与数据库字段类型的映射
* string 。对应数据的 varchar(n)。配合下面 `stringLenth` 字段。
* text
* int
* float
* boolean -> int(0)

## 资源分类(classifyId)
分类支持一级。父级可以是空。


## 角色
角色的管理。生成
* 前端的角色定义。
* 后端的角色定义。

## 菜单
管理后台显示的菜单带权限。 菜单会生成
* 管理后台的菜单。


## 写死的字典
生成
* 前端字典
* 后端字典

## 基本配置
* 项目根路径。 `项目根路径/admin`： 管理后台前端。 `项目根路径/server`： 服务器代码。
* 存放生成代码配置文件的路径。 lowdb 需要。



