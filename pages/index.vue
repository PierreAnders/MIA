<template>
  <div class="min-h-screen px-8 pt-8">
    <BurgerMenu />
    <div class="flex justify-center items-center pt-8">
      <h1 class="text-light-gray tracking-wider pr-3">CONNEXION</h1>
      <img src="~/assets/images/connection-title.svg" alt="connexion icon">
    </div>
    <form @submit.prevent="login">
      <div class="flex flex-col justify-center items-center mt-12">
        <div class="w-64 pb-3">
          <label class="sr-only" for="email">Email:</label>
          <input class="text-white text-sm bg-dark-gray placeholder-light-gray w-64 h-8 px-4 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue" type="text" id="email" v-model="email" placeholder="Email"/>
        </div>
        <div class="flex justify-between w-64 py-2">
          <label class="sr-only" for="mot_de_passe">Mot de passe:</label>
          <input class="flex text-white text-sm placeholder-light-gray bg-dark-gray w-64 h-8 px-4 mr-2 border-2 border-dark-gray rounded-md focus:outline-none focus:border-blue" type="password" id="mot_de_passe" v-model="password" placeholder="Mot de passe"/>
          <button type="submit">
            <IconEnter class="transition-transform transform hover:scale-110"/>
          </button>
        </div>
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
  computed: {
    formattedDate() {
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      return this.currentDate.toLocaleDateString('fr-FR', options);
    },
  },
  created() {
    this.updateTime();
    this.intervalId = setInterval(this.updateTime, 1000);
  },
  data() {
    return {
      email: '',
      password: '',
      currentDate: new Date(),
      currentTime: new Date().toLocaleTimeString(),
    };
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString();
    },
    beforeDestroy() {
      clearInterval(this.intervalId);
    },
    async login() {
      try {
        const response = await axios.post("https://awaited-midge-deeply.ngrok-free.app/login", {
          email: this.email,
          password: this.password
        });

        if (response.data && response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          console.log('le token', response.data.access_token);
          this.$router.push('/documents');
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
.aria {
  color: white;
}
</style>