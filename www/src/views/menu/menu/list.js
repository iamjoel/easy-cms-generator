import { fetchList, addModel,editModel,deleteModel,syncModel, syncStauts } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'menu',
      isShowDetailDialog: false,
      routerList: [],
      list: [],
      entityList: [],
      entityTypeList: [],
      canSelectedEntityTypeList: [],
      roleList: [],
      opShowType: [{
        label: '总是显示',
        key: 'show'
      },{
        label: '某些角色显示',
        key: 'roles'
      }],
      isSynced: false
    }  
  },
  methods: {
    add() {
      this.list.push({
        hasChanged: true,
        isNew:true,
        isPage: 1,
        entityTypeId: null,
        routerId: null,
        name: '',
        showType: 'show',
        roleIds: [],
        order: this.list.length + 1,
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
    sync() {
      syncModel(this.KEY).then(({data})=> {
        this.$message({
          showClose: true,
          message: '同步成功',
          type: 'success'
        })
        this.isSynced = true
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

      action(this.KEY, data).then(({data})=> {
        if(row.isNew) {
          delete row.isNew
        }
        row.hasChanged = false
        this.fetchList()
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.isSynced = false
      })
    },
    remove(id, index) {
      this.$confirm(`确认删除菜单?`,  {
        type: 'warning'
      }).then(() => {
        deleteModel(this.KEY, id).then(({data})=> {
          this.list.splice(index, 1)
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.isSynced = false
        })
      }).catch(() => {})
      
    },
    removeSub(row, index, name) {
      this.$confirm(`确认删除: ${name}?`,  {
        type: 'warning'
      }).then(() => {
        row.children.splice(index, 1)
      }).catch(() => {})
    },
    fetchList() {
      return new Promise((resolve, reject) => {
        fetchList(this.KEY).then(({data}) => {
          this.list = data.data.map(item => {
            if(item.roleIds === 'undefined') {
              item.roleIds = ''
            }
            return {
              ...item,
              showType: item.roleIds ? 'roles' : 'show',
              roleIds: item.roleIds ? item.roleIds.split(',') : [],
              children: item.children || [],
              hasChanged: false
            }
          })
          resolve()
        })
      })
      
    },
    filterRouteListByType(entityTypeId) {
      if(!entityTypeId) {
        return []
      }
      // 筛选所有 parentId 是 xxx 的entity
      var subEntityIds = this.entityList
        .filter(item => item.basic.entityTypeId === entityTypeId)
        .map(item => item.id)
      // 筛选手 entity 
      var res = this.routerList.filter(router => {
        return subEntityIds.indexOf(router.entityId) !== -1
      })
      return res
    },
    move(row, index, action) {
      var changeIndex = action === 'up' ? index - 1 : index + 1
      var data = row.children
      row.hasChanged = true
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
    getEntityTypeList(entityTypeId) {
      return [
        this.entityTypeList.filter(item => item.id === entityTypeId)[0],
        ...this.canSelectedEntityTypeList
      ].filter(item => item)
    }
  },
  mounted() {
    syncStauts().then(({data}) => {
      this.isSynced = data.data[this.KEY]
    })
    Promise.all([
      fetchList('role'),
      fetchList('router'),
      fetchList('entity'),
      fetchList('entityType'),
      fetchList(this.KEY)
    ]).then( datas=> {
      this.roleList = datas[0].data.data
      this.entityList = datas[2].data.data
      this.entityTypeList = datas[3].data.data

      this.routerList = datas[1].data.data


      
      this.fetchList().then(() => {
        var usedEntityType = this.list.map(item => item.entityTypeId)
        // 剔除用过的
        this.canSelectedEntityTypeList = this.entityTypeList
          .filter(item => usedEntityType.indexOf(item.id) === -1)
      })
    })
  }
}