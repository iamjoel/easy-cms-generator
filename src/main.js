{
  var defaultForm = {
    pageKey: null, // 测试 'song'
    limitKey: null,
    isPageAndLimitSame: true,
    pagePathPrfix: '', // 页面前缀
  }

  var vm = new Vue({
    el: '#app',
    data() {
      return {
        download: {
          list:{
            js: null,
            vue: null
          },
          update:{
            js: null,
            vue: null
          }
        },
        currType: 'list',// list,update,mock
        itemTemplates: [{
          label: '名称',
          key: 'name',
          isRequired: true,
          isCustomer: false
        },{
          label: '类型',
          key: 'type',
          isRequired: true,
          isCustomer: false
        },{
          label: '备注',
          key: 'detail',
          isRequired: false,
          isCustomer: false
        }],
        form: Object.assign({}, defaultForm),
        rules: {
            pageKey: [
              { required: true, message: '请输入页面Key', trigger: 'blur' },
            ],
            limitKey: [
              { validator: this.validLimitKey, trigger: 'blur' },
            ],
            pagePathPrfix: [
              { validator: this.validPathPrefix, trigger: 'blur' },
            ],
        },
        // 列表页相关的属性开始
        search: {
          editTemp: {
            label: null,
            key: null,
            // 下拉框之类的其他类型，要编辑的就多了，还不如代码写
            // type: 'text'
          },
          content: [{label: '', key: ''}],
          // content: [{label: '歌曲',key: 'name'},{label: '歌手',key: 'singer'}], // 测试
        },
        list: {
          editTemp: {
            label: null,
            key: null,
            isCustomer: false
          },
          content: [{label: '名称',key: 'name', isCustomer: false}, ...repeat({label: '',key: '', isCustomer: false}, 5)],
          // content: [{label: '歌曲',key: 'name', isCustomer: true},{label: '歌手',key: 'singer'}], // 测试
        },
        // 新增，编辑，页相关的属性开始
        detail: {
          editTemp: {
            label: null,
            key: null,
            isRequired: true
          },
          content: [...repeat({label: '',key: '', isRequired: true}, 4), {label: '',key: '', isRequired: false}],
          // content: [{label: '歌曲',key: 'name', isRequired: true},{label: '歌手',key: 'singer'}], // 测试
        },
        mock: {
          tag: {
            name: null,
            description: null,
            output: null
          },
          cruds: {
            key: null,
            output: null,
          }
        }
      }

    },
    methods: {
      toDownloadFormat(text) {
        console.info(text)
        var data = new Blob([text], {type: 'text/plain'})
        return window.URL.createObjectURL(data)
      },
      addItem(type) {
        this[type].content.push(Object.assign({}, this[type].editTemp))
      },
      removeEmptyItem() {
        this[this.currType].content = removeEmptyItem(this[this.currType].content)
      },
      generatorDownload() {
        var currType = this.currType
        this.valid().then(()=> {
          let vueContent
          let jsContent
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
          } else {
            let details = this.generatorDetails()
            vueContent =
            `
<template>
<div class="main">
  <el-form :inline="true" :model="model" :rules="rules" ref="form" label-position="right" >
    <el-row type="flex" justify="start" class="multi-line">
      ${details}
    </el-row>
  </el-form>

  <el-row type="flex" justify="center">
    <el-button @click="$router.go(-1)">返回</el-button>
    <el-button type="success" @click="save">保存</el-button>
  </el-row>
</div>
</template>

<script src="./update.js"></script>`

            jsContent = this.generatorDetailJs()
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
        this.form.pagePathPrfix = this.form.pagePathPrfix.trim()
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
      KEY: '${this.form.pageKey.trim()}',${this.form.isPageAndLimitSame ? '' : (`\n      limitKey:'` + this.form.limitKey + '\',')}
      PAGE_PATH_PREFIX: '${this.form.pagePathPrfix.charAt(0) === '/' ? this.form.pagePathPrfix : ('/' + this.form.pagePathPrfix)}',
      searchConditions: ${this.generatorModel(this.search.content)},
    }
  },
  methods: {

  }
}`
      },
      generatorModel(data) {
        var res = {}
        this.search.content.forEach(item => {
          res[item.key] = null
        })
        // \t 是用来调缩进的格式的
        return JSON.stringify(res, null, '\t\t')
      },
      generatorDetails() {
         return `
      ${this.detail.content.map(item => {
        var res = `
      <j-edit-item
        label="${item.label}" prop="${item.key}" :is-view="isView" :view-value="model.${item.key}">
        <el-input v-model="model.${item.key}"></el-input>
      </j-edit-item>`
        return res
      }).join('')}`
      },
      generatorRules() {
         return this.detail.content.filter(item => item.isRequired).map(item => {
            return `
          ${item.key}: [
            { required: true, message: '请输入${item.label}名称', trigger: 'blur' }
          ],`
          }).join('')
      },
      generatorDetailJs() {
        return `
import updateMixin from '@/mixin/update'

//require('./api/mock.js')

export default {
  mixins: [updateMixin],
  data () {
    return {
      KEY: '${this.form.pageKey.trim()}',
      model: ${this.generatorModel(this.detail.content)},
      rules: {
        ${this.generatorRules()}
      }
    }
  },
  methods: {

  }
}`
      },
      reset() {
        this.form = Object.assign({}, defaultForm)
        if(this.currType === 'list') {
          this.search.content = []
          this.list.content = []
        } else {
          this.detail.content = []
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
      },
      cloneTo(destination, item) {
        var cloneItem = Object.assign({}, item)
        if(destination === 'search') {
          this.search.content.push(cloneItem)
        } else {
          this.list.content.push(Object.assign(cloneItem, {isCustomer: false}))
        }
      },
      syncList() {
        this.detail.content = this.list.content.map(item => {
          return {
            label: item.label,
            key: item.key,
            isRequired: true
          }
        })
      },
      addTo(destination, item) {
        this[destination].content.push(Object.assign({}, item))
      },
      generatorCrud() {
        var mock = this.mock
        var tag = mock.tag
        tag.output = `
tags:
- name: "${tag.name}"
  description: "${tag.description}"`
        var resouceModelName = mock.cruds.key.charAt(0).toUpperCase() + mock.cruds.key.substring(1)
        mock.cruds.output = `
/${mock.cruds.key}/list:
    x-swagger-router-controller: swagger_raw
    get:
      tags:
      - "${tag.name}"
      parameters:
        - name: name
          in: query
          description: 名称
          required: false
          type: string
      responses:
        "200":
          description: Success
          schema:
            properties:
              data:
                $ref: "#/definitions/${resouceModelName}List"
              pager:
                $ref: "#/definitions/Pager"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
  /${mock.cruds.key}/detail/{id}:
    x-swagger-router-controller: swagger_raw
    get:
      tags:
      - "${tag.name}"
      parameters:
        - name: id
          in: path
          description: ${tag.name}id
          required: true
          type: string
      responses:
        "200":
          description: Success
          schema:
            properties:
              data:
                $ref: "#/definitions/${resouceModelName}"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
  /${mock.cruds.key}/add:
    x-swagger-router-controller: swagger_raw
    post:
      tags:
      - "${tag.name}"
      consumes:
      - "application/x-www-form-urlencoded"
      parameters:
      - in: "body"
        name: "body"
        required: true
        schema:
          $ref: "#/definitions/${resouceModelName}"
      responses:
        "200":
          description: Success
          schema:
            $ref: "#/definitions/SuccessResponse"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
  /${mock.cruds.key}/edit/{id}:
    x-swagger-router-controller: swagger_raw
    post:
      tags:
      - "${tag.name}"
      consumes:
      - "application/x-www-form-urlencoded"
      parameters:
      - name: id
        in: path
        description: ${tag.name}id
        required: true
        type: string
      - in: "body"
        name: "body"
        required: true
        schema:
          $ref: "#/definitions/${resouceModelName}"
      responses:
        "200":
          description: Success
          schema:
            $ref: "#/definitions/SuccessResponse"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
  /${mock.cruds.key}/del/{id}:
    x-swagger-router-controller: swagger_raw
    post:
      tags:
      - "${tag.name}"
      consumes:
      - "application/x-www-form-urlencoded"
      parameters:
      - name: id
        in: path
        description: ${tag.name}id
        required: true
        type: string
      responses:
        "200":
          description: Success
          schema:
            $ref: "#/definitions/SuccessResponse"
        default:
          description: Error
          schema:
            $ref: "#/definitions/ErrorResponse"
        `
      }
    }
  })


}

function repeat(item, num = 5) {
  var res = []
  for(var i = 0; i < num; i++) {
    res.push(Object.assign({}, item))
  }
  return res
}

function removeEmptyItem(list) {
  return list.filter(item => {
    return [null, ''].indexOf(item.key) === -1 || [null, ''].indexOf(item.label) === -1
  })
}
