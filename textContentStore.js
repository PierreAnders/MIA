import { defineStore } from 'pinia';

export const useTextContentStore = defineStore('textContent', {
  state: () => ({
    textContent: '',
  }),
  actions: {
    setTextContent(newContent) {
      this.textContent = newContent;
    },
  },
});
