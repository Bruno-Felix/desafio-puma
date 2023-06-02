<template>
  <section>
    <q-input v-model="userNameInput" dense label="Buscar username do usuário" class="user-name-input"/>
    <q-btn class="q-mt-sm" label="Buscar" @click="searchUserName" color="primary"/>

    <q-card
      v-if="searchUser.username"
      class="home-options-card"
    >
      <q-img
        :src="searchUser.avatar"
        spinner-color="orange"
      />
      <q-card-section>
        <div class="card-info">
          <div class="card-text">Username: {{ searchUser.username }}</div>
        </div>
        <div class="card-options">
          <q-btn color="white" text-color="green" label="Inserir na lista" @click="addUser(searchUser)"/>
        </div>
      </q-card-section>
    </q-card>  

    <h4>Lista de Usuários</h4>

    <p v-if="userList.length == 0">Nenhum usuário cadastrado</p>

    <div class="home-options-div">
      <q-card
        v-for="user in userList"
        :key="user.username"
        class="home-options-card"
      >
        <q-img
          :src="user.avatar"
          spinner-color="orange"
        />
        <q-card-section>
          <div class="card-info">
            <div class="card-text">Nome: {{ user.nome }}</div>
            <div class="card-text">Username: {{ user.username }}</div>
          </div>
          <div class="card-options">
            <q-btn color="white" text-color="red" label="Remover" class="margin-card-option" @click="removeUser(user.username)"/>
            <q-btn color="white" text-color="black" label="GitHub" @click="redirectToGitHubUser(user.url)"/>
          </div>
        </q-card-section>
      </q-card>      
    </div>
  </section>
</template>

<script>
import { api } from 'src/boot/axios';
import { defineComponent } from 'vue'
import axios from 'axios';
import { Notify } from 'quasar'

export default defineComponent({
  name: 'IndexPage',

  data () {
    return {
      userNameInput: '',
      loadingUsers: false,
      searchUser: {
        username: '',
        nome: '',
        url: '',
        avatar: ''
      },
      userList: []
    }
  },

  async created () {
    await this.getUsers();
  },

  methods: {
    async searchUserName() {
      axios.get(`https://api.github.com/users/${this.userNameInput}`)
      .then(res => {
          Notify.create({
            type: 'positive',
            message: 'Usuário encontrado'
          })

          this.searchUser.username = res.data.login,
          this.searchUser.nome = res.data.name,
          this.searchUser.url = res.data.html_url,
          this.searchUser.avatar = res.data.avatar_url
      })
      .catch(err => {
        if (err.response.status == 404) {
          Notify.create({
            type: 'negative',
            message: 'Usuário não existe'
          })
        }
      })
    },
    async getUsers() {
      this.loadingUsers = true;

      api
      .get('users/')
        .then(res => {
          this.userList = res.data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(
          this.loadingUsers = false
        )
    },
    async removeUser(username) {
      api
      .delete(`users/${username}`)
        .then(async res => {
          Notify.create({
            type: 'positive',
            message: 'Usuário removido com sucesso'
          })
          await this.getUsers()
        })
        .catch(err => {
          console.log(err)
        })
    },
    async addUser(searchUser) {
      api
      .post(`users/`, searchUser)
      .then(async res => {
        Notify.create({
          type: 'positive',
          message: 'Usuário inserido com sucesso'
        })
        await this.getUsers()
        this.searchUser = {}
      })
      .catch(err => {
        Notify.create({
          type: 'negative',
          message: 'Usuário não pode ser inserido na lista'
        })
      })
    },
    redirectToGitHubUser(link) {
      window.location.href = link;
    },
  },
})
</script>

<style>

.home-options-div {
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.home-options-card {
  width: 250px;
  margin: 20px;

  border-radius: 10px;
}

.home-options-card:hover {
  background-color: #f2f2f2;
}

.card-text {
  font-size: 16px;
  font-weight: 300;
  line-height: normal;
  text-align: center;
  color: #000000;

  margin-bottom: 20px;
}

.card-options {
  display: flex;
  flex-direction: column;
}

.margin-card-option{
  margin-bottom: 20px;
}

.user-name-input {
  width: 500px;
  margin-top: 50px;
}

.erro-search-user-name {
  color: red;
}
</style>
