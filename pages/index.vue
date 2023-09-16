<template>
  <div>
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Adresse e-mail:</label>
        <input type="text" id="email" v-model="email" />
      </div>
      <div>
        <label for="mot_de_passe">Mot de passe:</label>
        <input type="password" id="mot_de_passe" v-model="mot_de_passe" />
      </div>
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
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
