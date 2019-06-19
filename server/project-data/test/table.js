var tableList = [
  {
    basic: {
      name: 'classroom',
      label: '教室'
    },
    cols: [
      {
        key: 'name',
        label: '名称',
        dataType: 'string',
        required: true
      },
    ],
  },
  {
    basic: {
      name: 'student',
      label: '学生'
    },
    cols: [
      {
        key: 'name',
        label: '姓名',
        dataType: 'string',
        required: true
      },
      {
        key: 'age',
        label: '年龄',
        dataType: 'int',
        len: 3,
      },
    ],
    relationList: [
    {// 1对多。
      name: '学生与教室',
      relateEntity: 'classroom',
    },
    {// 多对多。
      name: '学生与老师',
      relateEntity: 'teacher',
      type: 'moreToMore'
    }]
  },
  {
    basic: {
      name: 'teacher',
      label: '老师'
    },
    cols: [
      {
        key: 'name',
        label: '姓名',
        dataType: 'string',
        required: true
      },
    ],
  },
  {
    basic: {
      name: 'course',
    },
    cols: [
      {
        key: 'name',
        label: '名称',
        dataType: 'string',
        required: true
      },
    ],
  },
]


module.exports = tableList