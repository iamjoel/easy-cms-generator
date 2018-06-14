import { fetchList, addModel,editModel,deleteModel,syncModel } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'entity',
      list: [],
      parentList: [],
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
     fetchList('entityType').then(({data}) => {
      this.parentList = data.data
        fetchList(this.KEY).then(({data}) => {
          this.list = data.data
          if(this.$route.params.typeId) {
            this.list.unshift({
              isNew:true,
              key: '',
              label: '',
              parentId: this.$route.params.typeId,
              order: this.list.length > 0 
                  ? this.list[this.list.length - 1].order + 1
                  : 1
            })
          }
        })

    })
    
  }
}