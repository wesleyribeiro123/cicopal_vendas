import { createStore } from 'vuex'
import shared from './modules/shared'
import ordersWithErrors from './modules/ordersWithErrors'

const modules = {
  shared,
  ordersWithErrors
}

export default createStore({
  strict: false,
  modules: modules
})
