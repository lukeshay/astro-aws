const some = (...args: unknown[]) => args.some(Boolean);
const none = (...args: unknown[]) => !some(...args);

export { some, none };
