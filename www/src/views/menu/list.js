import { fetchList, addModel,editModel,deleteModel } from '@/service/api'

export default {
  data() {
    return {
      KEY: 'menu',
      isShowDetailDialog: false,
      routerList: [],
      list: [],
      parentList: [{
                    key: '',
                    label: '顶级'
                  }],
      roleList: [],
      opShowType: [{
        label: '总是显示',
        key: 'show'
      },{
        label: '某些角色显示',
        key: 'roles'
      }],
    }  
  },
  methods: {
    add() {
      this.list.push({
        isNew:true,
        routerId: '',
        name: '',
        parentId: '',
        showType: 'show',
        roleIds: [],
        order: null
      })
    },
    save(row) {
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
    },
    fetchList() {
      fetchList(this.KEY).then(({data}) => {
        this.list = data.data.map(item => {
          if(item.roleIds === 'undefined') {
            item.roleIds = ''
          }
          return {
            ...item,
            showType: item.roleIds ? 'roles' : 'show',
            roleIds: item.roleIds ? item.roleIds.split(',') : []
          }
        })
        // 菜单只支持两级
        this.parentList = [{
                    id: '',
                    name: '顶级'
                  }].concat(this.list.filter(item => !item.parentId))
      })
    }
  },
  mounted() {
    Promise.all([
      fetchList('role'),
      fetchList('router')
    ]).then( datas=> {
      this.roleList = datas[0].data.data
      this.routerList = datas[1].data.data.map(item => {
        var defaultRouterPath = `/${item.entityId}/${item.type === 'list' ? 'list' : 'update/:id'}`
        return {
          key: item.id,
          label: item.routerPath || defaultRouterPath
        } 
      })
      
      this.fetchList()
      
    })
  }
}