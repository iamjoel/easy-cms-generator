import JEditItem from '@/components/edit-item'
import deepClone from 'clone'
import {fetchList, fetchModel, addModel, editModel} from '@/service/api' 

export default {
  components: {
    'j-edit-item': JEditItem,
  },
  computed: {
    defaultCodePath() {
      var entity = this.entityList.filter(item => item.key === this.model.basic.entity)[0]
      var res
      if(entity) {
        let entityType = this.entityTypeList.filter(item => item.id === entity.parentId)[0]
        res = `${entityType ? entityType.key + '/' : ''}${entity.key}`
      }
      return res || ''
    },
    allColsList() {
      if(this.model.basic.entity && this.model.basic.entity.id) {
        var tarEntity = this.entityList.filter(entity => entity.id === this.model.basic.entity.id)[0]
        return tarEntity ? tarEntity.cols : []
      } else {
        return []
      }
    },
    canChooseCols() {
      if(!this.allColsList) {
        return []
      }
      return this.allColsList.filter(item => {
        var hasSelected = this.model.cols.filter(col => item.key === col.key).length > 0
        return !hasSelected
      })
    }
  },
  data() {
    return {
      KEY: 'updatePage',
      activeTab: this.$route.params.id == -1 ? 'basic' : 'cols',
      model: {
        basic: {
          entity: {}
        },
        cols: [],
        fn: this.$store.state.utilFns.map(item => {
          return {
            ...item,
            args: item.args.map(arg => {return {name: arg}})
          }
        }),
      },
      colItemTemplate: {
        label: '',
        key: '',
        dataType: 'string',
        dataSource: {
          type: 'entities',
          key: ''
        },
        imgConfig: {
          max: 5,
          tip: '建议尺寸 750 * 300'
        },
        formatFn: null,
        saveFormatFn: null,
      },
      colsDataType: [{
        key: 'string',
        label: '文字'
      },{
        key: 'text',
        label: '多行文字'
      },{
        key: 'int',
        label: '整数'
      },{
        key: 'double',
        label: '小数'
      },{
        key: 'select',
        label: '下拉'
      },{
        key: 'date',
        label: '日期'
      },{
        key: 'img',
        label: '单图'
      },{
        key: 'imgs',
        label: '多图'
      },{
        key: 'bool',
        label: '布尔值'
      },{
        key: 'price',
        label: '价格'
      },{
        key: 'password',
        label: '密码'
      },],
      isShowChooseColDialog: false,
      tempSelectedCols: [],
      isShowEditArgsDialog: false,
      isShowDataSourceDialog: false,
      dataSourceType: [{
        label: '字典',
        key: 'dict'
      },{
        label: '实体',
        key: 'entities'
      }],
      isShowImgDialog: false,
      validRuleType: [{
        key: 'required',
        label: '非空验证'
      }],
      currFn: {},
      currRow: {
        dataSource: {
          type: '',
          key: ''
        },
        imgConfig: {
          max: 5,
          tip: '建议尺寸 750 * 300'
        }
      },
      dictList: [],
      entityTypeList: [],
      canSelectEntityList: [],
      entityList: [],
    }
  },
  methods: {
    showDialog(row, key){
      this.currRow = row
      this[`isShow${key}Dialog`] = true
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
      model.isSynced = false
      model.cols = model.cols || []
      model.cols = model.cols.map(item => {
        if(item.dataType !== 'select') {
          delete item.dataSource
        }
        if(item.dataType !== 'img' && item.dataType !== 'imgs') {
          delete item.imgConfig
        }
        return item
      })

      if(!this.$isColValid(model.cols)) {
        return
      }

      model.fn = model.fn.filter(item => {
        return item.name.indexOf('sys') === -1
      }).map(item => {
        return {
          ...item,
          args: item.args.map(arg => arg.name)
        }
      })
      model.basic = model.basic || {}
      model.basic.codePath = model.basic.codePath || this.defaultCodePath
      model.cols = model.cols || []
      model.fn = model.fn || []
      var method = this.$route.params.id == -1 ? addModel : editModel
      method(this.KEY, model).then(()=> {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.$router.push('/page/list/update')
      })
    },
    generatorErrmsg(item) {
      var action
      switch(item.dataType) {
        case 'select':
        case 'bool':
          action = '选择'
          break;
        case 'img':
        case 'imgs':
          return '请上传图片'
          break;
        case 'string':
        default: 
          action = '输入'
      }
      return `请${action}${item.label}`
    },
    deepClone,
    fetchDetail() {
      return new Promise((resolve, reject) => {
        if(this.$route.params.id == -1) {
          resolve()
          return
        }
        fetchModel(this.KEY, this.$route.params.id).then(({data}) => {
          const pagesConfig = data.data

          var model = deepClone(pagesConfig)
          model.basic = model.basic
          model.cols = model.cols
          model.fn = model.fn

          model.cols = model.cols || []
          model.cols = model.cols.map(col => {
            return {
              ...deepClone(this.colItemTemplate),
              ...col
            }
          })
          model.basic = model.basic || {}
          model.fn = model.fn || []
          // 标准化函数数据
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
          resolve()
        })
      })
    },
    showChooseColDialog() {
      this.tempSelectedCols = []
      this.isShowChooseColDialog = true
    },
    chooseCols() {
      this.model.cols = this.model.cols.concat([...this.tempSelectedCols])
      this.isShowChooseColDialog = false
    },
    handleSelectedColsChange(selectedCol) {
      this.tempSelectedCols = [...selectedCol].map(item => {
        var data = {
          key: item.key,
          label: item.label,
          dataType: item.dataType,
          required: item.required,
        }
        return {
          ...deepClone(this.colItemTemplate),
          ...data
        }
      })
    }
  },
  mounted() {
    this.fetchDetail().then(() => {
      Promise.all([
        fetchList('dict'),
        fetchList('updatePage'),
        fetchList('entityType'),
        fetchList('entity')
      ]).then( datas=> {
        this.dictList = datas[0].data.data
        this.usedEntityKeys = datas[1].data.data.map(item => {
          try {
            return item.basic.entity
          } catch(e) {
            return false
          }
        }).filter(item => item)

        this.entityTypeList = datas[2].data.data
        this.entityList = datas[3].data.data
        // 用过实体的key的去掉
        this.canSelectEntityList = 
          this.entityList.filter(entity => {
            var res = 
              this.usedEntityKeys.indexOf(entity.key) === -1
              || (this.model && this.model.basic && entity.key === this.model.basic.entity)
            return res
          })

      })
    })
  }
}