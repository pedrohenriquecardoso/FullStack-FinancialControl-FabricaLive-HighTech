<template>
  <div>
    <v-card class="my-9 mx-auto" width="50%" v-if="mostrarForm">
      <v-btn absolute dark fab top right color="red" @click="mostrarForm = false"><v-icon>mdi-close</v-icon></v-btn>
      <v-container>
        <div class="mb-4">{{ formTitulo }}</div>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Nome"
              outlined
              v-model="usuarioAtual.nome"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="E-mail" outlined v-model="usuarioAtual.email"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Username" outlined v-model="usuarioAtual.username"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field label="Senha" outlined v-model="usuarioAtual.senha" type="password"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-row justify="center">
          <v-btn color="success mx-1" @click="salvar">Salvar</v-btn>
          <v-btn color="warning mx-1" @click="cancelar">Cancelar</v-btn>
        </v-row>

      </v-card-actions>
    </v-card>

    <v-data-table :headers="cabecalho" :items="usuarios" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Usuários Cadastrados</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="abrirFormulario" v-if="!mostrarForm">Novo Usuário</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.acoes="{ item }">
        <v-icon small class="mr-2" @click="editar(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="ativarInativar(item)">
          {{ item.ativo ? "mdi-cancel" : "mdi-check-bold" }}
          <!-- se item for ativo ? faça isso : se não ... isso -->
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-subheader>Nenhum usuário cadastrado</v-subheader>
        <!-- Aparece caso nao tenho usuarios cadastrados -->
      </template>
    </v-data-table>
  </div>
</template>

<script>
import UsuarioHttpUtil from '@/util/UsuarioHttpUtil';
export default {
  data: () => ({
    itemEdicao: null,
    usuarios: [],
    usuarioAtual: {},
    mostrarForm: false,
    cabecalho: [
      {
        text: "nome",
        value: "nome",
      },
      {
        text: "username",
        value: "username",
      },
      {
        text: "email",
        value: "email",
      },
      {
        text: "acoes",
        value: "acoes",
      },
    ],
  }),

  computed: {
    formTitulo() {
      return (this.itemEdicao === -1 ? "Novo usuario" : "Editar usuario");
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      UsuarioHttpUtil.buscarTodos().then((user) => {
        this.usuarios = user
      })
    },
    abrirFormulario() {
      this.mostrarForm = true
    },
    ativarInativar(usuario) {
      if (confirm("Tem certeza que deseja mudar o status do usuario?")){
        usuario.ativo = !usuario.ativo; /* ! invertido */

        UsuarioHttpUtil.editar(usuario).then((resposta) => {
          if (resposta.status == 200){
            alert("Status do usuario alterado com sucesso")
          } else {
            alert("Erro ao alterar status do usuario")
          }
        })
      }
      
    },
    salvar(){
      if (this.itemEdicao == null){
        this.adicionar()      
      } else {
        this.salvarEdicao()
      }
      this.mostrarForm = false
      this.cancelar()
      
    },
    adicionar(){
      let usuarioCopia = {};
      Object.assign(usuarioCopia, this.usuarioAtual)
      usuarioCopia.ativo = true
      UsuarioHttpUtil.adicionar(usuarioCopia).then((resposta) => {
        if(resposta.status == 200){
          alert("Usuário cadastrado com sucesso")
          this.initialize()
        } else {
          alert("Erro ao cadastrar ususario")
        }
      })

    },
    cancelar(){
      this.usuarioAtual = {}
      this.itemEdicao = null

    },
    editar(usuario){
      let usuarioCopia = {}
      Object.assign(usuarioCopia, usuario)
      this.itemEdicao = usuarioCopia
      this.usuarioAtual = usuarioCopia
      this.abrirFormulario()
    },
    salvarEdicao(){
        UsuarioHttpUtil.editar(this.itemEdicao).then((resposta) => {
          if (resposta.status == 200){
            alert("Usuário editado com sucesso")
            this.initialize()
          } else {
            alert("Erro ao editar usuário")
          }
        })
      }
    },
  };
</script>


<style>
</style>