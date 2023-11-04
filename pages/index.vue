<template>
  <div class="min-h-screen px-8 pt-8">
    <BurgerMenu />
    <div class="flex items-center justify-center pt-8">
      <h1 class="pr-3 tracking-wider text-light-gray">CONNEXION</h1>
      <IconConnection :color="'#334155'"/>
    </div>
    <form @submit.prevent="login">
      <div class="flex flex-col items-center justify-center mt-12">
        <div class="w-64 pb-3">
          <label class="sr-only" for="email">Email:</label>
          <input
            class="w-64 h-8 px-4 text-sm text-white border-2 rounded-md bg-dark-gray placeholder-light-gray border-dark-gray focus:outline-none focus:border-blue"
            type="text" id="email" v-model="email" placeholder="Email" />
        </div>
        <div class="flex justify-between w-64 py-2">
          <label class="sr-only" for="mot_de_passe">Mot de passe:</label>
          <input
            class="flex w-64 h-8 px-4 mr-2 text-sm text-white border-2 rounded-md placeholder-light-gray bg-dark-gray border-dark-gray focus:outline-none focus:border-blue"
            type="password" id="mot_de_passe" v-model="password" placeholder="Mot de passe" />
          <button type="submit">
            <IconEnter class="transition-transform transform hover:scale-110" />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../constants.js'

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },

  methods: {
    async login() {
      try {
        const response = await axios.post(`${BASE_URL}/users/login`, {
          email: this.email,
          password: this.password
        });

        if (response.data && response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          // console.log('le token', response.data.access_token);
          this.$router.push('/documents');
        } else {
          console.error('Échec de l\'authentification');
        }
      } catch (error) {
        console.error('Erreur de connexion :', error);
      }
    }
  },
};
</script>

<style>
.aria {
  color: white;
}
</style>