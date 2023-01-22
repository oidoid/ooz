import { NumXY } from '@/oidlib';

/** A cartesian position or dimensions. x and y are independent values. */
export interface XY<T> {
  x: T;
  y: T;
}

/**
 * XY numerical state with methods.
 *
 * Specifying a coercion function is almost always desirable. The coercions are:
 *
 * - Cast: throw if the result of the operation is out-of-range. Eg:
 *
 *     const xy = new U4XY(0, 0)
 *     xy.add(0, 16) // Throws
 *
 * - Clamp: saturate to the nearest limit if the result of the operation is
 *   out-of-range. Eg:
 *
 *     const xy = new UnumXY(1, 1)
 *     xy.subClamp(.5, 2) // (.5, 0)
 *
 *   Clamping is available on all fractional methods and integral methods where
 *   a fractional value is not possible.
 *
 * All argument type-checking is loose, ensuring only that `number`s or an
 * `XY<number>` is passed since out-of-range errors are extraordinarily easy to
 * induce for all types.
 */
export interface NumericalXY<T> extends XY<T> {
  /** Set x and y to their absolute values. */
  abs(): this;
  absClamp(): this;
  /** Add arguments to x and y. */
  add(x: number, y: number): this;
  add(xy: Readonly<XY<number>>): this;
  /** The product of x and y. */
  area: T;
  areaNum: number;
  areaClamp: T;
  /** Copy state as a new clone. */
  copy(): this;
  /** Divide x and y by arguments. */
  div(x: number, y: number): this;
  div(xy: Readonly<XY<number>>): this;
  /** Compare x and y to arguments. */
  eq(x: number, y: number): boolean;
  eq(xy: Readonly<XY<number>>): boolean;
  /** Given a triangle with sides x and y, the length of the hypotenuse. */
  magnitude: T;
  magnitudeNum: number;
  magnitudeClamp: T;
  /** Set x and y to the greater of themselves and arguments. */
  max(x: number, y: number): this;
  max(xy: Readonly<XY<number>>): this;
  /** Set x and y to the lesser of themselves and arguments. */
  min(x: number, y: number): this;
  min(xy: Readonly<XY<number>>): this;
  /** Multiply x and y by arguments. */
  mul(x: number, y: number): this;
  mul(xy: Readonly<XY<number>>): this;
  /** Set x and y to arguments. */
  set(x: number, y: number): this;
  set(xy: Readonly<XY<number>>): this;
  /** Subtract x and y by arguments. */
  sub(x: number, y: number): this;
  sub(xy: Readonly<XY<number>>): this;
  /** Copy state as plain JSON. */
  toJSON(): XY<T>;
  /** Copy state as a permissive double XY. */
  toNumXY(): NumXY;
  /** Copy state as a string. */
  toString(): string;
}

/**
 * XY integral state with methods.
 *
 * Even more so than `number` and `Unum` types, specifying a coercion function
 * is almost always desirable. The fractional coercions are:
 *
 * - Ceil: clamp and ceiling if the result of the operation is out-of-range. Eg:
 *
 *     const xy = new U4XY(0, 0)
 *     xy.addCeil(1.5, 16.5) // (2, 15)
 *
 * - Floor: clamp and floor if the result of the operation is out-of-range. Eg:
 *
 *     const xy = new U4XY(0, 0)
 *     xy.addFloor(1.5, 16.5) // (1, 15)
 *
 * - Round: clamp and round if the result of the operation is out-of-range. Eg:
 *
 *     const xy = new U4XY(0, 0)
 *     xy.addRound(1.5, 16.5) // (2, 15)
 *
 * - Trunc: clamp and truncate if the result of the operation is out-of-range.
 *   Eg:
 *
 *     const xy = new U4XY(0, 0)
 *     xy.addTrunc(1.5, 16.5) // (1, 15)
 */
export interface IntegralXY<T> extends NumericalXY<T> {
  addCeil(x: number, y: number): this;
  addCeil(xy: Readonly<XY<number>>): this;
  addFloor(x: number, y: number): this;
  addFloor(xy: Readonly<XY<number>>): this;
  addRound(x: number, y: number): this;
  addRound(xy: Readonly<XY<number>>): this;
  addTrunc(x: number, y: number): this;
  addTrunc(xy: Readonly<XY<number>>): this;

  divCeil(x: number, y: number): this;
  divCeil(xy: Readonly<XY<number>>): this;
  divFloor(x: number, y: number): this;
  divFloor(xy: Readonly<XY<number>>): this;
  divRound(x: number, y: number): this;
  divRound(xy: Readonly<XY<number>>): this;
  divTrunc(x: number, y: number): this;
  divTrunc(xy: Readonly<XY<number>>): this;

  maxCeil(x: number, y: number): this;
  maxCeil(xy: Readonly<XY<number>>): this;
  maxFloor(x: number, y: number): this;
  maxFloor(xy: Readonly<XY<number>>): this;
  maxRound(x: number, y: number): this;
  maxRound(xy: Readonly<XY<number>>): this;
  maxTrunc(x: number, y: number): this;
  maxTrunc(xy: Readonly<XY<number>>): this;

  minCeil(x: number, y: number): this;
  minCeil(xy: Readonly<XY<number>>): this;
  minFloor(x: number, y: number): this;
  minFloor(xy: Readonly<XY<number>>): this;
  minRound(x: number, y: number): this;
  minRound(xy: Readonly<XY<number>>): this;
  minTrunc(x: number, y: number): this;
  minTrunc(xy: Readonly<XY<number>>): this;

  mulCeil(x: number, y: number): this;
  mulCeil(xy: Readonly<XY<number>>): this;
  mulFloor(x: number, y: number): this;
  mulFloor(xy: Readonly<XY<number>>): this;
  mulRound(x: number, y: number): this;
  mulRound(xy: Readonly<XY<number>>): this;
  mulTrunc(x: number, y: number): this;
  mulTrunc(xy: Readonly<XY<number>>): this;

  setCeil(x: number, y: number): this;
  setCeil(xy: Readonly<XY<number>>): this;
  setFloor(x: number, y: number): this;
  setFloor(xy: Readonly<XY<number>>): this;
  setRound(x: number, y: number): this;
  setRound(xy: Readonly<XY<number>>): this;
  setTrunc(x: number, y: number): this;
  setTrunc(xy: Readonly<XY<number>>): this;

  subCeil(x: number, y: number): this;
  subCeil(xy: Readonly<XY<number>>): this;
  subFloor(x: number, y: number): this;
  subFloor(xy: Readonly<XY<number>>): this;
  subRound(x: number, y: number): this;
  subRound(xy: Readonly<XY<number>>): this;
  subTrunc(x: number, y: number): this;
  subTrunc(xy: Readonly<XY<number>>): this;
}

/** XY fractional state with methods. */
export interface FractionalXY<T> extends NumericalXY<T> {
  addClamp(x: number, y: number): this;
  addClamp(xy: Readonly<XY<number>>): this;
  divClamp(x: number, y: number): this;
  divClamp(xy: Readonly<XY<number>>): this;
  maxClamp(x: number, y: number): this;
  maxClamp(xy: Readonly<XY<number>>): this;
  minClamp(x: number, y: number): this;
  minClamp(xy: Readonly<XY<number>>): this;
  mulClamp(x: number, y: number): this;
  mulClamp(xy: Readonly<XY<number>>): this;
  setClamp(x: number, y: number): this;
  setClamp(xy: Readonly<XY<number>>): this;
  subClamp(x: number, y: number): this;
  subClamp(xy: Readonly<XY<number>>): this;
}