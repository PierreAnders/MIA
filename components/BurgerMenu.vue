<template>
    <div>
        <button @click="toggleMenu" class="block text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <div v-if="isOpen"
            class="absolute z-10 top-0 left-0 w-1/3 bg-neutral-950 h-full p-4 transition-transform duration-300 ease-in-out">
            <ul class="text-slate-400 mt-14">
                <li class="hover:bg-neutral-800 px-4 rounded hover:text-white transition duration-300">
                    <nuxt-link to="/" class="block py-2">Accueil</nuxt-link>
                </li>
                <li class="hover:bg-neutral-800 px-4 rounded hover:text-white transition duration-300">
                    <nuxt-link to="/health" class="block py-2">Santé</nuxt-link>
                </li>
                <li class="hover:bg-neutral-800 px-4 rounded hover:text-white transition duration-300">
                    <nuxt-link to="/chat" class="block py-2">Chat</nuxt-link>
                </li>
                <li class="hover:bg-neutral-800 px-4 rounded hover:text-white transition duration-300">
                    <nuxt-link to="/upload" class="block py-2">Téléchargement</nuxt-link>
                </li>
                <li class="hover:bg-neutral-800 px-4 rounded hover:text-white transition duration-300">
                    <nuxt-link to="/files" class="block py-2">Fichiers</nuxt-link>
                </li>
                <li class="hover:bg-neutral-800 px-4 rounded hover:text-white transition duration-300">
                    <nuxt-link to="/register" class="block py-2">Inscription</nuxt-link>                </li>
                <li class="hover:bg-neutral-800 px-4 rounded hover:text-white transition duration-300">
                    <button @click="redirection" class="block py-2">{{ isConnected ? 'Déconnexion' : 'Connexion' }}</button>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            isOpen: false,
            isConnected: false,
            jwtToken: null,
        };
    },
    methods: {
        connectionState() {
            if (process.client) {
                this.jwtToken = localStorage.getItem('access_token');
                if (this.jwtToken) {
                    this.isConnected = true;
                } else {
                    this.isConnected = false;
                }
            }
        },
        redirection() {
            if (this.isConnected) {
                this.logout()
            } else {
                this.$router.push('/');
            }
        },
        toggleMenu() {
            this.isOpen = !this.isOpen;
        },
        closeMenuOnClickOutside(event) {
            const menuElement = this.$el.querySelector(".bg-neutral-950");
            const buttonElement = this.$el.querySelector("button");

            if (menuElement && buttonElement && !menuElement.contains(event.target) && !buttonElement.contains(event.target)) {
                this.isOpen = false;
            }
        },
        logout() {
            localStorage.removeItem("access_token");
            this.$router.push("/"); 
        },
    },
    mounted() {
        // Écoute les clics au niveau de la page pour détecter les clics en dehors du menu
        window.addEventListener("click", this.closeMenuOnClickOutside);
        this.connectionState();
    },
    beforeDestroy() {
        // Supprimez l'écouteur de clics lorsque le composant est détruit
        window.removeEventListener("click", this.closeMenuOnClickOutside);
    },
};
</script>
  
<style scoped>
/* Ajoutez ici les styles spécifiques au menu burger */
</style>
  