const MarkModel = require('../../db/Mark')
const formidable = require('formidable')

module.exports = (req, res) => {
  const form = formidable.IncomingForm()
  form.parse(req, (err, fields) => {
    if (err) {
      return res.json({
        code: 2000,
        message: '发生错误'
      })
    } else {
      MarkModel.find({markName: fields.markName, accessCode: fields.accessCode}, (err, docs) => {
        if (docs && docs.length === 1) {
          let index = -1
          let data = docs[0].charts.filter((item, i) => {
            if (item.username === fields.name && item.personId === fields.personId) {
              index = i + 1
              return true
            }
          })[0]._doc
          if (index >= 0) {
            return res.json({
              code: 2002,
              data: {...data, index}
            })
          } else {
            return res.json({
              code: 2001,
              message: '没有查询到信息'
            })
          }
        } else {
          console.log('a')
          return res.json({
            code: 2001,
            message: '没有查询到信息'
          })
        }
      })
    }
  })
}
