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

    <div class="text-subtitle2 q-mt-md">
      Selecione o pedido para detalhamento do erro:
    </div>
    <!-- Table -->
    <div class="table">
      <DataTable
        dense
        :rows="rowsError"
        :columns="colsError"
        :rows-per-page-options="[10]"
        :visible-columns="visibleCols"
        no-data-label="Sem dados para serem exibidos..."
        row-key="orderCode"
        color="negative"
        v-model="selected"
        @row-click="onErrorsClick"
      />
    </div>

    <q-dialog v-model="dErrors" full-width style="overflow: none;">
      <div class="bg-white q-ma-xl q-pa-md col justify-center">
        <div class="col">
          <q-scroll-area style="width: 100%; height: 480px;">
            <div class="text-h6 text-center">
              Detalhamento do Erro
            </div>
            <br>
            <!-- Dados sobre o Cliente -->
            <div class="text-subtitle2">Dados do Pedido:</div>
            <q-table
              :filter="rowSelected.orderCode"
              :rows="rowsError"
              :columns="colsDetail"
              :rows-per-page-options="[5]"
              :visible-columns="visibleColsDetail"
              no-data-label="Sem dados para serem exibidos..."
              dense
              flat
              hide-pagination
              row-key="orderCode"
              color="negative"
            />

            <!-- Dados sobre os produtos -->
            <div class="text-subtitle2 q-mt-md">Detalhes dos Produtos:</div>
            <DataTable
              :rows="detailOrder"
              :columns="colsProducts"
              :rows-per-page-options="[3]"
              :visible-columns="visibleColsProd"
              no-data-label="Sem dados para serem exibidos..."
              color="negative"
              dense
              flat
            />

            <div class="text-subtitle2 q-my-md">Mensagem de Erro:</div>
            <div v-for="err in rowSelected.erroBLOB" :key="err">
              <p class="erroBLOB">{{ err }}</p>
            </div>
          </q-scroll-area>
        </div>
        <div class="row justify-center q-mt-md">
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
import breakLine from '../../helpers/breakLine'
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
        { name: 'branch'    ,align: 'left', label: 'Filial'       ,field: 'branch'    ,sortable: true },
        { name: 'clientC'   ,align: 'left', label: 'Código'       ,field: 'clientC'   ,sortable: true },
        { name: 'clientL'   ,align: 'left', label: 'Loja'         ,field: 'clientL'   ,sortable: true },
        { name: 'valueTTL'  ,align: 'left', label: 'Valor Total'  ,field: 'valueTTL'  ,sortable: true },
        { name: 'issueDate' ,align: 'left', label: 'Dt Emissão'   ,field: 'issueDate' ,sortable: true },
        { name: 'issueHour' ,align: 'left', label: 'Hora Emissão' ,field: 'issueHour' ,sortable: true },
      ],
      colsDetail: [
        {
          name: 'orderCode',
          required: true,
          label: 'Número do Pedido',
          align: 'left',
          field: row => row.orderCode,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'clientC'     ,align: 'left', label: 'Código'         ,field: 'clientC'     ,sortable: true },
        { name: 'clientL'     ,align: 'left', label: 'Loja'           ,field: 'clientL'     ,sortable: true },
        { name: 'fantasy'     ,align: 'left', label: 'Nome Fantasia'  ,field: 'fantasy'     ,sortable: true },
        { name: 'valueTTL'    ,align: 'left', label: 'Valor Total'    ,field: 'valueTTL'    ,sortable: true },
        { name: 'issueDate'   ,align: 'left', label: 'Dt Emissão'     ,field: 'issueDate'   ,sortable: true },
        { name: 'issueHour'   ,align: 'left', label: 'Hora Emissão'   ,field: 'issueHour'   ,sortable: true },
      ],
      colsProducts: [
        {
          name: 'productCode',
          required: true,
          label: 'Código',
          align: 'left',
          field: row => row.productCode,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'productName'  ,align: 'left', label: 'Descrição'       ,field: 'productName'  ,sortable: true },
        { name: 'quantity'     ,align: 'left', label: 'Quantidade'      ,field: 'quantity'     ,sortable: true },
        { name: 'unValue'      ,align: 'left', label: 'Valor Unitário'  ,field: 'unValue'      ,sortable: true },
      ],
      visibleCols: [
        'orderCode', 'branch', 'clientC', 'clientL',
        'valueTTL', 'issueDate', 'issueHour'
      ],
      visibleColsDetail: [
        'orderCode', 'clientC', 'clientL',
        'valueTTL', 'issueDate', 'issueHour', 'fantasy'
      ],
      visibleColsProd: [
        'productCode', 'productName', 'quantity', 'unValue'
      ],
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
          fantasy: order.fantasyName,
          valueTTL: order.amount,
          orderCode: order.orderCode,
          issueDate: stringToDate(order.issueDate),
          issueHour: order.issueHour,
          products: order.products,
          erroBLOB: breakLine(order.erroBLOB)
        }
      })
    },
    detailOrder() {
      let products = [];
      for (let e = 0; e < this.rowsError.length; e++) {
        if (this.rowsError[e].id == this.rowSelected.id) {
          products.push({ ...this.rowsError[e].products })
        }
      }

      var temp = [];
      temp = Object.entries(products[0]);

      var prod = [];
      for (let i = 0; i < temp.length; i++) {
        prod.push(temp[i][1])
      }

      return prod;
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

<style lang="scss">
  .erroBLOB {
    line-height: 7px;
  }
</style>