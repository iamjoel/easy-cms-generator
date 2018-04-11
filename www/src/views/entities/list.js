import { addModel,editModel,deleteModel } from '@/service/api'
import * as types from '@/store/mutation-types'
import deepClone from 'clone'

export default {
  data() {
    return {
      KEY: 'entity',
      list: deepClone(this.$store.state.entities)
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
    save(row) {
      var action = row.isNew ? addModel : editModel
      var data = {...row}
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