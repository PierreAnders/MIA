<template>
  <div class="bg-image px-8 pt-12 min-h-screen">
    <BurgerMenu />
    <form @submit.prevent="login">
      <div class="flex flex-col items-center justify-center mt-72">
        <div class="py-3">
          <label class="sr-only" for="email">Adresse e-mail:</label>
          <input class="w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50" type="text" id="email" v-model="email" placeholder="Adresse mail"/>
        </div>
        <div class="py-3">
          <label class="sr-only" for="mot_de_passe">Mot de passe:</label>
          <input class="w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50" type="password" id="mot_de_passe" v-model="mot_de_passe" placeholder="Mot de passe"/>
        </div>
        <button class="flex items-center h-8 bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300" type="submit">Se connecter</button>
      </div>
      </form>
  </div>
</template>

<script>
import axios from 'axios';
import BurgerMenu from '~/components/BurgerMenu.vue';


export default {
  components: {
    BurgerMenu,
  },

  data() {
    return {
      email: '',
      mot_de_passe: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          email: this.email,
          mot_de_passe: this.mot_de_passe
        });

        if (response.data && response.data.access_token) {
          // Stockez le jeton d'accès dans le stockage local
          localStorage.setItem('access_token', response.data.access_token);
          console.log('le token', response.data.access_token);
          // Redirigez l'utilisateur vers une page protégée
          this.$router.push('/chat');
        } else {
          console.error('Échec de l\'authentification');
        }
      } catch (error) {
        console.error('Erreur de connexion :', error);
      }
    }
  }
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("~/assets/space-background.jpg");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
</style>