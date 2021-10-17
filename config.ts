import { resolve, dirname, fromFileUrl, log } from "./deps.ts";

const __dir = dirname(fromFileUrl(import.meta.url));

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: ({ msg: message, args }) => {
        let msg = message;
        args.forEach((arg, index) => {
          msg += `, arg${index}: ${arg}`;
        });
        return msg;
      },
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

const config = {
  TEMPLATES_DIR: resolve(__dir, "templates"),
  DEFAULT_FILENAME: "base",
  logger: log.getLogger(),
};

export default config;
