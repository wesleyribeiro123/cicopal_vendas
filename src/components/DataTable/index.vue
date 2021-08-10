<template>
  <q-table
    :dense="dense"
    :rows="rows"
    :columns="columns"
    :row-key="row-key"
    :color="color"
    :filter="filter"
    :rows-per-page-options="rows-per-page-options"
    :v-model:selected="v-model"
  >
  
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script>
export default {
  data() {
    return {
      filter: null,
    }
  },
}
</script>

<style lang="scss">
  .q-table__top, .q-table__bottom, thead tr:first-child th {
    background-color: #e0e7f1;
  }
</style>