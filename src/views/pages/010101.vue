<template>
  <div class="branch">
    <div class="row justify-between">
      <!-- Title -->
      <div class="text-h6 text-bold text-negative q-mt-lg q-mb-md">
        Pedidos com Erros
      </div>

      <!-- DatePicker -->
      <div class="q-mt-lg q-mb-md">
        <q-input outlined dense v-model="reportDate">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="reportDate"
                  today-btn
                  mask="DD/MM/YYYY"
                  color="accent"
                  text-color="primary"
                  :locale="ptBR"
                >
                  <div class="row items-center justify-end">
                    <q-btn
                      dense
                      outline
                      v-close-popup
                      label="Confirmar"
                      color="positive"
                      @click="refreshDate()"
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <!-- Table -->
    <div class="table">
      <DataTable
        dense
        :rows="rowsError"
        :columns="colsError"
        :filter="filterError"
        :rows-per-page-options="[10]"
        row-key="orderCode"
        color="negative"
        v-model="selected"
        @row-click="onErrorsClick"
      />
    </div>

    <q-dialog v-model="dErrors">
      <div class="bg-white q-ma-xl q-pa-xl row justify-center">
        <div class="column">
          <p>Você clicou no pedido: {{ rowSelected ? rowSelected.orderCode : '???' }}</p>
          <br>
          <h6>MOSTRAR O ARQUIVO BLOB</h6>
        </div>
        <div class="row justify-center">
          <q-btn
            class="q-mr-md q-px-lg"
            label="Ocultar Erro"
            color="negative"
            outline
            dense
            @click="hiddenError"
          />

          <q-btn
            class="q-ml-md q-px-lg"
            label="Confirmar Correção"
            color="positive"
            outline
            dense
            @click="adjustedError"
          />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import DataTable from '../../components/DataTable'
import locale from 'quasar/lang/pt-BR'
import formatDate from '../../helpers/functions'

export default {
  components: {
    DataTable
  },
  setup() {
    return {
      selected: ref([]),
    }
  },
  data() {
    return {
      rowSelected: null,
      dErrors: false,
      ptBR: locale.date,
      reportDate: formatDate(Date.now()),
      colsError: [
        {
          name: 'orderCode',
          required: true,
          label: 'Número do Pedido',
          align: 'left',
          field: row => row.orderCode,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'branch'    ,align: 'left', label: 'Filial'       ,field: 'branch'    ,sortable: true },
        { name: 'clientC'   ,align: 'left', label: 'Código'       ,field: 'clientC'   ,sortable: true },
        { name: 'clientL'   ,align: 'left', label: 'Loja'         ,field: 'clientL'   ,sortable: true },
        { name: 'issueDate' ,align: 'left', label: 'Dt Emissão'   ,field: 'issueDate' ,sortable: true },
        { name: 'issueHour' ,align: 'left', label: 'Hora Emissão' ,field: 'issueHour' ,sortable: true },
      ],
      rowsError: [
        { branch: '010101' ,clientC: '37223634' ,clientL: '0001' ,orderCode: '01010168087186' ,issueDate: '20210723' ,issueHour: '08:35' },
        { branch: '010101' ,clientC: '28769286' ,clientL: '0001' ,orderCode: '01010368095942' ,issueDate: '20210723' ,issueHour: '11:31' },
        { branch: '010101' ,clientC: '09348928' ,clientL: '0001' ,orderCode: '06010268091531' ,issueDate: '20210723' ,issueHour: '15:25' },
        { branch: '010101' ,clientC: '31676385' ,clientL: '0001' ,orderCode: '06010268109676' ,issueDate: '20210723' ,issueHour: '15:25' },
        { branch: '010101' ,clientC: '53427807' ,clientL: '649 ' ,orderCode: '01010368109479' ,issueDate: '20210723' ,issueHour: '15:33' },
        { branch: '010101' ,clientC: '53427807' ,clientL: '649 ' ,orderCode: '01010368109481' ,issueDate: '20210723' ,issueHour: '15:33' },
        { branch: '010101' ,clientC: '35416260' ,clientL: '0001' ,orderCode: '01010368109863' ,issueDate: '20210723' ,issueHour: '15:33' },
        { branch: '010101' ,clientC: '37223634' ,clientL: '0001' ,orderCode: '01010168087186' ,issueDate: '20210723' ,issueHour: '08:35' },
        { branch: '010101' ,clientC: '28769286' ,clientL: '0001' ,orderCode: '01010368095942' ,issueDate: '20210723' ,issueHour: '11:31' },
        { branch: '010101' ,clientC: '09348928' ,clientL: '0001' ,orderCode: '06010268091531' ,issueDate: '20210723' ,issueHour: '15:25' },
        { branch: '010101' ,clientC: '31676385' ,clientL: '0001' ,orderCode: '06010268109676' ,issueDate: '20210723' ,issueHour: '15:25' },
        { branch: '010101' ,clientC: '53427807' ,clientL: '649 ' ,orderCode: '01010368109479' ,issueDate: '20210723' ,issueHour: '15:33' },
        { branch: '010101' ,clientC: '53427807' ,clientL: '649 ' ,orderCode: '01010368109481' ,issueDate: '20210723' ,issueHour: '15:33' },
        { branch: '010101' ,clientC: '35416260' ,clientL: '0001' ,orderCode: '01010368109863' ,issueDate: '20210723' ,issueHour: '15:33' },
        { branch: '010101' ,clientC: '28769286' ,clientL: '0001' ,orderCode: '01010368095942' ,issueDate: '20210723' ,issueHour: '11:31' },
        { branch: '010101' ,clientC: '09348928' ,clientL: '0001' ,orderCode: '06010268091531' ,issueDate: '20210723' ,issueHour: '15:25' },
        { branch: '010101' ,clientC: '31676385' ,clientL: '0001' ,orderCode: '06010268109676' ,issueDate: '20210723' ,issueHour: '15:25' },
        { branch: '010101' ,clientC: '53427807' ,clientL: '649 ' ,orderCode: '01010368109479' ,issueDate: '20210723' ,issueHour: '15:33' },
        { branch: '010101' ,clientC: '53427807' ,clientL: '649 ' ,orderCode: '01010368109481' ,issueDate: '20210723' ,issueHour: '15:33' },
        { branch: '010101' ,clientC: '35416260' ,clientL: '0001' ,orderCode: '01010368109863' ,issueDate: '20210723' ,issueHour: '15:33' },
      ],
    }
  },
  methods: {
    onErrorsClick(event, row) {
      this.rowSelected = row;
      this.dErrors = true;
    },
  }
}
</script>

<style lang="scss">

</style>