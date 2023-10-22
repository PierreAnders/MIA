<template>
    <div>
        <button @click="toggleMenu" class="block">
            <IconMenu />
        </button>
        <div v-if="isOpen"
            class="absolute z-10 top-0 left-0 bg-dark-gray w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 h-full p-4 transition-transform duration-300 ease-in-out">
            <ul class="text-slate-400 mt-14">
                <li>
                    <nuxt-link to="/dashboard"
                        class="flex items-center hover:bg-black hover:text-white px-4 rounded transition duration-300">
                        <IconDashboard class="mr-2" />
                        <span class="block font-semibold tracking-wide text-light-gray py-2">Dashboard</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/documents"
                        class="flex items-center hover:bg-black px-4 rounded hover:text-white transition duration-300">
                        <IconDocument class="mr-2" />
                        <span class="block font-semibold tracking-wide text-light-gray py-2">Documents</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/chat"
                        class="flex items-center hover:bg-black px-4 rounded hover:text-white transition duration-300">
                        <IconChat :color="'#838383'" class="mr-2" />
                        <span class="block font-semibold tracking-wide text-light-gray py-2">Chat</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/finance-menu"
                        class="flex items-center hover:bg-black px-4 rounded hover:text-white transition duration-300">
                        <IconFinance :color="'#838383'" class="mr-2" />
                        <span class="block font-semibold tracking-wide text-light-gray py-2">Finance</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/health"
                        class="flex items-center hover:bg-black px-4 rounded hover:text-white transition duration-300">
                        <IconHealth :color="'#838383'" class="mr-2" />
                        <span class="block font-semibold tracking-wide text-light-gray py-2">Santé</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/profile"
                        class="flex items-center hover:bg-black px-4 rounded hover:text-white transition duration-300 mb-12">
                        <IconProfile :color="'#838383'" class="mr-2" />
                        <span class="block font-semibold tracking-wide text-light-gray py-2">Profile</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/register"
                        class="flex items-center hover:bg-black px-4 rounded hover:text-white transition duration-300">
                        <IconConnection class="mr-2" />
                        <span class="block font-semibold tracking-wide text-light-gray py-2">Inscription</span>
                    </nuxt-link>
                </li>
                <li>
                    <button @click="redirection"
                        class="w-full flex items-center hover:bg-black px-4 rounded hover:text-white transition duration-300">
                        <IconRegister :color="'#838383'" class="mr-2" />
                        <span class="block font-semibold tracking-wide text-light-gray py-2">{{ isConnected ? 'Déconnexion'
                            : 'Connexion' }}</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>
import IconMenu from '@/components/IconMenu.vue'
import IconDashboard from '@/components/IconDashboard.vue'
import IconDocument from '@/components/IconDocument.vue'
import IconChat from '@/components/IconChat.vue'
import IconFinance from '@/components/IconFinance.vue'
import IconHealth from '@/components/IconHealth'
import IconProfile from '@/components/IconProfile.vue'
import IconConnection from '@/components/IconConnection.vue'
import IconRegister from '@/components/IconRegister.vue'

export default {
    components: {
        IconMenu,
        IconDashboard,
        IconDocument,
        IconChat,
        IconFinance,
        IconHealth,
        IconProfile,
    },
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
            const menuElement = this.$el.querySelector(".bg-dark-gray");
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
  
<style scoped>/* Ajoutez ici les styles spécifiques au menu burger */</style>
  