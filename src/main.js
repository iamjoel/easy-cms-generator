{
  var textFile
  var defaultForm = {
    pageKey: null,
    limitKey: null,
    isPageAndLimitSame: true,
    PAGE_PATH_PREFIX: '', // 页面前缀
  }
  new Vue({
    el: '#app',
    data: {
      download: {
        list:{
          js: null,
          vue: null
        }
      },
      currType: 'list',
      form: Object.assign({}, defaultForm),
      rules: {
        pageKey: [
          { required: true, message: '请输入页面Key', trigger: 'blur' },
        ],
        limitKey: [
          { validator: this.validLimitKey, trigger: 'blur' },
        ],
        PAGE_PATH_PREFIX: [
          { validator: this.validPathPrefix, trigger: 'blur' },
        ],
      },
      // 列表页相关的属性开始
      search: {
        isDialogVisible: false,
        editTemp: {
          label: null,
          key: null,
          // 下拉框之类的其他类型，要编辑的就多了，还不如代码写
          // type: 'text' 
        },
        content: [{label: '用户名',key: 'name'}],
      },
      list: {
        isDialogVisible: false,
        editTemp: {
          label: null,
          key: null,
          isCustomer: false
        },
        content: [{label: '用户名',key: 'name', isCustomer: true }],
      },
      
      // 新增，编辑，页相关的属性开始

    },
    methods: {
      toDownloadFormat(text) {
        console.info(text)
        var data = new Blob([text], {type: 'text/plain'})
        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile)
        }

        textFile = window.URL.createObjectURL(data)
        return textFile
      },
      addItem(type) {
        this[type].content.push(Object.assign({}, this[type].editTemp))
        this[type].editTemp = {}
        this[type].isDialogVisible = false
      },
      generatorDownload() {
        var currType = this.currType
        this.valid().then(()=> {
          var vueContent
          var jsContent
          if(currType === 'list') {
            var searchContent = this.generatorSearch()
            var listContent = this.generatorList()
            // 生成代码的美观。固定的注意缩进。
            vueContent = 
            `
<template>
  <div class="main">
    ${searchContent}
    ${listContent}
  </div>
</template>
<script src="./list.js"></script>`
            jsContent = this.generatorListJs()
          }

          this.download[currType].vue = this.toDownloadFormat(vueContent)
          this.download[currType].js = this.toDownloadFormat(jsContent)
        })

      },
      generatorSearch() {
         return `
    <j-search-condition @search="search">
      ${this.search.content.map(item => {
        var res = `
      <j-edit-item label="${item.label}">
          <el-input v-model="searchConditions.${item.key}"></el-input>
      </j-edit-item>`
        return res
      }).join('')}
    </j-search-condition>`
      },
      generatorList() {
        var customerContent = `
          <template scope="scope">
            {{scope.row}}
          </template>`
        return `
    <j-grid-box :is-show-add-btn="isShow('add')" :add-url="addPagePath" :pager="pager" @pageChange="handleCurrentChange">
      <el-table
        :data="tableData"
        border
        stripe>
        <el-table-column
          type="index"
          label="序列"
          align="center"
          width="80">
        </el-table-column>
        ${this.list.content.map(item => {
          var res = `
        <el-table-column
          prop="${item.key}"
          label="${item.label}"
          >
          ${item.isCustomer? customerContent : ''}
        </el-table-column>
        `
          return res
        }).join('')}
        <el-table-column
          prop="op"
          label="操作"
          width="350"
          >
          <template scope="scope">
            <el-button type="success" size="small" @click="$router.push(viewPagePath(scope.row.id))" v-if="isShow('view')">详情</el-button>
            <el-button type="info" size="small" @click="$router.push(editPagePath(scope.row.id))" v-if="isShow('edit')">编辑</el-button>
            <el-button type="danger" size="small" @click="remove(scope.row.id)" v-if="isShow('delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </j-grid-box>`
      },
      generatorListJs() {
        return `
import listMixin from '@/mixin/list'
// require('./api/mock.js')

export default {
  mixins: [listMixin],
  data () {
    return {
      KEY: '${this.form.pageKey}',${this.form.isPageAndLimitSame ? '' : (`\n      limitKey:'` + this.form.limitKey + '\',')}
      PAGE_PATH_PREFIX: '${this.form.PAGE_PATH_PREFIX.charAt(0) === '/' ? this.form.PAGE_PATH_PREFIX : ('/' + this.form.PAGE_PATH_PREFIX)}', 
      searchConditions: ${this.generatorSearchJS()},
    }
  },
  methods: {
    
  }
}`
      },
      generatorSearchJS() {
        var res = {}
        this.search.content.forEach(item => {
          res[item.key] = null
        })
        // \t 是用来调缩进的格式的
        return JSON.stringify(res, null, '\t\t')
      },
      reset() {
        this.form = Object.assign({}, defaultForm)
        if(this.currType === 'list') {
          this.search.content = []
          this.list.content = []
        }
      },
      valid() {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate((isValid) => {
            if (isValid) {
              resolve()
            } else {
              reject()
            }
          })
        })
      },
      validLimitKey(rule, value, callback) {
        if(!this.form.isPageAndLimitSame && !value) {
          callback(new Error('请输入 LimitKey'));
        } else {
          callback()
        }
      },
      validPathPrefix(rule, value, callback) {
        if(this.currType === 'list' && !value) {
          callback(new Error('请输入页面前缀'));
        } else {
          callback()
        }
      }
    }
  })

  
}