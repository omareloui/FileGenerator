import { log } from "../deps.ts";

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
