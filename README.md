# Custom template files generator

## How to setup

```shell
# To start in dev mode
denon run

# To build binary
denon build

# To install the app globally
denon inst
```

## Templates

To add a file template add it to the template directory. Directories will be separated with a dash (-) for the template name.

Any file with the name "base" it'll take its parent directory's name. You can change "base" in the config file.

## TODO

- [x] Make it possible to provide the template with data to override defaults.

  - [x] Use [dejs](https://deno.land/x/dejs@0.10.1) to resolve the files.
  - [x] Create a JSON file to hold the templates' data that it'll require to be able to pass it to dejs.
  - [x] Find a way to retrieve the data from the user.

- [x] Add default file name field to template config.

- [ ] Create a project generator.

## Bugs to fix

- [x] The created file overrides existing ones, fix this.
- [x] Run `deno mod.ts vue vue`. It'll keep create the file infinitely.

## License

MIT.
