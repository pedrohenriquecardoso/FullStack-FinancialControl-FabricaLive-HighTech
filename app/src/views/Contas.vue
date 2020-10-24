<template>
  <div>
    <!-- FORMULARIO -->
    <v-card class="my-9 mx-auto" width="50%" v-if="mostrarForm">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="red"
        @click="mostrarForm = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-container>
        <div class="mb-4">Nova conta</div>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Descrição"
              outlined
              v-model="contaAtual.descricao"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              :items="tipo"
              label="tipo"
              v-model="contaAtual.tipo"
              outlined
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Valor"
              outlined
              v-model="contaAtual.valor"
              type="number"
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-menu
              ref="menuDataDialog"
              v-model="menuDataDialog"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="dataFormatada"
                  label="data"
                  prepend-icon="mdi-calendar"
                  outlined
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="contaAtual.data"
                no-title
                @input="formatarData"
              ></v-date-picker>
            </v-menu>
            <!-- <p>
              Date in ISO format: <strong>{{ contaAtual.data }}</strong>
            </p> -->
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              outlined
              name="input-7-4"
              label="Observações"
              v-model="contaAtual.observacoes"
              hide-details
            >
            </v-textarea>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-row justify="center" class="mb-3 mt-0">
            <v-btn color="success mx-1" @click="salvar">Salvar</v-btn>
            <v-btn color="warning mx-1" @click="cancelar">Cancelar</v-btn>
          </v-row>
        </v-card-actions>
      </v-container>
    </v-card>

    <v-data-table :headers="cabecalho" :items="contas" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Contas Cadastradas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="abrirFormulario" v-if="!mostrarForm"
            >Nova Conta</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:body.append>
        <v-toolbar flat color="white">
          <v-toolbar-title>Balanço:</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-card flat :class="balancoGeral >= 0 ? 'green--text' : 'red--text'">
            R$ {{ balancoGeral.toFixed(2) }}
          </v-card>
        </v-toolbar>
      </template>
      <template v-slot:item.acoes="{ item }">
        <v-icon small class="mr-2" @click="detalhes(item)">
          mdi-magnify
        </v-icon>
        <v-icon small @click="excluir(item)"> mdi-trash-can </v-icon>
      </template>
      <template v-slot:item.tipo="{ item }">
        <div :class="item.tipo === 'Receita' ? 'green--text' : 'red--text'">
          {{ item.tipo }}
        </div>
      </template>
      <template v-slot:item.valor="{ item }">
        R$ {{ item.valor.toFixed(2) }}
      </template>
      <template v-slot:no-data>
        <v-row justify="center">
          <v-subheader>Nenhuma conta cadastrada</v-subheader>
          <!-- Aparece caso nao tenho usuarios cadastrados -->
        </v-row>
      </template>
    </v-data-table>

    <v-dialog v-model="confirmaExclusao" max-width="340" persistent>
      <v-card>
        <v-card-title class="headline">Deseja excluir esta conta?</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="darken-1" text @click="cancelarExclusao"> Não </v-btn>

          <v-btn color="red darken-1" text @click="confirmarExclusao">
            Sim
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detalhesDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Detalhes da conta</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Descrição"
                outlined
                :value="contaAtualDetalhe.descricao"
                hide-details
                disabled
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                :items="tipo"
                label="tipo"
                :value="contaAtualDetalhe.tipo"
                outlined
                disabled
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Valor"
                outlined
                :value="contaAtualDetalhe.valor.toFixed(2)"
                type="number"
                hide-details
                disabled
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                label="data"
                outlined
                :value="formatarDataGeral()"
                hide-details
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-textarea
                outlined
                name="input-7-4"
                label="Observações"
                :value="contaAtualDetalhe.observacoes"
                hide-details
                disabled
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="darken-1" text @click="detalhesDialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ContaHttpUtil from '@/util/ContaHttpUtil';
export default {
  data() {
    return {
      mostrarForm: false,
      contaAtual: {},
      menuDataDialog: false,
      tipo: ["Receita", "Despesa"],
      balancoGeral: 0,
      confirmaExclusao: false,
      contaExcluir: null,
      detalhesDialog: false,
      dataFormatada: "",
      contaAtualDetalhe: { valor: 0, data: "" },
      cabecalho: [
        {
          text: "Descricao",
          value: "descricao",
        },
        {
          text: "Tipo",
          value: "tipo",
        },
        {
          text: "Valor",
          value: "valor",
        },
        {
          text: "Data",
          value: "data",
        },
        {
          text: "Acoes",
          value: "acoes",
          sortable: false,
        },
      ],
      contas: [],
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      
      ContaHttpUtil.buscarTodos().then((contas) => {
        this.contas = contas
        this.calcularBalanco();
      })
      
      
    },
    salvar() {
      let contaNova = {};
      Object.assign(contaNova, this.contaAtual);
      contaNova.valor = parseFloat(contaNova.valor);
      
      ContaHttpUtil.adicionar(contaNova).then(resposta => {
        if (resposta.status == 200){
          this.initialize();
           this.cancelar();
        }
      })

      
     
    },
    cancelar() {
      this.mostrarForm = false;
      this.contaAtual = "";
      this.contaExcluir = null;
    },
    confirmarExclusao() {
      ContaHttpUtil.deletar(this.contaExcluir).then(resposta => {
        if (resposta.status == 200) {
          alert("Conta excluida com sucesso")
          this.confirmaExclusao = false;
          this.initialize()
        } else {
          alert("Erro ao excluir conta")
        }
      })
    },
    cancelarExclusao() {
      this.confirmaExclusao = false;
      this.cancelar();
    },
    abrirFormulario() {
      this.mostrarForm = true;
    },
    calcularBalanco() {
      this.balancoGeral = 0;
      this.contas.forEach((conta) => {
        if (conta.tipo === "Receita") {
          this.balancoGeral += conta.valor;
        } else {
          this.balancoGeral -= conta.valor;
        }
      });
    },
    excluir(conta) {
      this.confirmaExclusao = true;
      this.contaExcluir = conta;
    },
    detalhes(conta) {
      this.detalhesDialog = true;
      this.contaAtualDetalhe = conta;
      this.contaAtualDetalheObs = conta.observacoes;
    },
    formatarData() {
      this.dataFormatada = this.ISOtoBR(this.contaAtual.data);
      this.menuDataDialog = false;
    },
    ISOtoBR(data) {
      const [ano, mes, dia] = data.split("-");
      return `${dia}/${mes}/${ano}`;
    },
    formatarDataGeral(){
      return this.ISOtoBR(this.contaAtualDetalhe.data);
    }

  },
};
</script>

<style>
</style>