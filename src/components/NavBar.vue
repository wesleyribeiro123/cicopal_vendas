<template>
  <q-header elevated class="bg-primary">
    <q-toolbar>
      <q-toolbar-title class="text-center col justify-center">
        <div class="text-center">
          Pedidos Importação - SAIB vs Protheus
        </div>
        <div class="text-subtitle2 text-center text-version">
          v. {{ version }}
        </div>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script>
import { version } from '../../package.json'
export default {
  data() {
    return {
      version: version
    }
  }
}
</script>

<style lang="scss">
  .text-version {
    color: #555675;
  }
</style>