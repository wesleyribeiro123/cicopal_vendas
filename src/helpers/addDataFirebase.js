import firebase from '../firebase'
import 'firebase/auth'

async function setData() {
  try {
    const user = 'wesleyribeiro123@gmail.com';
    const pass = '0369cuei';        
    await firebase.auth().signInWithEmailAndPassword(user, pass);

    await firebase.firestore().collection('ordersWithErrors').doc('gHtnLpaweswe9bwcsley').set({
      amount: 188.97,
      branchCode: "010105",
      branchName: "CICOPAL MARABÁ",
      clientCode: "16785097",
      clientStore: "0001",
      dtLiberation: "20210804",
      fantasyName: "SUPER WESLEY",
      hrLiberation: "17:34",
      issueDate: "20210805",
      issueHour: "10:23",
      listPrice: "349",
      orderCode: "01010562340867",
      products: {
        0: {
          productCode: "20020004",
          productName: "SALG MILHO MICOS PRESUNTO 32X60G",
          quantity: 2,
          unValue: 109.56
        },
        1: {
          productCode: "20020002",
          productName: "SALG MILHO MICOS NATURAL 32X60G",
          quantity: 5,
          unValue: 254.63
        },
      },
      responsible: "PORTAL CICOPAL",
      status: "pendente"
    });

  } catch (e) {
    console.error(e);
  }
}

setData();