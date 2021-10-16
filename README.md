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

## Todo

- [x] Add a rename thingy.
- [ ] Copy the file if it exists with another name.
- [ ] Search for a prompt for Deno.
- [ ] Add generate whole projects option?

## License

MIT.
