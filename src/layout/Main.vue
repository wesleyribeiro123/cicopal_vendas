<template>
  <div class="app">
    <q-layout view="hhh lpR lFf" container class="shadow-2 rounded-borders window-height window-width">
      <NavBar />
      <Drawer />
      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import Drawer from '../components/Drawer.vue'
export default {
  components: {
    NavBar,
    Drawer
  }
}
</script>