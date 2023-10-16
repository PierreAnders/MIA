<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <div class="flex flex-col items-center justify-center mt-6">
            <div class="text-xl font-semibold text-white mb-6">Documents</div>
        </div>
        <form @submit.prevent="addFolder">
            <div class="flex flex-col items-center justify-center mt-6">
                <div class="py-3 flex flex-col">
                    <label class="text-gray-300" for="folder">Dossier</label>
                    <input
                        class="text-right w-64 h-8 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="folder" v-model="folderInfo.name" placeholder="nom">
                </div>
                <button
                    class="flex items-center h-8 bg-slate-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-slate-600 transition duration-300"
                    type="submit">Ajouter
                </button>
                <div class="text-white text-xl mb-24 mt-8">
                    <div v-for="folder in folders" :key="folder.id">
                        <button @click="navigateToFolder(folder.name)">{{ folder.name }}</button>
                        <button @click="deleteFolder(folder.id)">Supprimer</button>
                    </div>
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

    data() {
        return {
            folderInfo: {
                id: "",
                name: "",
            },
            folders: [],
        };
    },
    methods: {
        async redirectIfNotConnected() {
            if (process.client) {
                this.jwtToken = localStorage.getItem('access_token');
                if (!this.jwtToken) {
                    console.error('Le jeton JWT n\'est pas disponible.');
                    this.$router.push('/');
                    return;
                }
            } else {
                console.error('Le code est exécuté côté serveur (SSR), localStorage n\'est pas disponible.');
            }
        },
        async addFolder() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.post("http://localhost:5000/folders", this.folderInfo, { headers });

                if (response.status === 201) {
                    console.log("Enregistrement d'une nouvelle categorie'.")
                    this.getAllFolders();
                    this.resetFolderInfo();
                } else {
                    console.error("Échec de l'enregistrement d'une nouvelle categorie.");
                }
            } catch (error) {
                console.error("Erreur lors de la soumission d'une nouvelle categorie:", error);
            }
        },
        resetFolderInfo() {
            this.folderInfo.name = "";
        },
        async getAllFolders() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.get("http://localhost:5000/folders", { headers });
                console.log('date', response.data)
                if (response.status === 200) {
                    this.folders = response.data;
                    this.folders.sort((a, b) => {
                        const nameA = a.name.toUpperCase();
                        const nameB = b.name.toUpperCase();

                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    });
                } else {
                    console.error("Échec de la récupération des catégories.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories :", error);
            }
        },

        async deleteFolder(folderId) {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.delete(`http://localhost:5000/folders/${folderId}`, { headers });

                if (response.status === 200) {
                    console.log("Categorie supprimée avec succès.");
                    this.getAllExpenses();
                } else {
                    console.error("Échec de la suppression de la catégorie.");
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de la catégorie :", error);
            }
        },

        navigateToFolder(folderId) {
            this.$router.push(`/folders/${folderId}`);
    },
    },
    mounted() {
        this.getAllFolders();
    },
    created() {
        this.redirectIfNotConnected();
    },
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