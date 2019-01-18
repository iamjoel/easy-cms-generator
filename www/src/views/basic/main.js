import {SERVER_PREFIX} from '@/setting'
import DictList from './dict/List.vue'
import RoleList from './roles/List.vue'


export default {
  components: {
    DictList,
    RoleList
  },
  data() {
    return {
      activeName: 'info',
      projectRootPath: localStorage.getItem('project-root-path'),
      tempProjectRootPath: null,
      prevProjectRootPath: null,
      hasAdminFolder: true,
      hasServerFolder: true,
      dbPath: ''
    }
  },
  computed: {
    projectName() {
      if(!this.projectRootPath) {
        return ''
      }
      return this.projectRootPath.split('/').slice(-1)[0]
    }
  },
  methods: {
    editProjectRootPath() {
      this.tempProjectRootPath = this.projectRootPath
      this.prevProjectRootPath = this.projectRootPath
      this.projectRootPath = ''
    },
    confirmProjectRootPath() {
      if(this.tempProjectRootPath != '') {
        this.projectRootPath = this.normalizeRootPath(this.tempProjectRootPath)
        localStorage.setItem('project-root-path', this.projectRootPath)
        this.setCurrProject(true)
      } else {
        this.$message({
          showClose: true,
          message: '项目根路径不能为空!',
          type: 'error'
        })
      }
    },
    cancelProjectRootPath() {
      this.projectRootPath = this.prevProjectRootPath
    },
    setCurrProject(isShowMsg) {
      this.$http.post(`${SERVER_PREFIX}/project/choose`, {
        name: this.projectName,
        rootPath: this.projectRootPath
      }).then(({data}) => {
        this.dbPath = data.data.dbPath
        if(isShowMsg) {
          this.$message({
            showClose: true,
            message: '创建操作!',
            type: 'success'
          })
        }
        this.checkFoldersExist()
      })
    },
    createFolder(name) {
      this.$http.post(`${SERVER_PREFIX}/project/create-folder`, {
        filePath: `${this.projectRootPath}/${name}`
      }).then(({data}) => {
        this.checkFoldersExist()
        this.$message({
          showClose: true,
          message: '创建操作!',
          type: 'success'
        })

      })
    },
    checkFoldersExist() {
      this.$http.get(`${SERVER_PREFIX}/project/check-folds-exist`, {
        params: {
          'root-path': this.projectRootPath
        }
      }).then(({data}) => {
        data = data.data
        this.hasAdminFolder = data.hasAdminFolder
        this.hasServerFolder = data.hasServerFolder
      })
    },
    normalizeRootPath(path) {
      if(/\/$/.test(path)) { // 尾部的 / 删除
        return path.split('').splice(0, path.length - 1).join('')
      } else {
        return path
      }
    },
    handleChange(tab) {
      this.$router.push(`/basic/${tab.name}`)
    }
  },
  mounted() {
    this.activeName = this.$route.params.type

    if(this.projectName) {
      this.setCurrProject()
    }
  }
}