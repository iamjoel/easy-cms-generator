import { fetchList, addModel,editModel,deleteModel } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'router',
      list: [],
      entityList: [],
      typeList: [{
        key: 'list',
        label: '列表页'
      }, {
        key: 'update',
        label: '更新页'
      }]
    }  
  },
  methods: {
    defaultChange(item) {
      var entityName = this.entityList.filter(entity => item.entityId === entity.key)[0].label
      var typeName = this.typeList.filter(type => item.type === type.key)[0].label
      item.namePlaceholder = `${entityName}${typeName}`

      var defalutRouterPath = `/${item.entityId}/${item.type === 'list' ? 'list' : 'update/:id'}`
      item.routePathPlaceholder = defalutRouterPath

      var defaultFilePath = `${item.entityId}/${item.type === 'list' ? 'List' : 'Update'}.vue`
      item.filePathPlaceholder = defaultFilePath
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
    fetchList('entity').then(({data}) => {
      this.entityList = data.data
      fetchList(this.KEY).then(({data}) => {
        this.list = data.data.map(item => this.defaultChange(item))
      })
    })
  }
}