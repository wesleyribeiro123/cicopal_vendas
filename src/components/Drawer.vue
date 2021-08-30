<template>
  <q-drawer
    v-model="drawer"
    elevated
    persistent
    :width="300"
    :breakpoint="400"
    style="background-color: #e0e7f1;"
  >

    <q-splitter
      v-model="heightSplitter"
      :horizontal="true"
      :disable="true"
      style="
        height: calc(100% - 160px);
        width: 290px;
        margin-top: 90px;"
    >

      <template v-slot:before>
        <div class="q-px-md">
          <q-tree
            :nodes="branchs"
            node-key="label"
            selected-color="positive"
            v-model:selected="selected"
            default-expand-all
            @click="nav"
          />
        </div>
      </template>

    </q-splitter>

    <div class="absolute-top" style="background-color: #e0e7f1; height: 90px">
      <div class="absolute-center bg-transparent row justify-center">
        <img src="../assets/LOGOMARCA_CICOPAL.png" style="width: 145px; height: 55px" />
      </div>
    </div>
  </q-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      heightSplitter: 100,
      selected: null,
      branchName: null,
      branchs: [
        {
          label: 'Home',
          icon: 'home',
          children: [],
        },
        {
          label: 'Empresas Grupo 01',
          icon: 'filter_1',
          children: [
            {code: '010101' ,label: 'Cicopal Matriz'      ,icon: 'looks_one'},
            {code: '010105' ,label: 'Cicopal Marabá'      ,icon: 'looks_one'},
            {code: '010201' ,label: 'Snacks Matriz'       ,icon: 'looks_one'},
            {code: '010203' ,label: 'Snacks Uberlândia'   ,icon: 'looks_one'},
            {code: '010401' ,label: 'Carper Matriz'       ,icon: 'looks_one'},
          ]
        },
        {
          label: 'Empresas Grupo 06',
          icon: 'filter_6',
          children: [
            {code: '060101' ,label: 'MA Alimentos'        ,icon: 'looks_6'},
            {code: '060102' ,label: 'MA Bacabal'          ,icon: 'looks_6'},
            {code: '070101' ,label: 'DF Distribuidora'    ,icon: 'looks_6'},
            {code: '080101' ,label: 'Comercial Tocantins' ,icon: 'looks_6'},
          ]
        }
      ],
    }
  },
  methods: {
    nav() {
      if(this.selected == 'Home') {
        this.$router.push({ path: '/' });
      } else {
        this.branchs.forEach(node => {
          node.children.forEach(child => {
            if(this.selected == child.label) {
              this.$router.push({ path: `/${child.code}` });
            }
          });
        });
      }
    },
  },
}
</script>
