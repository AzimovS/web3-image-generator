export type Tuple<T, MaxLength extends number = 10, Current extends T[] = []> = Current["length"] extends MaxLength
  ? Current
  : Current | Tuple<T, MaxLength, [T, ...Current]>;

export type Post = {
  _id?: string;
  name: string;
  prompt: string;
  photo: string;
};
