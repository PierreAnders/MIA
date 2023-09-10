<template>
  <div>
    <h1>Inscription</h1>
    <form @submit.prevent="register">
      <div>
        <label for="username">Nom d'utilisateur:</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" />
      </div>
      <div>
        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <div>
        <button type="submit">S'inscrire</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
    }
  },
  methods: {
    async register() {
      // Envoyez la demande d'inscription à l'API Flask avec Axios
      try {
        const response = await axios.post('http://localhost:5000/register', {
          nom: this.username,
          email: this.email,
          mot_de_passe: this.password,
        })

        // Redirigez l'utilisateur vers une page de connexion après l'inscription réussie
        // Vous pouvez également afficher un message de confirmation ici
      } catch (error) {
        console.error('Erreur d\'inscription:', error)
      }
    },
  },
}
</script>



<!-- <template>
    <div class="bg-image bg-neutral-900 px-8 pt-12 min-h-screen">
      <BurgerMenu />
    </div>
  </template>
  
  <script>
  import BurgerMenu from '~/components/BurgerMenu.vue';
  
  export default {
    components: {
      BurgerMenu,
    },
  }
  </script>
  
  <style>
  .bg-image {
    /* background-image: url("~/assets/space-background.jpg"); */
    background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url("~/assets/space-background.jpg"); 
    background-size: cover;
    background-position: center;
    min-height: 100vh; 
  }
  </style>
   -->