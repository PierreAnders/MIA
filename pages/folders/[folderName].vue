<template>
    <div class="bg-image px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <div class="flex flex-col items-center justify-center mt-6">
            <div class="text-xl font-semibold text-white mb-6">Contenu du Dossier</div>
        </div>
        <ul>
            <li v-for="file in fileList" :key="file"
                class="text-white flex items-center justify-between border border-gray-300 rounded-md p-4 mb-2 mx-8">
                <span>{{ file }}</span>
                <div class="space-x-2">
                    <button @click="deleteFile(file)"
                        class="bg-slate-500 text-white px-2 py-1 rounded hover:bg-slate-600 transition duration-300">Supprimer</button>
                    <button @click="downloadFile(file)"
                        class="bg-slate-500 text-white px-2 py-1 rounded hover:bg-slate-600 transition duration-300">Télécharger</button>
                </div>
            </li>
        </ul>
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
            fileList: [],
        };
    },
    created() {
        this.loadFileList();
    },
    methods: {
        loadFileList() {
            const folderName = this.$route.params.folderName; // Récupérez l'ID du dossier depuis l'URL
            if (process.client) {
                const jwtToken = localStorage.getItem('access_token');
                if (!jwtToken) {
                    console.error('Le jeton JWT n\'est pas disponible.');
                    this.$router.push('/');
                    return;
                }

                axios
                    .get(`http://localhost:5000/list_files/${folderName}`, { // Utilisez l'ID du dossier dans la requête
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => {
                        this.fileList = response.data.files;
                        console.log(this.fileList);
                    })
                    .catch((error) => console.error(error));
            } else {
                console.error('Le code est exécuté côté serveur (SSR), localStorage n\'est pas disponible.');
            }
        },

        // Le reste de vos méthodes (deleteFile et downloadFile) reste inchangé

        deleteFile(filename) {
            const folderName = this.$route.params.folderName;
            const jwtToken = localStorage.getItem('access_token'); // Récupérez le jeton JWT
            if (!jwtToken) {
                // Traitez le cas où le jeton JWT n'est pas disponible
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            axios
                .delete(`http://localhost:5000/delete_user_file/${folderName}/${filename}`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                })
                .then(() => {
                    this.loadFileList();
                })
                .catch((error) => console.error(error));
        },
        downloadFile(filename) {
            const folderName = this.$route.params.folderName;
            const jwtToken = localStorage.getItem('access_token'); // Récupérez le jeton JWT
            if (!jwtToken) {
                // Traitez le cas où le jeton JWT n'est pas disponible
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            // Créez une configuration Axios avec le jeton JWT dans les en-têtes
            const axiosConfig = {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                responseType: 'blob', // Spécifiez le type de réponse comme un blob (fichier binaire)
            };

            axios
                .get(`http://localhost:5000/download_user_file/${folderName}/${filename}`, axiosConfig)
                .then((response) => {
                    const blob = new Blob([response.data]);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => console.error(error));
        },
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
  