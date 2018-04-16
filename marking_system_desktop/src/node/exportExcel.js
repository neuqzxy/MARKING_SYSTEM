const ejsExcel = require('ejsexcel')
const fs = require('fs')
const path = require('path')
const remote = require('electron').remote
const shell = require('electron').shell
let ExcelBuf = null
if (process.env.NODE_ENV === 'development') {
  ExcelBuf = fs.readFileSync(path.join(__dirname, '../../static/markExcel.xlsx'))
} else {
  ExcelBuf = fs.readFileSync(path.join(__dirname, './static/markExcel.xlsx'))
}

// 创建目录
if (!fs.existsSync(path.join(remote.app.getPath('userData'), './myExcel'))) {
  fs.mkdirSync(path.join(remote.app.getPath('userData'), './myExcel'))
}

export default (markName, personInfo, message) => {
  console.log(personInfo)
  const data = [[{'mark_name': markName}], personInfo]
  ejsExcel.renderExcel(ExcelBuf, data).then(function (exlBuf2) {
    const id = new Date().toString()
    fs.writeFileSync(path.join(remote.app.getPath('userData'), `./myExcel/MyExcel-${id}.xlsx`), exlBuf2)
    shell.showItemInFolder(path.join(remote.app.getPath('userData'), `./myExcel/MyExcel-${id}.xlsx`))
    message.success('成功导出Excel')
  }).catch(err => {
    console.error(err.message)
    message.error('导出Excel出现错误')
  })
}
