export type ID = string;

export type ISODate = string;

/** "YYYY-MM-DD" */
export type DateString = string;

/** "HH:mm" em 24h */
export type TimeString = string;

export interface Timestamped {
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });
export const fail = <E = string>(error: E): Result<never, E> => ({ ok: false, error });
