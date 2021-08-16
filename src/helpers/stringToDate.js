export default function formatDate(date) {

  var day = String(date).substring(7, 8)
  var month = String(date).substring(5, 6)
  var year = String(date).substring(0, 4)

  if (day.length < 2) {
    day = "0" + day
  }
  if (month.length < 2) {
    month = "0" + month
  }

  return [ day, month, year].join('/');

}
