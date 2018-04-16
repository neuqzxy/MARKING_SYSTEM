import getNum from '../renderer/util/getNum'
export default (data, precision) => {
  // 得到符合计算精度的函数
  const toNum = getNum(precision)
  // 先拿到平均分
  const __allScoreData = data.map(item => {
    const __allScore = item.scores.reduce((a, b) => {
      return a + (b.score || 0)
    }, 0)
    let __averageScore = item.scores.length === 0 ? '暂无' : toNum(__allScore / item.scores.length).toFixed(precision)
    return {...item, calculatedScores: __averageScore}
  })
  // 开始排名
  const __calculatedScores = __allScoreData.sort((a, b) => {
    let average1 = a.calculatedScores === '暂无' ? -100 : parseFloat(a.calculatedScores)
    let average2 = b.calculatedScores === '暂无' ? -100 : parseFloat(b.calculatedScores)
    return average2 - average1
  })
  return __calculatedScores
}
