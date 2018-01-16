module.exports = (data) => {
  let keys = Object.keys(data)
  let flag = true
  for (let i of keys) {
    if (data[i] === void 0) {
      flag = false
    }
  }
  return flag
}
