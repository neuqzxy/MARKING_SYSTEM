const ejsExcel = require('ejsexcel')
const fs = require('fs')

export default async (file, context) => {
  const ejsBuf = fs.readFileSync(file.path)
  /* ejsExcel.getExcelArr(ejsBuf).then(exlJson => {
    context.$message.success('读取完成')
    console.log(exlJson)
  }).catch(error => {
    context.error('发生错误')
    console.log(error)
  }) */
  try {
    let exlJson = await ejsExcel.getExcelArr(ejsBuf)
    exlJson = exlJson[0]
    let data = []
    // 拿到字段的信息
    let place = {}
    exlJson.forEach((item, index) => {
      if (index !== 0) {
        if (item[place.name] === void 0) {
          return context.$message.error('Excel内容有误，name为必填字段')
        }
        data.push({
          name: item[place.name],
          age: item[place.age],
          sex: item[place.sex] === '男' ? 'man' : (item[place.sex] === '女' ? 'woman' : item[place.sex]),
          message: item[place.message]
        })
      } else {
        // 拿到字段的信息
        item.forEach((data, i) => {
          place[data] = i
        })
      }
    })
    context.$message.success('读取完成')
    return data
  } catch (err) {
    context.error('发生错误')
  }
}
