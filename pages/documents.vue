<template>
    <div class="px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <div class="flex flex-col items-center justify-center mt-6">
            <div class="text-xl font-semibold text-white mb-6">Documents</div>
        </div>
        <div class="flex flex-col items-center justify-center">
            <div class="text-white mb-6 mt-6">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    <div v-for="folder in folders" :key="folder.id" class="text-center" @contextmenu.prevent="showContextMenu($event, folder.id)">
                        <button @click="navigateToFolder(folder.name)"
                            class=" flex flex-col items-center transition-transform transform hover:scale-105">
                            <img class="w-22 h-22 mx-auto mb-1" src="~assets/images/folder-icon.svg" alt="folder icon">
                            <span class="text-xs">{{ folder.name }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <form @submit.prevent="addFolder">
            <div class="flex items-center justify-center mb-16">
                <div class="py-3 flex justify-content flex-col">
                    <input
                        class="text-xs w-48 h-6 px-4 border rounded-md focus:outline-none focus:border-amber-800 opacity-50"
                        type="text" id="folder" v-model="folderInfo.name" placeholder="Nouveau dossier">
                </div>
                <button
                    class="text-xs flex items-center h-6 bg-slate-500 text-white ml-2 p-2 rounded-md transition-transform transform hover:scale-105"
                    type="submit">✓
                </button>
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
            if (!this.folderInfo.name) {
                console.error("Le nom du dossier ne peut pas être vide.");
                return;
            }
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
                    this.getAllFolders();
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
body {
    background-color: #111114;
}
</style>