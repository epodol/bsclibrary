type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export default RecursivePartial;
