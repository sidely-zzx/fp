type Func = (...arg: any[]) => any;

type NoPram<T extends Func> = () => ReturnType<T>;

type Head<T extends any[]> = T extends [T[0], ...any[]] ? T[0] : never;

type Tail<T extends any[]> = ((...arg: T) => any) extends (arg1: any, ...arg2: infer P) => any
  ? P
  : [];

type HastTail<T extends any[]> = T extends [] | [any] ? false : true;

type prepend<T, List extends any[]> = [T, ...List];

type prependN<N extends number | undefined, T, List extends any[]> = [...Tuple<T, N, []>, ...List];

type GetNumber<N extends number> = Length<Tuple<any, N, []>>;

type Last<T extends any[]> = {
  0: Last<Tail<T>>;
  1: Head<T>;
}[HastTail<T> extends true ? 0 : 1];

type Length<T extends any[]> = T['length'];

type Drop<N extends number | undefined, List extends any[], R extends any[] = []> = {
  0: Drop<N, Tail<List>, prepend<any, R>>;
  1: List;
}[Length<R> extends N ? 1 : 0];

type CurryDrop<N extends number | undefined, List extends any[], R extends any[] = []> = {
  0: Drop<N, Tail<List>, prepend<any, R>>;
  1: List;
  //  超过44，栈溢出
}[Length<R> extends 44 ? 1 : Length<R> extends N ? 1 : 0];

type Cast<X, Y> = X extends Y ? X : Y;

type Tuple<T, N extends number | undefined, List extends any[] = []> = Length<List> extends N
  ? List
  : Tuple<T, N, [...List, T]>;

type ClearNull<T> = { [P in keyof T]: NonNullable<T[P]> };

type Curry0<P extends any[], R> = <T extends Partial<P>>(
  ...arg: T
) => Drop<Length<T>, P> extends [any, ...any[]]
  ? Curry0<Cast<CurryDrop<Length<T>, P, []>, any[]>, R>
  : R;

type Curry<P extends any[], R, Len, NumberList extends any[] = []> = <
  T extends ClearNull<Partial<P>>
>(
  ...arg: T
) => Len extends 0
  ? Drop<Length<T>, P> extends [any, ...any[]]
    ? Curry<Cast<CurryDrop<Length<T>, P, []>, any[]>, R, Len>
    : R
  : Length<NumberList> extends Cast<Len, number>
  ? R
  : Curry<
      Cast<CurryDrop<Length<T>, P, []>, any[]>,
      R,
      Cast<Len, number>,
      prependN<Length<T>, any, NumberList>
    >;

declare function Curry<T extends Func, Len extends number>(
  fn: T,
  length?: Len
): Curry<Parameters<T>, ReturnType<T>, Len>;

type Pipe<T extends Func[]> = (...arg: Parameters<Head<T>>) => ReturnType<Last<T>>;

declare function pipe<T extends Func[]>(...fns: T): Pipe<T>;
