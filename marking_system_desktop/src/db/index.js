import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const adapter = new FileSync('MarkingSystem.json')
const MarkingSystem = low(adapter)
MarkingSystem.defaults({User: {username: '', password: ''}}).write()

export {MarkingSystem}
