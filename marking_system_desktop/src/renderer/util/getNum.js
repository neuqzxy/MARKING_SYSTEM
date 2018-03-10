export default precision => {
  return num => parseFloat(num.toFixed(precision)) || 0
}
