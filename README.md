# File Generator

<!--
## How to setup

```shell
# To start in dev mode
denon run

# To build binary
denon build

# To install the app globally
denon inst
```

## How it works

To add a template file create a file in the configured templates directory (you can change it from the `config/index.ts` file it defaults to `templates`). subdirectories will be separated with a dash (-) for the template name.

Any file with the name "base" it'll take its parent directory's name. You can change "base" in the config file.

### Example

A file tree like this (assuming the `template` directory is the root directory for templates)

```bash
templates
|
├───license
│       MIT
│       WTFPL
├───lit
│       base.ts
└───vue
        base.vue
```

The templates names will resolve to

- licence-mit
- licence-wtfpl
- lit
- vue

**After creating a file inside the templates directory that's all you'll need to define a template.**

Now you can run `fg <template-name>` from anywhere and it'll create that file in the CWD.

### Cli options

- Destination: you can change the destination of the generated file by adding `--dest` or `-d` followed by the target location.
- Filename: you can change the generated filename by adding `--rename` or `-r` followed by the required filename.

---

## More configuration

By default you don't need to add any configuration. **But** most of the time generating a file isn't enough; you'd need to change the content or the filename itself.

You can do this easily by adding configuration for the template inside `config/templates.ts`. You can add `props` to pass down to the template file. And/or `defaultFilename` to add a dynamic or static default filename.

FG uses **[dejs](https://deno.land/x/dejs@0.10.1)** templating engine, the Node's [ejs](https://ejs.co/) equivalent for Deno, to resolve the passed props.

### **Props**

#### **Props options**

- **default** the default value for the property.
- **isRequired** where it's required or not.
- **shouldAsk** whether should prompt for this property or just fallback to the default value.
- **hint** add a hint to show on prompting to collect the property value.

#### **Pass props to a template**

Assuming you have `template/template-name.ext` template file created, and defined as follows

`template/template.name.ext`

```ejs
<%= name %>
<% if (email) { %><%= email %><% } %>
<%= date %>
```

`config/template.ts`

```ts
const templatesConfig: TemplateConfig = {
  "template-name": {
    props: {
      name: { isRequired: true },
      email: { isRequired: false },
      date: { shouldAsk: false, default: new Date().getFullYear() },
    },
  },
};
```

#### You have 2 ways to pass props to a template

#### **1. Inline with the command**

You can pass the props as a flag followed with the property's value

```bash
gf template-name --name foo --email bar@baz.com
```

_This will generate the template as follows_

```ejs
foo
bar@baz.com
2021
```

#### **2. You get prompt to provide the props**

If you didn't pass all the _required_ props you'll get prompt to provide the missing props.

```bash
gf template-name
```

As you didn't pass the required name property you'll get prompt

![screen shot for prompting for props](/screen-shots/props-prompt.png)

But if you passed all required props (in this case the name property) it'll generate the template without prompting

```bash
gf template-name --name foo
```

This will generate the file without prompting for email.

#### **Template Utils**

By default there are utility functions that'll be passed to the templates generator. But you can extend them to you're own custom functions.

##### **Provided utility functions**

- _kebabToPascal_: will convert kebab-case string to PascalCase.
- _kebabToCamel_: will convert kebab-case string to camelCase.
- _kebabToLazy_: will convert kebab-case string to lazycase.
- _kebabToSnake_: will convert kebab-case string to snake_case.
- _kebabToScreamingSnake_: will convert kebab-case string to SCREAMING_SNAKE_CASE.

##### **Create your own utils**

To pass down a utility all you need to do is to export it from `config/templates-utils.ts`.

##### **How to use them**

You just use them as normal functions

```ejs
<%= kebabToPascal(name) %>
```

If provided name property was "foo-bar" it'll resolve to "FooBar".

---

### **Default Filename**

#### **Syntax**

- Any text surrounded by {} will be resolved from the provided props.
- Because most of the provided data will be passed in kebab-case, you can change the case from kebab-case by adding a comma and a one of these values
  - c for camelCase
  - p for PascalCase
  - l for lazycase
  - s for snake_case
  - ss for SCREAMING_SNAKE_CASE

##### **Examples**

```ts
const templatesConfig: TemplateConfig = {
  "template-name": {
    props: { name: { isRequired: true } },
    defaultFilename: "{name}",
  },
};

/*
Assuming
- the name's value will always be foo-bar.
- ext is the current template extension.

This is how the filename will be resolved

defaultFilename: "{name}"
filename -> foo-bar.ext

defaultFilename: "{name,p}"
filename -> FooBar.ext

defaultFilename: "{name,c}"
filename -> fooBar.ext

defaultFilename: "{name}.controller"
filename -> foo-bar.controller.ext

defaultFilename: "name"
filename -> name.ext

// No defaultFilename provided
filename -> template-name.ext
*/
```

-->

---

## License

MIT.
