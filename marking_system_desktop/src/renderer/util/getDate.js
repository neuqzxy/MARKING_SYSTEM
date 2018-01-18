export default (date) => {
  let time = new Date(date)
  let year = time.getFullYear()
  let mouth = time.getMonth() + 1
  let day = time.getDay()
  let hour = time.getHours()
  let minute = time.getMinutes()
  let second = time.getSeconds()
  return {year, mouth, day, hour, minute, second}
}
