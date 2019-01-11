import { fetchList, addModel,editModel,deleteModel,syncModel, syncStauts } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'entityType',
      isShowDetailDialog: false,
      list: [],
      isSynced: false
    }  
  },
  methods: {
    add() {
      this.list.push({
        isNew:true,
        key: '',
        label: ''
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
        if(row.isNew) {
          delete row.isNew
        }
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
      this.$confirm(`确认删除: ${this.list[index].label}?`,  {
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
      })
    },
    fetchList() {
      fetchList(this.KEY).then(({data}) => {
        this.list = data.data
      })
    }
  },
  mounted() {
    syncStauts().then(({data}) => {
      this.isSynced = data.data[this.KEY]
    })
    this.fetchList()
  }
}