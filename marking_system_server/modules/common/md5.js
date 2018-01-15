const crypto = require('crypto')
module.exports = (data) => {
  const hash = crypto.createHash('md5')
  hash.update(data)
  return hash.digest('hex')
}