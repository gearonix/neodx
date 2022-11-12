export const isNotFalsy = Boolean as unknown as <T>(
  value: T | false | null | undefined | void
) => value is T;

export const entries = Object.entries as ObjectEntriesFn;
export const keys = Object.keys as ObjectKeysFn;
export const has = Object.hasOwn as ObjectHasFn;

export const filterRecord = <T>(
  record: T,
  fn: <K extends Extract<keyof T, string>>(value: T[K], key: K) => boolean
) => Object.fromEntries(entries(record).filter(([key, value]) => fn(value, key))) as T;

type ObjectEntry<T> = {
  [Key in Extract<keyof T, string>]: [Key, Exclude<T[Key], undefined>];
}[Extract<keyof T, string>];

export interface ObjectEntriesFn {
  <T>(target: T): ObjectEntry<T>[];
}

export interface ObjectKeysFn {
  <T>(target: T): Array<Extract<keyof T, string>>;
}

// TODO Probably, remove double types
export interface ObjectHasFn {
  <Key extends keyof T, T extends Record<keyof any, unknown>>(target: T, key: Key): target is T & {
    [K in Key]-?: Exclude<T[K], undefined | void | never>;
  };
  <Key extends keyof any, T extends Record<keyof any, unknown>>(target: T, key: Key): key is Key &
    keyof T;
}
