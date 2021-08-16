import firebase from '../../../firebase';
import auth from "../users/auth";
import dateToString from "@/helpers/dateToString";
import hourToString from "@/helpers/hourToString";
import formatDate from "@/helpers/formatDate";

const db = firebase.firestore();

export async function getOrders({ commit }, infos) {
  const branchCode = infos.branchCode;
  const issueDate = infos.date;

  await auth();

  try {
    commit("shared/setLoadingMessage", "Atualizando Pedidos com Erros", {
      root: true
    });

    const orders = [];
    const snapshot = await db
      .collection('ordersWithErrors')
      .where('branchCode', '==', branchCode)
      .where('issueDate', '==', issueDate)
      .where('status', '==', 'pending')
      .get()

    snapshot.forEach(doc => {
      orders.push({ ...doc.data(), id: doc.id });
    });

    commit('setOrders', orders);
    commit('shared/setLoadingMessage', null, { root: true });
  } catch (er) {
    console.error(er);
    commit('shared/setLoadingMessage', null, { root: true });

    commit(
      'shared/setNotification',
      {
        message: 'Falha ao buscar Pedidos com erro.',
        color: 'red',
        position: 'top'
      },
      { root: true }
    );
  }
}

export async function getOrdersById({ commit }, orderNumber, issueDate) {

  await auth();

  try {
    commit("shared/setLoadingMessage", "Atualizando Pedidos com Erros", {
      root: true
    });

    const orders = [];
    const snapshot = await db
      .collection('ordersWithErrors')
      .where('issueDate', '==', issueDate)
      .where(orderNumber)
      .get()

    snapshot.forEach(doc => {
      orders.push({ ...doc.data(), id: doc.id });
    });

    commit('setOrders', orders);
    commit('shared/setLoadingMessage', null, { root: true });
  } catch (er) {
    console.error(er);
    commit('shared/setLoadingMessage', null, { root: true });

    commit(
      'shared/setNotification',
      {
        message: 'Falha ao buscar Pedidos com erro.',
        color: 'red',
        position: 'top'
      },
      { root: true }
    );
  }
}

export async function errorFinished({ commit }, payload) {

  await auth();

  const { id } = payload;
  const date = dateToString(formatDate(Date.now()));
  const time = hourToString(Date.now());

  commit('shared/setLoadingMessage', 'Enviando resposta. Aguarde...', {
    root: true
  });

  try {
    const orderFB = await db
      .collection('ordersWithErrors')
      .doc(id)
      .get()
      .then(doc => doc.data());
    orderFB.status = 'adjusted';

    const batch = db.batch();
    const setRef = db.collection('ordersWithErrors').doc(id);
    batch.update(setRef, {
      status: orderFB.status,
      dtLiberation: date,
      hrLiberation: time
    });

    await batch.commit();
    commit('shared/setLoadingMessage', null, { root: true });
  } catch (er) {
    console.error(er);
    commit('shared/setLoadingMessage', null, { root: true });
    throw new Error('Falha no envio da resposta. Tente novamente!');
  }
}