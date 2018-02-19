export default data => {
  // 先拿到平均分
  const __allScoreData = data.map(item => {
    const __allScore = item.scores.reduce((a, b) => {
      return a + (b.score || 0)
    }, 0)
    const __averageScore = item.scores.length === 0 ? '暂无' : parseInt(__allScore / item.scores.length)
    return {...item, calculatedScores: __averageScore}
  })
  // 开始排名
  const __calculatedScores = __allScoreData.sort((a, b) => {
    let average1 = a.calculatedScores === '暂无' ? -100 : a.calculatedScores
    let average2 = b.calculatedScores === '暂无' ? -100 : b.calculatedScores
    return average2 - average1
  })
  return __calculatedScores
}
