<template>
    <div class="min-h-screen px-8 pt-8">
        <BurgerMenu />
        <div class="flex items-center justify-center pt-8">
            <h1 class="pr-3 tracking-wider text-light-gray">HTML EDITOR</h1>
            <IconNote :color="'#334155'" />
        </div>
        <div class="flex flex-col items-center justify-center mt-10">
            <input
                class="w-56 w-3/4 h-8 px-4 mx-auto text-sm text-white border-2 rounded-md bg-dark-gray placeholder-light-gray border-dark-gray focus:outline-none focus:border-blue"
                type="text" v-model="note.title" placeholder="Title :">
            <div id="app" class="mx-auto mt-6 md:w-10/12">
                <editor :api-key="TINYMCE_API_KEY" ref="myEditor" :init="initOptions" v-model="textContent" />
            </div>
            <button class="pt-6 pb-12 text-white" @click="getHtmlFromEditor">
                <IconSave class="transition-transform transform hover:scale-110" />
            </button>
            <!-- <button class="text-white" @click="getMarkdownFromEditor">Enregistrer en Markdown</button> -->
        </div>
    </div>
</template>
 
<script>
import axios from 'axios'
import { BASE_URL } from '../constants.js'
import Editor from '@tinymce/tinymce-vue'
// import TurndownService from 'turndown'
import { TINYMCE_API_KEY } from '../constants.js'
import { ref, watchEffect } from 'vue';
import { useTextContentStore } from '../textContentStore';

export default {
    name: 'app',
    components: {
        'editor': Editor
    },
    data() {
        return {
            textContent: '',
            note: {
                title: '',
                content: ''
            },
            TINYMCE_API_KEY: TINYMCE_API_KEY,
            initOptions: {
                height: 600,
                menubar: true,
                plugins: [
                    'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
                    'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                    'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar:
                    'undo redo | casechange blocks | bold italic backcolor | \
                                                                alignleft aligncenter alignright alignjustify | \
                                                                bullist numlst checklist outdent indent | removeformat | a11ycheck code table help'
            }
        }
    },
    setup() {
        const textContentStore = useTextContentStore();

        const textContent = ref(textContentStore.textContent);

        // Update the local textContent when the store changes
        watchEffect(() => {
            textContent.value = textContentStore.textContent;
        });

        return {
            textContent,
            // ... other variables or functions you need ...
        };
    },
    methods: {
        // getHtmlFromEditor() {
        //     console.log(this.textContent);
        //     return this.textContent
        // },

        getHtmlFromEditor() {
            this.note.content = this.textContent;
            console.log(this.note.content);
            this.sendNoteInfo();
        },

        // getMarkdownFromEditor() {
        //     const turndownService = new TurndownService();
        //     const markdownContent = turndownService.turndown(this.textContent);
        //     console.log(markdownContent);
        //     this.note.content = markdownContent;
        //     this.sendNoteInfo();
        // },

        async sendNoteInfo() {
            try {
                const token = localStorage.getItem("access_token");
                console.log("la note", this.note);

                if (!token) {
                    console.error("Jeton JWT non trouvé.");
                    return;
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.post(`${BASE_URL}/notes`, this.note, { headers });

                if (response.status === 200) {
                    console.log("Enregistrement d'une nouvelle note'.")
                } else {
                    console.error("Échec de l'enregistrement d'une nouvelle note.");
                }
            } catch (error) {
                console.error("Erreur lors de la soumission d'une nouvelle note:", error);
            }
        },
    },
}
</script>