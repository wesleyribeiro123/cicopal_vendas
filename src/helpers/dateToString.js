export default function dateToString(date) {

  var strDate = date + '';
  var splitDate = strDate.split('/');

  var day = splitDate[0];
  var month = splitDate[1];
  var year = splitDate[2];

  return year + month + day;
}