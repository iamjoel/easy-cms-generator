import { fetchList, addModel,editModel,deleteModel,syncModel, syncStauts } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'entityType',
      listPage: [],
      updatePage: [],
      entityList: [],
      entityTypeList: [],
      isSynced: false
    }  
  },
  methods: {
    add() {
      this.entityTypeList.push({
        isNew:true,
        key: '',
        label: '',
        order: this.entityTypeList.length + 1,
        children: []
      })
    },
    save(row) {
      var action = row.isNew ? addModel : editModel
      var data = {...row}
      delete data.isNew
      action(this.KEY, data).then(({data})=> {
        if(row.isNew) {
          delete row.isNew
        }
        row.hasChanged = false
        this.reloadList()
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
      })
    },
    remove(id, index) {
      this.$confirm(`确认删除: ${this.entityTypeList[index].label}?`,  {
        type: 'warning'
      }).then(() => {
        deleteModel(this.KEY, id).then(({data})=> {
          this.entityTypeList.splice(index, 1)
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    addEntity(row, parentId) {
      row.push({
        isNew:true,
        key: '',
        label: '',
        parentId,
        order: row.length > 0 
          ? (row[row.length -1].order + 1) 
          : null
      })
    },
    saveEntity(row) {
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

      action('entity', data).then(({data})=> {
        if(row.isNew) {
          delete row.isNew
        }
        row.hasChanged = false
        this.reloadList()
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.isSynced = false
      })
    },
    removeEntity(id, index, label) {
      this.$confirm(`确认删除: ${label}?`,  {
        type: 'warning'
      }).then(() => {
        deleteModel('entity', id).then(({data})=> {
          this.reloadList()
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.isSynced = false
        })
      })
    },
    getEntityList(parentId) {
      return this.entityList.filter(item => item.parentId === parentId)
    },
    sync() {
      syncModel('entity').then(({data})=> {
        this.$message({
          showClose: true,
          message: '同步成功',
          type: 'success'
        })
        this.isSynced = true
      })
    },
    reloadList() {
      Promise.all([
        fetchList('entity'),
        fetchList('entityType'),
      ]).then( datas => {
        this.entityList =  datas[0].data.data.map(item => {
          return {
            ...item,
            listPage: this.listPage.filter(page => page.basic && page.basic.entity === item.key)[0],
            updatePage: this.updatePage.filter(page => page.basic && page.basic.entity === item.key)[0],
          }
        })

        this.entityTypeList = datas[1].data.data.map(item => {
          return {
            ...item,
            children: this.entityList.filter(entity => entity.parentId === item.id)
          }
        })
      })
    }
  },
  mounted() {
    syncStauts().then(({data}) => {
      this.isSynced = data.data[this.KEY]
    })

    Promise.all([
      fetchList('listPage'),
      fetchList('updatePage'),
      fetchList('entityType'),
      fetchList('entity'),
    ]).then( datas => {
      this.listPage = datas[0].data.data
      this.updatePage = datas[1].data.data

     this.entityList = datas[3].data.data.map(item => {
        return {
          ...item,
          listPage: this.listPage.filter(page => page.basic && page.basic.entity === item.key)[0],
          updatePage: this.updatePage.filter(page => page.basic && page.basic.entity === item.key)[0],
        }
      })
      this.entityTypeList = datas[2].data.data.map(item => {
        return {
          ...item,
          children: this.entityList.filter(entity => entity.parentId === item.id)
        }
      })

      
    })
  }
}