import JEditItem from '@/components/edit-item'
import deepClone from 'clone'
import {fetchList, fetchModel, addModel, editModel} from '@/service/api' 
export default {
  components: {
    'j-edit-item': JEditItem,
  },
  data() {
    return {
      KEY: 'listPage',
      activeTab: this.$route.params.id == -1 ? 'basic' : 'cols',
      model: {
        basic: {},
        cols: [],
        operate: {
          add: {
            isShow: true,
          },
          edit: {
            isShow: true
          },
          detail: {
            isShow: true
          },
          delete: {
            isShow: true
          }
        },
        searchCondition: [],
        fn: this.$store.state.utilFns.map(item => {
          return {
            ...item,
            args: item.args.map(arg => {return {name: arg}})
          }
        }),
      },
      opList: [],
      opDict: {
        'add': '新增',
        'edit': '编辑',
        'detail': '详情',
        'delete': '删除',
      },
      opShowType: [{
        label: '显示',
        key: 'show'
      },{
        label: '隐藏',
        key: 'hide'
      }, {
        label: '某些角色显示',
        key: 'roles'
      }],
      searchConditionDataType: [{
        label: '字符串',
        key: 'string'
      },{
        label: '下拉',
        key: 'select'
      }],
      searchConditionDataSourceType: [{
        label: '字典',
        key: 'dict'
      },{
        label: '实体',
        key: 'entities'
      }],
      isShowEditArgsDialog: false,
      currFn: {},
      dictList: [],
      entityList: [],
      entityTypeList: [],
      roleList: [],
    }
  },
  methods: {
    getShowType(data) {
      if(data === true) {
        return 'show'
      } else if (data === false) {
        return 'hide'
      } else {// 数组
        return 'roles'
      }
    },
    getDataResource(type) {
      return type === 'dict' 
        ? [...this.dictList]
        : [...this.entityList]
    },
    move(key, index, action) {
      var changeIndex = action === 'up' ? index - 1 : index + 1
      var data =  key === 'args' ? this.currFn.args : this.model[key]
      var res = data.map((item, currIndex) => {
        if(currIndex === index) {
          return data[changeIndex]
        } else if(currIndex === changeIndex) {
          return data[index]
        } else {
          return item
        }
      })

      key === 'args' ? (this.currFn.args = res) : (this.model[key] = res)

    },
    editArgs(currFn) {
      this.currFn = currFn
      this.isShowEditArgsDialog = true
    },
    save() {
      var model = deepClone(this.model)
      model.fn = model.fn.filter(item => {
        return item.name.indexOf('sys') === -1
      }).map(item => {
        return {
          ...item,
          args: item.args.map(arg => arg.name)
        }
      })
      model.basic = model.basic || {}
      model.cols = model.cols || []
      model.operate = model.operate || {}
      model.searchCondition = model.searchCondition || []
      model.fn = model.fn || []

      var method = this.$route.params.id == -1 ? addModel : editModel
      method(this.KEY, model).then(()=> {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.$router.go(-1)
      })
    },
    fetchDetail() {
      fetchModel(this.KEY, this.$route.params.id).then(({data}) => {
        const pagesConfig = data.data
        var model = deepClone(pagesConfig)
        model.basic = model.basic
        model.cols = model.cols
        model.operate = model.operate
        model.searchCondition = model.searchCondition
        model.fn = model.fn
        // 操作列表
        this.opList = Object.keys(model.operate).map(opKey => {
          const item = model.operate[opKey]
          const showType = this.getShowType(item.isShow)
          const showRoles = showType === 'roles' ? item.isShow : []
          return {
            label: this.opDict[opKey],
            showType,
            showRoles
          }
        })
        // 标准化cols数据
        model.cols = model.cols || []
        model.cols = model.cols.map(item => {
          return {
            ...item,
            formatFn: item.formatFn || null, 
          }
        })
        // 标准化搜索条件数据
        model.searchCondition = model.searchCondition || []
        model.searchCondition = model.searchCondition.map(item => {
          return {
            ...item,
            dataType: item.dataType || 'string',
            dataSource: item.dataSource || {
              type: '',
              key: ''
            },
          }
        })
        // 标准化函数数据
        model.fn = model.fn || []
        model.fn = model.fn.map(item => {
          return {
            ...item,
            args: item.args.map(arg => {return {name: arg}})
          }
        })

        // 添加内置函数
        model.fn = model.fn.concat(this.$store.state.utilFns.map(item => {
          return {
            ...item,
            args: item.args.map(arg => {return {name: arg}})
          }
        }))

        this.model = model
      })
    }
  },
  mounted() {
    Promise.all([
      fetchList('dict'),
      fetchList('role'),
      fetchList('entityType'),
      fetchList('entity')
    ]).then( datas=> {
      this.dict = datas[0].data.data
      this.roleList = datas[1].data.data
      this.entityTypeList = datas[2].data.data
      this.entityList = datas[3].data.data
      if(this.$route.params.id == -1) { // 新增
        let model = this.model
        this.opList = Object.keys(model.operate).map(opKey => {
          const item = model.operate[opKey]
          const showType = this.getShowType(item.isShow)
          const showRoles = showType === 'roles' ? item.isShow : []
          return {
            label: this.opDict[opKey],
            showType,
            showRoles
          }
        })
        return
      }
      this.fetchDetail()
    })

    

  }
}