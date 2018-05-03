import { fetchList, addModel,editModel,deleteModel } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'menu',
      isShowDetailDialog: false,
      routerList: [],
      list: [],
      entityList: [],
      entityTypeList: [],
      roleList: [],
      opShowType: [{
        label: '总是显示',
        key: 'show'
      },{
        label: '某些角色显示',
        key: 'roles'
      }],
    }  
  },
  methods: {
    add() {
      this.list.push({
        isNew:true,
        isPage: 1,
        entityTypeId: null,
        routerId: null,
        name: '',
        showType: 'show',
        roleIds: [],
        order: null,
        children: []
      })
    },
    addSub(row) {
      row.children.push({
        routerId: null,
        name: '',
        showType: 'show',
        roleIds: [],
      })
    },
    save(row) {
      var action = row.isNew ? addModel : editModel
      var data = {
        ...row,
        roleIds: row.roleIds ? row.roleIds.join(',') : ''
      }
      if(data.showType === 'show' || data.roleIds === 'undefined') {
        data.roleIds = ''
      }
      delete data.isNew
      delete data.showType

      data.children = JSON.stringify(data.children)

      action(this.KEY, data).then(({data})=> {
        if(row.isNew) {
          delete row.isNew
        }
        this.fetchList()
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
      })
    },
    remove(id, index) {
      deleteModel(this.KEY, id).then(({data})=> {
        this.list.splice(index, 1)
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
      })
    },
    fetchList() {
      fetchList(this.KEY).then(({data}) => {
        this.list = data.data.map(item => {
          if(item.roleIds === 'undefined') {
            item.roleIds = ''
          }
          return {
            ...item,
            showType: item.roleIds ? 'roles' : 'show',
            roleIds: item.roleIds ? item.roleIds.split(',') : [],
            children: item.children ? JSON.parse(item.children) : []
          }
        })
      })
    },
    filterRouteListByType(entityTypeId) {
      if(!entityTypeId) {
        return []
      }
      // 筛选所有 parentId 是 xxx 的entity
      var subEntityKeys = this.entityList
        .filter(item => item.parentId === entityTypeId)
        .map(item => item.key)
      // 筛选手 entity 
      var res = this.routerList.filter(router => {
        return subEntityKeys.indexOf(router.entityId) !== -1
      })
      return res
    },
    move(row, index, action) {
      var changeIndex = action === 'up' ? index - 1 : index + 1
      var data = row.children
      row.children = data.map((item, currIndex) => {
        if(currIndex === index) {
          return data[changeIndex]
        } else if(currIndex === changeIndex) {
          return data[index]
        } else {
          return item
        }
      })
    },
  },
  mounted() {
    Promise.all([
      fetchList('role'),
      fetchList('router'),
      fetchList('entity'),
      fetchList('entityType'),
    ]).then( datas=> {
      this.roleList = datas[0].data.data
      this.entityList = datas[2].data.data
      this.entityTypeList = datas[3].data.data

      this.routerList = datas[1].data.data.map(item => {
        var entity = this.entityList.filter(entity => item.entityId === entity.key)[0]
        var entityType = entity.parentId ? this.entityTypeList.filter(item => item.id === entity.parentId)[0] : false

        var defaultRouterPath
        if(!item.type || item.type.indexOf('common') === -1) {
          defaultRouterPath = `${entityType ? `/${entityType.key}` : ''}/${item.entityId}/${item.type === 'list' ? 'list' : 'update/:id'}`
        } else {
          defaultRouterPath = `/common
          ${entityType ? `/${entityType.key}` : ''}
          /${item.entityId}
          /${item.type.replace('common-', '') === 'list' ? 'list' : ':actionName/:id'}`.replace(/\s/g, '')
        }
        // consol
        return {
          entityId: item.entityId,
          key: item.id,
          label: item.routerPath || defaultRouterPath
        } 
      })
      
      this.fetchList()
    })
  }
}