import { defineStore, acceptHMRUpdate } from "pinia";

export const use<%= CaseConvertor.kebabToPascal(name) %>Store = defineStore("<%= %>", {
  state: () => ({}),

  getters: {},

  actions: {},
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(use<%= CaseConvertor.kebabToPascal(name) %>Store, import.meta.hot));
