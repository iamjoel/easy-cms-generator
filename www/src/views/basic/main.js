import {SERVER_PREFIX} from '@/setting'
import DictList from './dict/List.vue'
import RoleList from './roles/List.vue'
import { Loading } from 'element-ui'

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
      dbPath: '',
      isShowAdminInitTipDialog: false,
      isShowServerInitTipDialog: false,
    }
  },
  computed: {
    projectName() {
      if(!this.projectRootPath) {
        return ''
      }
      return this.projectRootPath.split('/').slice(-1)[0]
    },
    parentFoldOfRootPath () {
      var res = this.projectRootPath.split('/')
      res.pop()
      return res.join('/')
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
        this.$store.commit('setIsProjectInited', true)
        if(isShowMsg) {
          this.$message({
            showClose: true,
            message: '操作!',
            type: 'success'
          })
        }

        localStorage.setItem('j-token', data.data.token)
      }, () => {
        this.$store.commit('setIsProjectInited', false)
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
    },
  },
  mounted() {
    this.activeName = this.$route.params.type

    if(this.projectName) {
      this.setCurrProject()
    }
  }
}