import { fetchList, addModel, editModel, deleteModel } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'dict',
      isShowDetailDialog: false,
      currRow: {},
      currData: [],
      list: [],
    }  
  },
  methods: {
    showItems(row) {
      this.currRow = row
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
    save(row) {
      var action = row.isNew ? addModel : editModel
      var data = {...row}
      data.value = data.value.map(item => {
        return {
          ...item,
          // 后台的字典子项目，如果数字的，就不是字符串的。
          key: /^\d+$/.test(item.key) ? parseInt(item.key) : item.key
        }
      })
      // todo 改成数字
      delete data.isNew
      action(this.KEY, data).then(({data})=> {
        if(row.isNew) {
          delete row.isNew
        }
        fetchList(this.KEY).then(({data}) => {
          this.list = data.data
        })
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })

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
        })
      }).catch(() => {})
      
    },
    removeSubItem(index) {
      this.currRow.hasChanged = true
      this.currData.splice(index, 1)
    }
  },
  mounted() {
    fetchList(this.KEY).then(({data}) => {
      this.list = data.data.map(item =>{
        return {
          ...item,
          hasChanged: false
        }
      })
    })
  }
}