<template>
    <div class="px-8 pt-12 min-h-screen">
        <BurgerMenu />
        <div class="flex justify-center items-center py-8">
            <h1 class="text-light-gray tracking-wider pr-3">{{ folderName.toUpperCase() }}</h1>
            <img src="~/assets/images/folder-title.svg" alt="documents icon">
        </div>
        <ul class="flex flex-col w-3/4 md:w-2/3 lg:w-1/2 mx-auto mb-8">
            <li v-for="file in fileList" :key="file" class="flex justify-between text-white mt-4">
                <div class="flex space-x-2">
                    <IconDocument />
                    <span>{{ file }}</span>
                </div>
                <div class="space-x-2">
                    <button @click="deleteFile(file)">
                        <IconSubmenuDeleteFolder :color="'#553348'" />
                    </button>
                    <button @click="downloadFile(file)">
                        <IconDownload />
                    </button>
                </div>
            </li>
        </ul>
        <div class="flex justify-center">
            <div class="flex flex-col justify-center">
                <label for="fileInput" class="text-light-gray">
                    <div id="fileNameLabel" class="flex flex-col cursor-pointer justify-center text-light-gray">
                        <img class="mx-auto w-14 pb-2" src="~assets/images/upload-icon.svg" alt="folder icon">
                        <div>Téléverser un fichier</div>
                    </div>
                    <input type="file" id="fileInput" ref="fileInput" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        class="p-2 border rounded-md bg-neutral-300 text-neutral-800 focus:outline-none focus:border-amber-800"
                        @change="uploadFile" style="display: none;" />
                </label>
            </div>
        </div>

    </div>
</template>
  
<script>
import axios from 'axios'
import BurgerMenu from '@/components/BurgerMenu.vue'
import IconSubmenuDeleteFolder from '@/components/IconSubmenuDeleteFolder.vue'
import IconDocument from '@/components/IconDocument.vue'
import IconDownload from '@/components/IconDownload.vue'

export default {
    components: {
        BurgerMenu,
        IconSubmenuDeleteFolder,
        IconDocument,
        IconDownload,
    },

    data() {
        return {
            fileList: [],
            folderName: "",
        };
    },
    created() {
        this.loadFileList();
    },
    methods: {
        loadFileList() {
            const folderName = this.$route.params.folderName;
            if (process.client) {
                const jwtToken = localStorage.getItem('access_token');
                if (!jwtToken) {
                    console.error('Le jeton JWT n\'est pas disponible.');
                    this.$router.push('/');
                    return;
                }

                axios
                    .get(`http://localhost:5000/list_files/${folderName}`, {
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
        deleteFile(filename) {
            const jwtToken = localStorage.getItem('access_token');
            if (!jwtToken) {
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            axios
                .delete(`http://localhost:5000/delete_user_file/${this.folderName}/${filename}`, {
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
            const jwtToken = localStorage.getItem('access_token');
            if (!jwtToken) {
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            const axiosConfig = {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                responseType: 'blob',
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
        uploadFile() {
            const folderName = this.$route.params.folderName;
            const jwtToken = localStorage.getItem('access_token');
            if (!jwtToken) {
                console.error('Le jeton JWT n\'est pas disponible.');
                this.$router.push('/');
                return;
            }

            const formData = new FormData();
            const fileInput = this.$refs.fileInput;
            if (fileInput.files.length === 0) {
                console.error('Aucun fichier sélectionné.');
                return;
            }

            formData.append('file', fileInput.files[0]);

            axios
                .post(`http://localhost:5000/upload/${folderName}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    this.loadFileList();
                    fileInput.value = '';
                    console.log(response.data.message);
                })
                .catch((error) => console.error(error));
        },
    },
    mounted() {
        this.folderName = this.$route.params.folderName
    }
};
</script>
  
<style></style>
  