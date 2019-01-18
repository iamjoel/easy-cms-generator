# 后台生成服务器端
## 常用命令
* `npm run dev` 运行，并且到代码变化时，重启服务器。 需要 `npm -g i nodemon`。
* `npm start` 运行

调试接口可以用 [Postman](https://www.getpostman.com/)。

## 注意
只能同时一个项目用。具体见 `api/project.js` 里的 `choose`。

## 文档
* [fs-extra](https://www.npmjs.com/package/fs-extra)

## 各种数据结构
```
{
  "label": "字符串",
  "key": "str",
  "dataType": "string",
  "maxLength": "10",
  "required": true
},
{
  "label": "多行文本",
  "key": "text",
  "dataType": "text",
  "maxLength": null,
  "required": true
},
{
  "label": "整数",
  "key": "int",
  "dataType": "int",
  "maxLength": null,
  "required": true
},
{
  "label": "小数",
  "key": "num",
  "dataType": "double",
  "maxLength": null,
  "required": true
},
{
  "label": "布尔",
  "key": "bool",
  "dataType": "bool",
  "maxLength": null,
  "required": true
},
{
  "label": "日期",
  "key": "date",
  "dataType": "date",
  "maxLength": null,
  "required": true
}
```