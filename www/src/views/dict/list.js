import { addModel,editModel,deleteModel } from '@/service/api'
import * as types from '@/store/mutation-types'
import deepClone from 'clone'

export default {
  data() {
    return {
      KEY: 'dict',
      isShowDetailDialog: false,
      currData: [],
      list: deepClone(this.$store.state.dict).map(item => {
        var value = item.value
        if(typeof value === 'string') {
          try {
            value = JSON.parse(value)
          } catch (e) {
            value = []
          }
        }
        return {
          ...item,
          value
        }

      })
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
  }
}