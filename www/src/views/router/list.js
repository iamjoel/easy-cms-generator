import { fetchList, addModel,editModel,deleteModel } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'router',
      list: [],
      entityTypeList: [],
      entityList: [],
      typeList: [{
        key: 'list',
        label: '列表页'
      }, {
        key: 'common-list',
        label: '配置的列表页'
      }, {
        key: 'update',
        label: '更新页'
      }, {
        key: 'common-update',
        label: '配置的更新页'
      }, {
        key: 'other',
        label: '其他'
      }, ]
    }  
  },
  methods: {
    defaultChange(item) {
      var entity = this.entityList.filter(entity => item.entityId === entity.key)[0]
      var entityName = entity.label
      var entityType = entity.parentId ? this.entityTypeList.filter(item => item.id === entity.parentId)[0] : false
      var typeName = this.typeList.filter(type => item.type === type.key)[0].label
      item.namePlaceholder = `${entityName}${typeName}`

      var defalutRouterPath
      if(!item.type || item.type.indexOf('common') === -1) {
        defalutRouterPath = `${entityType ? `/${entityType.key}` : ''}/${item.entityId}/${item.type === 'list' ? 'list' : 'update/:id'}`
      } else {
        defalutRouterPath = `/common
        ${entityType ? `/${entityType.key}` : ''}
        /${item.entityId}
        /${item.type.replace('common-', '') === 'list' ? 'list' : ':actionName/:id'}`.replace(/\s/g, '')
      }
      item.routePathPlaceholder = defalutRouterPath

      var defaultFilePath
      if(!item.type || item.type.indexOf('common') === -1) {
       defaultFilePath = `${entityType ? `${entityType.key}/` : ''}${item.entityId}/${item.type === 'list' ? 'List' : 'Update'}.vue`
        item.filePathPlaceholder = defaultFilePath
      } else {
        item.filePathPlaceholder = `common/ ${item.type.replace('common-', '') === 'list' ? 'List' : 'Update'}.vue`.replace(/\s/g, '')
      }
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
        filePathPlaceholder: ''
      })
    },
    save(row) {
      var action = row.isNew ? addModel : editModel
      var data = {...row}
      if(data.type.indexOf('common') !== -1) {
        data.routePath = ''
        data.filePath = ''
      } else if(data.type !== 'other') {
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
    }
  },
  mounted() {
    Promise.all([
      fetchList('entityType'),
      fetchList('entity')
    ]).then( datas=> {
      this.entityTypeList = datas[0].data.data
      this.entityList = datas[1].data.data
      fetchList(this.KEY).then(({data}) => {
        this.list = data.data.map(item => this.defaultChange(item))
      })
    })
  }
}