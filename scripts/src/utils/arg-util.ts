export const some = (...args: unknown[]) => args.some(Boolean)
export const none = (...args: unknown[]) => !some(...args)
