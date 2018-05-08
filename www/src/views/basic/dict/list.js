import { fetchList, addModel,editModel,deleteModel,syncModel } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'dict',
      isShowDetailDialog: false,
      currData: [],
      list: []
    }  
  },
  methods: {
    showItems(row) {
      this.currData = row.value
      this.isShowDetailDialog = true
    },
    add() {
      this.list.push({
        isNew:true,
        key: '',
        label: '',
        value: []
      })
    },
    sync() {
      syncModel(this.KEY).then(({data})=> {
        this.$message({
          showClose: true,
          message: '同步成功',
          type: 'success'
        })
      })
    },
    save(row) {
      var action = row.isNew ? addModel : editModel
      var data = {...row}
      // data.value = data.value.filter(item => item.key !== '' && item.label !== '')
      data.value = JSON.stringify(data.value)
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
    fetchList(this.KEY).then(({data}) => {
      this.list = data.data
    })
  }
}