<template>
  <div class="branch">
    <div class="row justify-between">
      <!-- Title -->
      <div class="text-h6 text-bold text-negative q-mt-lg q-mb-md">
        Pedidos com Erros
      </div>

      <!-- DatePicker -->
      <div class="q-mt-lg q-mb-md">
        <q-input outlined dense v-model="reportDate" @keypress.enter="refreshDate">
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
                      @click="refreshDate"
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
        :visible-columns="visibleCols"
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
            class="q-ml-md q-px-lg"
            label="Solicitar Reimportação"
            color="positive"
            outline
            dense
            @click="adjustedError"
          />
          <q-btn
            class="q-ml-md q-px-lg"
            label="Fechar"
            color="negative"
            outline
            dense
            @click="closedError"
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
import formatDate from '../../helpers/formatDate'
import dateToString from '../../helpers/dateToString'
import stringToDate from '../../helpers/stringToDate'
import { mapActions, mapMutations, mapState } from 'vuex'

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
      filterError: null,
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
        { name: 'id'        ,align: 'left', label: 'ID'           ,field: 'id'        ,sortable: false},
        { name: 'branch'    ,align: 'left', label: 'Filial'       ,field: 'branch'    ,sortable: true },
        { name: 'clientC'   ,align: 'left', label: 'Código'       ,field: 'clientC'   ,sortable: true },
        { name: 'clientL'   ,align: 'left', label: 'Loja'         ,field: 'clientL'   ,sortable: true },
        { name: 'valueTTL'  ,align: 'left', label: 'Valor Total'  ,field: 'valueTTL'  ,sortable: true },
        { name: 'issueDate' ,align: 'left', label: 'Dt Emissão'   ,field: 'issueDate' ,sortable: true },
        { name: 'issueHour' ,align: 'left', label: 'Hora Emissão' ,field: 'issueHour' ,sortable: true },
      ],
      visibleCols: [
        'orderCode', 'branch', 'clientC', 'clientL',
        'valueTTL', 'issueDate', 'issueHour'
      ]
    }
  },
  computed: {
    ...mapState("ordersWithErrors", ["orders"]),
    rowsError() {
      let orders = this.orders

      return orders.map(order => {
        return {
          id: order.id,
          branch: order.branchCode,
          clientC: order.clientCode,
          clientL: order.clientStore,
          valueTTL: order.amount,
          orderCode: order.orderCode,
          issueDate: stringToDate(order.issueDate),
          issueHour: order.issueHour
        }
      })
    }
  },
  methods: {
    ...mapActions("ordersWithErrors", [
      "getOrders",
      "errorFinished"
    ]),
    ...mapMutations("shared", ["setNotification"]),
    refreshDate() {
      const date = dateToString(this.reportDate);
      const branchCode = String(this.$route.path).substr(1);
      
      this.getOrders({ branchCode, date });
    },
    onErrorsClick(event, row) {
      this.rowSelected = row;
      this.dErrors = true;

      // Verificar como será o arquivo BLOB,vai subir na mesma Collection ou
      // criaremos outra amarrando pelo número do pedido?
    },
    closedError() {
      this.dErrors = false;
    },
    adjustedError() {
      this.sendResponse(this.rowSelected, 'reimportar');
    },
    sendResponse(row, response) {
      this.$q.dialog({
        title: 'Confirmação',
        message: `Deseja realmente liberar para reimportação o pedido nº: ${row.orderCode}?`,
        ok: {
          push: true,
          color: 'green',
          label: 'Sim'
        },
        cancel: {
          push: true,
          color: 'red',
          label: 'Não'
        },
        persistent: true
      })
      .onOk(async() => {
        try {
          let id = row.id;
          await this.errorFinished({ id, response });
          this.setNotification({
            message: 'Resposta enviada com sucesso.',
            color: 'green',
            position: 'top'
          });
          this.dErrors = false;
          this.refreshDate();
        } catch (e) {
          this.setNotification({
            message: e.message,
            color: 'red',
            position: 'top'
          });
        }
      })
    }
  },
  async created() {
    const date = dateToString(this.reportDate);
    const branchCode = String(this.$route.path).substr(1);

    await this.getOrders({ branchCode, date });
  }
}
</script>
