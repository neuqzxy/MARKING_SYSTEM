import getNum from '../renderer/util/getNum'
export default (data, chekced, precision) => {
  // 得到指定精度的函数
  const toNum = getNum(precision)
  // 初始化房间的数据
  let rooms = {}
  chekced.forEach(item => {
    rooms[item] = {score: 0, num: 0}
  })
  let __allScoreData = data.map(item => {
    const __allScore = item.scores.reduce((a, b) => {
      return a + (b.score || 0)
    }, 0)
    const __averageScore = item.scores.length === 0 ? '暂无' : toNum(__allScore / item.scores.length)
    if (__averageScore !== '暂无') {
      rooms[item.markId].score += __averageScore
      rooms[item.markId].num += 1
    }
    return {...item, averageScore: __averageScore}
  })
  // 计算每个房间的平均分，以及所有房间平均分的和
  let __keys = Object.keys(rooms)
  let __allRoomsScore = 0
  __keys.forEach(item => {
    rooms[item].roomAverageScore = toNum(rooms[item].score / rooms[item].num)
    __allRoomsScore += rooms[item].roomAverageScore
  })
  // 得到所有房间的总平均分
  const __allRoomsScoreAve = toNum(__allRoomsScore / __keys.length)
  // 计算东大策略下的分数
  __allScoreData = __allScoreData.map(item => {
    let dongDaScore = '暂无'
    if (item.averageScore !== '暂无') {
      dongDaScore = toNum(toNum(item.averageScore / rooms[item.markId].roomAverageScore) * __allRoomsScoreAve)
    }
    return {...item, calculatedScores: dongDaScore}
  })
  // 开始排名
  const __calculatedScores = __allScoreData.sort((a, b) => {
    let average1 = a.calculatedScores === '暂无' ? -100 : a.calculatedScores
    let average2 = b.calculatedScores === '暂无' ? -100 : b.calculatedScores
    return average2 - average1
  })
  return __calculatedScores
}
