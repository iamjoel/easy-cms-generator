import { fetchList, addModel,editModel,deleteModel } from '@/service/api'
import {SERVER_PREFIX} from '@/setting'
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
    expendCofigToFile(id) {
      this.$http.post(`${SERVER_PREFIX}/entity/expendCofigToFile/${id}`).then(({data})=> {
        this.reloadList()
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success'
        })
      })
    },
    eject(id) {
      this.$confirm(`弹出操作不可逆?确认弹出`,  {
        type: 'warning'
      }).then(() => {
        this.$http.post(`${SERVER_PREFIX}/entity-eject/${id}`).then(({data})=> {
          this.reloadList()
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          })
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