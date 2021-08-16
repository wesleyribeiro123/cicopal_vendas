export default function hourToString(time) {
  
  const timestamp = new Date(time);
  var hour = timestamp.getHours();
  var minute = timestamp.getMinutes();

  var stamp = `${hour}:${minute}`
  return stamp;
}