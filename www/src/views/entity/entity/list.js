import { fetchList, addModel,editModel,deleteModel } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'entity',
      listPage: [],
      updatePage: [],
      entityList: [],
    }  
  },
  methods: {
    remove(id, index, label) {
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
        })
      })
    },
    reloadList() {
      fetchList('entity').then(({data}) => {
        this.entityList = data.data.map(item => {
          return {
            ...item,
            listPage: this.listPage.filter(page => page.basic && page.basic.entity === item.key)[0],
            updatePage: this.updatePage.filter(page => page.basic && page.basic.entity === item.key)[0],
          }
        })
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
    
  },
  mounted() {
    Promise.all([
      fetchList('listPage'),
      fetchList('updatePage'),
      fetchList('entity'),
    ]).then( datas => {
      this.listPage = datas[0].data.data
      this.updatePage = datas[1].data.data
      // debugger
     this.entityList = datas[2].data.data.map(item => {
        return {
          ...item,
          listPage: this.listPage.filter(page => page.basic && page.basic.entity === item.key)[0],
          updatePage: this.updatePage.filter(page => page.basic && page.basic.entity === item.key)[0],
        }
      })
    })
  }
}