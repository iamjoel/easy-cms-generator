import { fetchList, addModel,editModel,deleteModel,syncModel, syncStauts } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'router',
      list: [],
      entityTypeList: [],
      entityList: [],
      canSelectEntityList: [],
      typeList: [{
        key: 'list',
        label: '列表页'
      }, {
        key: 'update',
        label: '更新页'
      },{
        key: 'other',
        label: '其他'
      }, ],
      isSynced: false

    }  
  },
  methods: {
    defaultChange(item) {
      var entity = this.entityList.filter(entity => item.entityId === entity.id)[0] || {}
      var entityKey = entity.key
      var entityName = entity.label
      var entityType = entity.parentId ? this.entityTypeList.filter(item => item.id === entity.parentId)[0] : false
      var typeName = this.typeList.filter(type => item.type === type.key)[0].label
      item.namePlaceholder = `${entityName}${typeName}`

      var defalutRouterPath = `${entityType ? `/${entityType.key}` : ''}/${entityKey}/${item.type === 'list' ? 'list' : 'update/:id'}`
      item.routePathPlaceholder = defalutRouterPath

      var defaultFilePath = `${entityType ? `${entityType.key}/` : ''}${entityKey}/${item.type === 'list' ? 'List' : 'Update'}.vue`
      item.filePathPlaceholder = defaultFilePath
      
      item.entityTypeName = entityType ? entityType.label : '-'

      return item
    },
    add() {
      this.list.push({
        isNew:true,
        entityId: null,
        name: '',
        type: 'list',
        routePath: '',
        filePath: '',
        routePathPlaceholder: '',
        filePathPlaceholder: '',
        order: this.list.length > 0 
            ? this.list[this.list.length - 1].order + 1
            : 1
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
      var data = {...row}
      if(data.type !== 'other') {
        data.routePath = data.routePathPlaceholder
        data.filePath = data.filePathPlaceholder
      }
      if(data.routePath) {
        data.routePath = data.routePath.replace('.vue', '')
      }
      if(data.filePath) {
        data.filePath = data.filePath.replace('.vue', '')
      }

      delete data.namePlaceholder
      delete data.routePathPlaceholder
      delete data.filePathPlaceholder
      delete data.isNew

      action(this.KEY, data).then(({data})=> {
        if(row.isNew) {
          delete row.isNew
        }
        fetchList(this.KEY).then(({data}) => {
          this.list = data.data.map(item => this.defaultChange(item))
        })
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.isSynced = false
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
        this.isSynced = false
      })
    },
    getEntity(entityId) {
      return [
        this.entityList.filter(item => item.id === entityId)[0],
        ...this.canSelectEntityList
      ].filter(item => item)
    }
  },
  mounted() {
    syncStauts().then(({data}) => {
      this.isSynced = data.data[this.KEY]
    })
    Promise.all([
      fetchList('entityType'),
      fetchList('entity'),
      fetchList(this.KEY),
    ]).then( datas=> {
      this.entityTypeList = datas[0].data.data
      this.entityList = datas[1].data.data
      this.list = datas[2].data.data.map(item => this.defaultChange(item))


      var usedUpdateEntityKeys = this.list
          .filter(item => item.type === 'update')
          .map(item => item.entityId)
      console.log(usedUpdateEntityKeys)

      var usedListEntityKeys = this.list
        .filter(item => item.type === 'list')
        .map(item => item.entityId)
      console.log(usedListEntityKeys)

      // 用过实体的key的去掉
      this.canSelectEntityList = 
        this.entityList.filter(entity => {
          var res = 
            usedUpdateEntityKeys.indexOf(entity.id) === -1
            || usedListEntityKeys.indexOf(entity.id) === -1
          return res
        })

    })
  }
}