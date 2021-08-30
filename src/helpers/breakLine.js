
export default function breakLine(text) {
  var stringArray = text.split("\n")

  var strArr = []
  var temp = ""
  stringArray.forEach(el => {
    temp = el.toString().replaceAll("re�o", "reco")
    temp = temp.toString().replaceAll("unit�rio", "unitario");
    temp = temp.toString().replaceAll("est�", "esta");
    temp = temp.toString().replaceAll("C�digo", "Codigo");
    temp = temp.toString().replaceAll("j�", "ja");

    strArr.push(temp)
  });

  return strArr;
}
