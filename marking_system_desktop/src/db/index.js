import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import {remote} from 'electron'
import {getDecAse192, getEncAse192} from '../node/crypto'

const adapter = new FileSync(path.join(remote.app.getPath('userData'), './MarkingSystem.json'), {
  serialize: (data) => getEncAse192(JSON.stringify(data), 'xinzai'),
  deserialize: (data) => JSON.parse(getDecAse192(data, 'xinzai'))
})
const MarkingSystem = low(adapter)
MarkingSystem.defaults({User: {username: '', password: ''}}).write()

export {MarkingSystem}
