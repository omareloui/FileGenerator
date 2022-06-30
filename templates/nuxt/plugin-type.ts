declare module '#app' {
  interface NuxtApp {
    $<%= CaseConvertor.kebabToCamel(name) %> ():
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $<%= CaseConvertor.kebabToCamel(name) %> ():
  }
}

export { }
