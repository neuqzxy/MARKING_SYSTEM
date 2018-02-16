const ejsExcel = require('ejsexcel')
const fs = require('fs')
const path = require('path')
const ExcelBuf = fs.readFileSync(path.join(__dirname, './markExcel.xlsx'))
export default (markName, personInfo, message) => {
  const data = [[{'mark_name': markName}], personInfo]
  ejsExcel.renderExcel(ExcelBuf, data).then(function (exlBuf2) {
    fs.writeFileSync('./MyExcel.xlsx', exlBuf2)
    message.success('成功导出Excel')
  }).catch(err => {
    console.error(err.message)
    message.error('导出Excel出现错误')
  })
}
