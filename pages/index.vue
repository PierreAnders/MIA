<template>
  <div class="bg-image px-8 pt-12 min-h-screen">
    <BurgerMenu />
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <div>
        <label class="text-white" for="email">Adresse e-mail:</label>
        <input class="text-black" type="text" id="email" v-model="email" />
      </div>
      <div>
        <label class="text-white" for="mot_de_passe">Mot de passe:</label>
        <input class="text-black" type="password" id="mot_de_passe" v-model="mot_de_passe" />
      </div>
      <button class="text-white" type="submit">Se connecter</button>
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