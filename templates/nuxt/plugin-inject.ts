export default defineNuxtPlugin(() => {
  return {
    provide: {
      <%= CaseConvertor.kebabToCamel(name) %>: () => {}
    }
  }
})
