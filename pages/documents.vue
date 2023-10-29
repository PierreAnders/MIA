<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex justify-center items-center pt-8">
            <h1 class="text-light-gray tracking-wider pr-3">DOCUMENTS</h1>
            <img src="~/assets/images/documents-title.svg" alt="documents icon">
        </div>
        <div class="flex flex-col justify-center items-center mt-12">
            <div class="text-white mb-24 mt-6">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    <div v-for="folder in folders" :key="folder.id" class="text-center"
                        @contextmenu.prevent="showContextMenu($event, folder.id)">
                        <button @click="navigateToFolder(folder.name)"
                            class=" flex flex-col items-center transition-transform transform hover:scale-105">
                            <img class="w-22 h-22 mx-auto mb-1" src="~assets/images/folder-icon.svg" alt="folder icon">
                            <span class="text-xs">{{ folder.name }}</span>
                        </button>
                    </div>
                    <form @submit.prevent="addFolder" class="flex flex-col items-center">
                        <img class="transition-transform transform hover:scale-105 cursor-pointer" id="button-add-folder"
                            @click="isButtonClicked = !isButtonClicked" v-show="!isButtonClicked"
                            src="~/assets/images/add-folder-icon.svg" alt="documents icon">
                        <div id="icon-add-folder" v-show="isButtonClicked">
                            <div class="flex flex-col items-center">
                                <img class="pb-[2px]" src="~assets/images/folder-icon.svg" alt="folder icon">
                                <input
                                    class="text-center text-xs w-[90px] h-5 px-2 bg-black border rounded-sm border-dark-gray text-white"
                                    type="text" id="folder" v-model="folderInfo.name" placeholder="Nouveau">
                                <button class="pt-2 transition-transform transform hover:scale-110" type="submit">
                                    <IconSubmenuAddFolder />
                                </button>
                            </div>
                        </div>
                    </form>
                    <div>
                        <div v-show="contextMenu.isVisible" class="context-menu" ref="subMenu"
                            :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
                            <div class="flex flex-col text-left w-48">

                                <button
                                    class="flex text-left text-sm py-1 rounded-sm hover:bg-[#D9D9D9] hover:bg-opacity-25"
                                    @click="deleteFolder(contextMenu.folderId)">
                                    <div class="px-2">
                                        <IconSubmenuDeleteFolder class="w-5 h-5" :color="'#838383'"/>
                                    </div>
                                    <div>
                                        Supprimer le dossier
                                    </div>
                                </button>
                                <button
                                    class="flex text-left text-sm py-1 rounded-sm hover:bg-[#D9D9D9] hover:bg-opacity-[12%]"
                                    @click="isButtonClicked = true">
                                    <div class="px-2">
                                        <IconSubmenuAddFolder class="w-5 h-5"/>
                                    </div>
                                    <div>
                                        Nouveau Dossier
                                    </div>
                                </button>
                                <button
                                    class="flex text-left text-sm py-1 rounded-sm hover:bg-[#D9D9D9] hover:bg-opacity-[12%]"
                                    @click="contextMenu.isVisible = false">
                                    <div class="px-2">
                                        <IconSubmenuOut class="w-5 h-5"/>
                                    </div>
                                    <div>
                                        Retour
                                    </div>
                                </button>
                            </div>
                            <!-- Ajoutez d'autres options de menu ici -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
import axios from 'axios'
import BurgerMenu from '@/components/BurgerMenu.vue'
import IconSubmenuAddFolder from '@/components/IconSubmenuAddFolder.vue'
import IconSubmenuDeleteFolder from '@/components/IconSubmenuDeleteFolder.vue'
import IconSubmenuOut from '@/components/IconSubmenuOut.vue'

export default {
    components: {
        BurgerMenu,
        IconSubmenuAddFolder,
        IconSubmenuDeleteFolder,
        IconSubmenuOut,
    },

    data() {
        return {
            folderInfo: {
                id: "",
                name: "",
            },
            folders: [],
            isButtonClicked: false,
            contextMenu: {
                isVisible: false,
                folderId: null,
            },
        };
    },
    methods: {
        handleClickOutside(event) {
            if (this.$refs.subMenu && !this.$refs.subMenu.contains(event.target)) {
                this.contextMenu.isVisible = false
            }
        },
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
        showContextMenu(event, folderId) {
            event.preventDefault();
            this.contextMenu.folderId = folderId;

            // Vérifiez si l'option "Supprimer" a été sélectionnée
            if (event.target.textContent === "Supprimer") {
                this.deleteFolder(folderId);
            } else {
                // Affiche le menu contextuel
                this.contextMenu.x = event.clientX;
                this.contextMenu.y = event.clientY;
                this.contextMenu.isVisible = true;
            }
        },
        async addFolder() {
            this.contextMenu.isVisible = false
            this.isButtonClicked = false
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
                    this.contextMenu.isVisible = false;
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
        document.addEventListener("click", this.handleClickOutside);
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

.context-menu {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background-color: #3A3A3A;
    padding: 5px;
    border-radius: 5px;
}
</style>