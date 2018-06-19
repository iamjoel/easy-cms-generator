import { fetchList, addModel, editModel, deleteModel, syncModel, syncStauts } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'entity',
      list: [],
      parentList: [],
      isSynced: false
    }  
  },
  methods: {
    add() {
      this.list.push({
        isNew:true,
        key: '',
        label: '',
        parentId: null,
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
      delete data.isNew
      action(this.KEY, data).then(({data})=> {
        if(this.$route.params.typeId) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
          fetchList(this.KEY).then(({data}) => {
            this.list = data.data
            this.$router.push('/basic/entities/list')
          })
          return
        }
        if(row.isNew) {
          delete row.isNew
        }
        row.hasChanged = false
        
        fetchList(this.KEY).then(({data}) => {
          this.list = data.data
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
  },
  mounted() {
      syncStauts().then(({data}) => {
        this.isSynced = data.data[this.KEY]
      })
      Promise.all([
        fetchList('listPage'),
        fetchList('updatePage'),
        fetchList('entityType'),
      ]).then( datas => {
        let listPage = datas[0].data.data
        let updatePage = datas[1].data.data
        this.parentList = datas[2].data.data

        fetchList(this.KEY).then(({data}) => {
          this.list = data.data.map(item => {
            return {
              ...item,
              listPage: listPage.filter(page => page.basic && page.basic.entity === item.key)[0],
              updatePage: updatePage.filter(page => page.basic && page.basic.entity === item.key)[0],
            }
          })
          if(this.$route.params.typeId) {
            this.list.unshift({
              isNew:true,
              key: '',
              label: '',
              parentId: this.$route.params.typeId,
              order: this.list.length > 0 
                  ? this.list[this.list.length - 1].order + 1
                  : 1,
              listPage: false,
              updatePage: false
            })
          }
        })

    })
    
  }
}