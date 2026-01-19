
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model LoginAttempts
 * 
 */
export type LoginAttempts = $Result.DefaultSelection<Prisma.$LoginAttemptsPayload>
/**
 * Model IpBlock
 * 
 */
export type IpBlock = $Result.DefaultSelection<Prisma.$IpBlockPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  controleur: 'controleur',
  chef_service: 'chef_service',
  agent: 'agent'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loginAttempts`: Exposes CRUD operations for the **LoginAttempts** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoginAttempts
    * const loginAttempts = await prisma.loginAttempts.findMany()
    * ```
    */
  get loginAttempts(): Prisma.LoginAttemptsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ipBlock`: Exposes CRUD operations for the **IpBlock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IpBlocks
    * const ipBlocks = await prisma.ipBlock.findMany()
    * ```
    */
  get ipBlock(): Prisma.IpBlockDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    LoginAttempts: 'LoginAttempts',
    IpBlock: 'IpBlock'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "loginAttempts" | "ipBlock"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      LoginAttempts: {
        payload: Prisma.$LoginAttemptsPayload<ExtArgs>
        fields: Prisma.LoginAttemptsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoginAttemptsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoginAttemptsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload>
          }
          findFirst: {
            args: Prisma.LoginAttemptsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoginAttemptsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload>
          }
          findMany: {
            args: Prisma.LoginAttemptsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload>[]
          }
          create: {
            args: Prisma.LoginAttemptsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload>
          }
          createMany: {
            args: Prisma.LoginAttemptsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoginAttemptsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload>[]
          }
          delete: {
            args: Prisma.LoginAttemptsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload>
          }
          update: {
            args: Prisma.LoginAttemptsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload>
          }
          deleteMany: {
            args: Prisma.LoginAttemptsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoginAttemptsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoginAttemptsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload>[]
          }
          upsert: {
            args: Prisma.LoginAttemptsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginAttemptsPayload>
          }
          aggregate: {
            args: Prisma.LoginAttemptsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoginAttempts>
          }
          groupBy: {
            args: Prisma.LoginAttemptsGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoginAttemptsGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoginAttemptsCountArgs<ExtArgs>
            result: $Utils.Optional<LoginAttemptsCountAggregateOutputType> | number
          }
        }
      }
      IpBlock: {
        payload: Prisma.$IpBlockPayload<ExtArgs>
        fields: Prisma.IpBlockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IpBlockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IpBlockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload>
          }
          findFirst: {
            args: Prisma.IpBlockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IpBlockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload>
          }
          findMany: {
            args: Prisma.IpBlockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload>[]
          }
          create: {
            args: Prisma.IpBlockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload>
          }
          createMany: {
            args: Prisma.IpBlockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IpBlockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload>[]
          }
          delete: {
            args: Prisma.IpBlockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload>
          }
          update: {
            args: Prisma.IpBlockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload>
          }
          deleteMany: {
            args: Prisma.IpBlockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IpBlockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IpBlockUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload>[]
          }
          upsert: {
            args: Prisma.IpBlockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IpBlockPayload>
          }
          aggregate: {
            args: Prisma.IpBlockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIpBlock>
          }
          groupBy: {
            args: Prisma.IpBlockGroupByArgs<ExtArgs>
            result: $Utils.Optional<IpBlockGroupByOutputType>[]
          }
          count: {
            args: Prisma.IpBlockCountArgs<ExtArgs>
            result: $Utils.Optional<IpBlockCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    loginAttempts?: LoginAttemptsOmit
    ipBlock?: IpBlockOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    LoginAttempts: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    LoginAttempts?: boolean | UserCountOutputTypeCountLoginAttemptsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLoginAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginAttemptsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type UserSumAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    nom: string | null
    prenom: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    failedLoginAttempts: number | null
    lockedUntil: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    nom: string | null
    prenom: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    failedLoginAttempts: number | null
    lockedUntil: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    nom: number
    prenom: number
    role: number
    createdAt: number
    failedLoginAttempts: number
    lockedUntil: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type UserSumAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nom?: true
    prenom?: true
    role?: true
    createdAt?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nom?: true
    prenom?: true
    role?: true
    createdAt?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    nom?: true
    prenom?: true
    role?: true
    createdAt?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    nom: string
    prenom: string
    role: $Enums.Role
    createdAt: Date
    failedLoginAttempts: number
    lockedUntil: Date | null
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    nom?: boolean
    prenom?: boolean
    role?: boolean
    createdAt?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    updatedAt?: boolean
    LoginAttempts?: boolean | User$LoginAttemptsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    nom?: boolean
    prenom?: boolean
    role?: boolean
    createdAt?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    nom?: boolean
    prenom?: boolean
    role?: boolean
    createdAt?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    nom?: boolean
    prenom?: boolean
    role?: boolean
    createdAt?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "nom" | "prenom" | "role" | "createdAt" | "failedLoginAttempts" | "lockedUntil" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    LoginAttempts?: boolean | User$LoginAttemptsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      LoginAttempts: Prisma.$LoginAttemptsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      nom: string
      prenom: string
      role: $Enums.Role
      createdAt: Date
      failedLoginAttempts: number
      lockedUntil: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    LoginAttempts<T extends User$LoginAttemptsArgs<ExtArgs> = {}>(args?: Subset<T, User$LoginAttemptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly nom: FieldRef<"User", 'String'>
    readonly prenom: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly failedLoginAttempts: FieldRef<"User", 'Int'>
    readonly lockedUntil: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.LoginAttempts
   */
  export type User$LoginAttemptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    where?: LoginAttemptsWhereInput
    orderBy?: LoginAttemptsOrderByWithRelationInput | LoginAttemptsOrderByWithRelationInput[]
    cursor?: LoginAttemptsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoginAttemptsScalarFieldEnum | LoginAttemptsScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model LoginAttempts
   */

  export type AggregateLoginAttempts = {
    _count: LoginAttemptsCountAggregateOutputType | null
    _min: LoginAttemptsMinAggregateOutputType | null
    _max: LoginAttemptsMaxAggregateOutputType | null
  }

  export type LoginAttemptsMinAggregateOutputType = {
    id: string | null
    emailName: string | null
    success: boolean | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type LoginAttemptsMaxAggregateOutputType = {
    id: string | null
    emailName: string | null
    success: boolean | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type LoginAttemptsCountAggregateOutputType = {
    id: number
    emailName: number
    success: number
    ipAddress: number
    createdAt: number
    _all: number
  }


  export type LoginAttemptsMinAggregateInputType = {
    id?: true
    emailName?: true
    success?: true
    ipAddress?: true
    createdAt?: true
  }

  export type LoginAttemptsMaxAggregateInputType = {
    id?: true
    emailName?: true
    success?: true
    ipAddress?: true
    createdAt?: true
  }

  export type LoginAttemptsCountAggregateInputType = {
    id?: true
    emailName?: true
    success?: true
    ipAddress?: true
    createdAt?: true
    _all?: true
  }

  export type LoginAttemptsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginAttempts to aggregate.
     */
    where?: LoginAttemptsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAttempts to fetch.
     */
    orderBy?: LoginAttemptsOrderByWithRelationInput | LoginAttemptsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoginAttemptsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoginAttempts
    **/
    _count?: true | LoginAttemptsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoginAttemptsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoginAttemptsMaxAggregateInputType
  }

  export type GetLoginAttemptsAggregateType<T extends LoginAttemptsAggregateArgs> = {
        [P in keyof T & keyof AggregateLoginAttempts]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoginAttempts[P]>
      : GetScalarType<T[P], AggregateLoginAttempts[P]>
  }




  export type LoginAttemptsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginAttemptsWhereInput
    orderBy?: LoginAttemptsOrderByWithAggregationInput | LoginAttemptsOrderByWithAggregationInput[]
    by: LoginAttemptsScalarFieldEnum[] | LoginAttemptsScalarFieldEnum
    having?: LoginAttemptsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoginAttemptsCountAggregateInputType | true
    _min?: LoginAttemptsMinAggregateInputType
    _max?: LoginAttemptsMaxAggregateInputType
  }

  export type LoginAttemptsGroupByOutputType = {
    id: string
    emailName: string
    success: boolean
    ipAddress: string
    createdAt: Date
    _count: LoginAttemptsCountAggregateOutputType | null
    _min: LoginAttemptsMinAggregateOutputType | null
    _max: LoginAttemptsMaxAggregateOutputType | null
  }

  type GetLoginAttemptsGroupByPayload<T extends LoginAttemptsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoginAttemptsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoginAttemptsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoginAttemptsGroupByOutputType[P]>
            : GetScalarType<T[P], LoginAttemptsGroupByOutputType[P]>
        }
      >
    >


  export type LoginAttemptsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    emailName?: boolean
    success?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    email?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginAttempts"]>

  export type LoginAttemptsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    emailName?: boolean
    success?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    email?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginAttempts"]>

  export type LoginAttemptsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    emailName?: boolean
    success?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    email?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginAttempts"]>

  export type LoginAttemptsSelectScalar = {
    id?: boolean
    emailName?: boolean
    success?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }

  export type LoginAttemptsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "emailName" | "success" | "ipAddress" | "createdAt", ExtArgs["result"]["loginAttempts"]>
  export type LoginAttemptsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    email?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LoginAttemptsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    email?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LoginAttemptsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    email?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LoginAttemptsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoginAttempts"
    objects: {
      email: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      emailName: string
      success: boolean
      ipAddress: string
      createdAt: Date
    }, ExtArgs["result"]["loginAttempts"]>
    composites: {}
  }

  type LoginAttemptsGetPayload<S extends boolean | null | undefined | LoginAttemptsDefaultArgs> = $Result.GetResult<Prisma.$LoginAttemptsPayload, S>

  type LoginAttemptsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoginAttemptsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoginAttemptsCountAggregateInputType | true
    }

  export interface LoginAttemptsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoginAttempts'], meta: { name: 'LoginAttempts' } }
    /**
     * Find zero or one LoginAttempts that matches the filter.
     * @param {LoginAttemptsFindUniqueArgs} args - Arguments to find a LoginAttempts
     * @example
     * // Get one LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoginAttemptsFindUniqueArgs>(args: SelectSubset<T, LoginAttemptsFindUniqueArgs<ExtArgs>>): Prisma__LoginAttemptsClient<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoginAttempts that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoginAttemptsFindUniqueOrThrowArgs} args - Arguments to find a LoginAttempts
     * @example
     * // Get one LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoginAttemptsFindUniqueOrThrowArgs>(args: SelectSubset<T, LoginAttemptsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoginAttemptsClient<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptsFindFirstArgs} args - Arguments to find a LoginAttempts
     * @example
     * // Get one LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoginAttemptsFindFirstArgs>(args?: SelectSubset<T, LoginAttemptsFindFirstArgs<ExtArgs>>): Prisma__LoginAttemptsClient<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginAttempts that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptsFindFirstOrThrowArgs} args - Arguments to find a LoginAttempts
     * @example
     * // Get one LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoginAttemptsFindFirstOrThrowArgs>(args?: SelectSubset<T, LoginAttemptsFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoginAttemptsClient<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoginAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.findMany()
     * 
     * // Get first 10 LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loginAttemptsWithIdOnly = await prisma.loginAttempts.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoginAttemptsFindManyArgs>(args?: SelectSubset<T, LoginAttemptsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoginAttempts.
     * @param {LoginAttemptsCreateArgs} args - Arguments to create a LoginAttempts.
     * @example
     * // Create one LoginAttempts
     * const LoginAttempts = await prisma.loginAttempts.create({
     *   data: {
     *     // ... data to create a LoginAttempts
     *   }
     * })
     * 
     */
    create<T extends LoginAttemptsCreateArgs>(args: SelectSubset<T, LoginAttemptsCreateArgs<ExtArgs>>): Prisma__LoginAttemptsClient<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoginAttempts.
     * @param {LoginAttemptsCreateManyArgs} args - Arguments to create many LoginAttempts.
     * @example
     * // Create many LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoginAttemptsCreateManyArgs>(args?: SelectSubset<T, LoginAttemptsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoginAttempts and returns the data saved in the database.
     * @param {LoginAttemptsCreateManyAndReturnArgs} args - Arguments to create many LoginAttempts.
     * @example
     * // Create many LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LoginAttempts and only return the `id`
     * const loginAttemptsWithIdOnly = await prisma.loginAttempts.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoginAttemptsCreateManyAndReturnArgs>(args?: SelectSubset<T, LoginAttemptsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LoginAttempts.
     * @param {LoginAttemptsDeleteArgs} args - Arguments to delete one LoginAttempts.
     * @example
     * // Delete one LoginAttempts
     * const LoginAttempts = await prisma.loginAttempts.delete({
     *   where: {
     *     // ... filter to delete one LoginAttempts
     *   }
     * })
     * 
     */
    delete<T extends LoginAttemptsDeleteArgs>(args: SelectSubset<T, LoginAttemptsDeleteArgs<ExtArgs>>): Prisma__LoginAttemptsClient<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoginAttempts.
     * @param {LoginAttemptsUpdateArgs} args - Arguments to update one LoginAttempts.
     * @example
     * // Update one LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoginAttemptsUpdateArgs>(args: SelectSubset<T, LoginAttemptsUpdateArgs<ExtArgs>>): Prisma__LoginAttemptsClient<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoginAttempts.
     * @param {LoginAttemptsDeleteManyArgs} args - Arguments to filter LoginAttempts to delete.
     * @example
     * // Delete a few LoginAttempts
     * const { count } = await prisma.loginAttempts.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoginAttemptsDeleteManyArgs>(args?: SelectSubset<T, LoginAttemptsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoginAttemptsUpdateManyArgs>(args: SelectSubset<T, LoginAttemptsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginAttempts and returns the data updated in the database.
     * @param {LoginAttemptsUpdateManyAndReturnArgs} args - Arguments to update many LoginAttempts.
     * @example
     * // Update many LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LoginAttempts and only return the `id`
     * const loginAttemptsWithIdOnly = await prisma.loginAttempts.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoginAttemptsUpdateManyAndReturnArgs>(args: SelectSubset<T, LoginAttemptsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LoginAttempts.
     * @param {LoginAttemptsUpsertArgs} args - Arguments to update or create a LoginAttempts.
     * @example
     * // Update or create a LoginAttempts
     * const loginAttempts = await prisma.loginAttempts.upsert({
     *   create: {
     *     // ... data to create a LoginAttempts
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoginAttempts we want to update
     *   }
     * })
     */
    upsert<T extends LoginAttemptsUpsertArgs>(args: SelectSubset<T, LoginAttemptsUpsertArgs<ExtArgs>>): Prisma__LoginAttemptsClient<$Result.GetResult<Prisma.$LoginAttemptsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoginAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptsCountArgs} args - Arguments to filter LoginAttempts to count.
     * @example
     * // Count the number of LoginAttempts
     * const count = await prisma.loginAttempts.count({
     *   where: {
     *     // ... the filter for the LoginAttempts we want to count
     *   }
     * })
    **/
    count<T extends LoginAttemptsCountArgs>(
      args?: Subset<T, LoginAttemptsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoginAttemptsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoginAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoginAttemptsAggregateArgs>(args: Subset<T, LoginAttemptsAggregateArgs>): Prisma.PrismaPromise<GetLoginAttemptsAggregateType<T>>

    /**
     * Group by LoginAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginAttemptsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoginAttemptsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoginAttemptsGroupByArgs['orderBy'] }
        : { orderBy?: LoginAttemptsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoginAttemptsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoginAttemptsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoginAttempts model
   */
  readonly fields: LoginAttemptsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoginAttempts.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoginAttemptsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    email<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoginAttempts model
   */
  interface LoginAttemptsFieldRefs {
    readonly id: FieldRef<"LoginAttempts", 'String'>
    readonly emailName: FieldRef<"LoginAttempts", 'String'>
    readonly success: FieldRef<"LoginAttempts", 'Boolean'>
    readonly ipAddress: FieldRef<"LoginAttempts", 'String'>
    readonly createdAt: FieldRef<"LoginAttempts", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoginAttempts findUnique
   */
  export type LoginAttemptsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempts to fetch.
     */
    where: LoginAttemptsWhereUniqueInput
  }

  /**
   * LoginAttempts findUniqueOrThrow
   */
  export type LoginAttemptsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempts to fetch.
     */
    where: LoginAttemptsWhereUniqueInput
  }

  /**
   * LoginAttempts findFirst
   */
  export type LoginAttemptsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempts to fetch.
     */
    where?: LoginAttemptsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAttempts to fetch.
     */
    orderBy?: LoginAttemptsOrderByWithRelationInput | LoginAttemptsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginAttempts.
     */
    cursor?: LoginAttemptsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginAttempts.
     */
    distinct?: LoginAttemptsScalarFieldEnum | LoginAttemptsScalarFieldEnum[]
  }

  /**
   * LoginAttempts findFirstOrThrow
   */
  export type LoginAttemptsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempts to fetch.
     */
    where?: LoginAttemptsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAttempts to fetch.
     */
    orderBy?: LoginAttemptsOrderByWithRelationInput | LoginAttemptsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginAttempts.
     */
    cursor?: LoginAttemptsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginAttempts.
     */
    distinct?: LoginAttemptsScalarFieldEnum | LoginAttemptsScalarFieldEnum[]
  }

  /**
   * LoginAttempts findMany
   */
  export type LoginAttemptsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    /**
     * Filter, which LoginAttempts to fetch.
     */
    where?: LoginAttemptsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginAttempts to fetch.
     */
    orderBy?: LoginAttemptsOrderByWithRelationInput | LoginAttemptsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoginAttempts.
     */
    cursor?: LoginAttemptsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginAttempts.
     */
    skip?: number
    distinct?: LoginAttemptsScalarFieldEnum | LoginAttemptsScalarFieldEnum[]
  }

  /**
   * LoginAttempts create
   */
  export type LoginAttemptsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    /**
     * The data needed to create a LoginAttempts.
     */
    data: XOR<LoginAttemptsCreateInput, LoginAttemptsUncheckedCreateInput>
  }

  /**
   * LoginAttempts createMany
   */
  export type LoginAttemptsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoginAttempts.
     */
    data: LoginAttemptsCreateManyInput | LoginAttemptsCreateManyInput[]
  }

  /**
   * LoginAttempts createManyAndReturn
   */
  export type LoginAttemptsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * The data used to create many LoginAttempts.
     */
    data: LoginAttemptsCreateManyInput | LoginAttemptsCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginAttempts update
   */
  export type LoginAttemptsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    /**
     * The data needed to update a LoginAttempts.
     */
    data: XOR<LoginAttemptsUpdateInput, LoginAttemptsUncheckedUpdateInput>
    /**
     * Choose, which LoginAttempts to update.
     */
    where: LoginAttemptsWhereUniqueInput
  }

  /**
   * LoginAttempts updateMany
   */
  export type LoginAttemptsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoginAttempts.
     */
    data: XOR<LoginAttemptsUpdateManyMutationInput, LoginAttemptsUncheckedUpdateManyInput>
    /**
     * Filter which LoginAttempts to update
     */
    where?: LoginAttemptsWhereInput
    /**
     * Limit how many LoginAttempts to update.
     */
    limit?: number
  }

  /**
   * LoginAttempts updateManyAndReturn
   */
  export type LoginAttemptsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * The data used to update LoginAttempts.
     */
    data: XOR<LoginAttemptsUpdateManyMutationInput, LoginAttemptsUncheckedUpdateManyInput>
    /**
     * Filter which LoginAttempts to update
     */
    where?: LoginAttemptsWhereInput
    /**
     * Limit how many LoginAttempts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginAttempts upsert
   */
  export type LoginAttemptsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    /**
     * The filter to search for the LoginAttempts to update in case it exists.
     */
    where: LoginAttemptsWhereUniqueInput
    /**
     * In case the LoginAttempts found by the `where` argument doesn't exist, create a new LoginAttempts with this data.
     */
    create: XOR<LoginAttemptsCreateInput, LoginAttemptsUncheckedCreateInput>
    /**
     * In case the LoginAttempts was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoginAttemptsUpdateInput, LoginAttemptsUncheckedUpdateInput>
  }

  /**
   * LoginAttempts delete
   */
  export type LoginAttemptsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
    /**
     * Filter which LoginAttempts to delete.
     */
    where: LoginAttemptsWhereUniqueInput
  }

  /**
   * LoginAttempts deleteMany
   */
  export type LoginAttemptsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginAttempts to delete
     */
    where?: LoginAttemptsWhereInput
    /**
     * Limit how many LoginAttempts to delete.
     */
    limit?: number
  }

  /**
   * LoginAttempts without action
   */
  export type LoginAttemptsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginAttempts
     */
    select?: LoginAttemptsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginAttempts
     */
    omit?: LoginAttemptsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginAttemptsInclude<ExtArgs> | null
  }


  /**
   * Model IpBlock
   */

  export type AggregateIpBlock = {
    _count: IpBlockCountAggregateOutputType | null
    _avg: IpBlockAvgAggregateOutputType | null
    _sum: IpBlockSumAggregateOutputType | null
    _min: IpBlockMinAggregateOutputType | null
    _max: IpBlockMaxAggregateOutputType | null
  }

  export type IpBlockAvgAggregateOutputType = {
    failedAttempts: number | null
  }

  export type IpBlockSumAggregateOutputType = {
    failedAttempts: number | null
  }

  export type IpBlockMinAggregateOutputType = {
    id: string | null
    ipAddress: string | null
    failedAttempts: number | null
    blockedUntil: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IpBlockMaxAggregateOutputType = {
    id: string | null
    ipAddress: string | null
    failedAttempts: number | null
    blockedUntil: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IpBlockCountAggregateOutputType = {
    id: number
    ipAddress: number
    failedAttempts: number
    blockedUntil: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type IpBlockAvgAggregateInputType = {
    failedAttempts?: true
  }

  export type IpBlockSumAggregateInputType = {
    failedAttempts?: true
  }

  export type IpBlockMinAggregateInputType = {
    id?: true
    ipAddress?: true
    failedAttempts?: true
    blockedUntil?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IpBlockMaxAggregateInputType = {
    id?: true
    ipAddress?: true
    failedAttempts?: true
    blockedUntil?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IpBlockCountAggregateInputType = {
    id?: true
    ipAddress?: true
    failedAttempts?: true
    blockedUntil?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type IpBlockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IpBlock to aggregate.
     */
    where?: IpBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IpBlocks to fetch.
     */
    orderBy?: IpBlockOrderByWithRelationInput | IpBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IpBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IpBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IpBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IpBlocks
    **/
    _count?: true | IpBlockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IpBlockAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IpBlockSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IpBlockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IpBlockMaxAggregateInputType
  }

  export type GetIpBlockAggregateType<T extends IpBlockAggregateArgs> = {
        [P in keyof T & keyof AggregateIpBlock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIpBlock[P]>
      : GetScalarType<T[P], AggregateIpBlock[P]>
  }




  export type IpBlockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IpBlockWhereInput
    orderBy?: IpBlockOrderByWithAggregationInput | IpBlockOrderByWithAggregationInput[]
    by: IpBlockScalarFieldEnum[] | IpBlockScalarFieldEnum
    having?: IpBlockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IpBlockCountAggregateInputType | true
    _avg?: IpBlockAvgAggregateInputType
    _sum?: IpBlockSumAggregateInputType
    _min?: IpBlockMinAggregateInputType
    _max?: IpBlockMaxAggregateInputType
  }

  export type IpBlockGroupByOutputType = {
    id: string
    ipAddress: string
    failedAttempts: number
    blockedUntil: Date | null
    createdAt: Date
    updatedAt: Date
    _count: IpBlockCountAggregateOutputType | null
    _avg: IpBlockAvgAggregateOutputType | null
    _sum: IpBlockSumAggregateOutputType | null
    _min: IpBlockMinAggregateOutputType | null
    _max: IpBlockMaxAggregateOutputType | null
  }

  type GetIpBlockGroupByPayload<T extends IpBlockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IpBlockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IpBlockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IpBlockGroupByOutputType[P]>
            : GetScalarType<T[P], IpBlockGroupByOutputType[P]>
        }
      >
    >


  export type IpBlockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ipAddress?: boolean
    failedAttempts?: boolean
    blockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ipBlock"]>

  export type IpBlockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ipAddress?: boolean
    failedAttempts?: boolean
    blockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ipBlock"]>

  export type IpBlockSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ipAddress?: boolean
    failedAttempts?: boolean
    blockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ipBlock"]>

  export type IpBlockSelectScalar = {
    id?: boolean
    ipAddress?: boolean
    failedAttempts?: boolean
    blockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type IpBlockOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ipAddress" | "failedAttempts" | "blockedUntil" | "createdAt" | "updatedAt", ExtArgs["result"]["ipBlock"]>

  export type $IpBlockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IpBlock"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ipAddress: string
      failedAttempts: number
      blockedUntil: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ipBlock"]>
    composites: {}
  }

  type IpBlockGetPayload<S extends boolean | null | undefined | IpBlockDefaultArgs> = $Result.GetResult<Prisma.$IpBlockPayload, S>

  type IpBlockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IpBlockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IpBlockCountAggregateInputType | true
    }

  export interface IpBlockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IpBlock'], meta: { name: 'IpBlock' } }
    /**
     * Find zero or one IpBlock that matches the filter.
     * @param {IpBlockFindUniqueArgs} args - Arguments to find a IpBlock
     * @example
     * // Get one IpBlock
     * const ipBlock = await prisma.ipBlock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IpBlockFindUniqueArgs>(args: SelectSubset<T, IpBlockFindUniqueArgs<ExtArgs>>): Prisma__IpBlockClient<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IpBlock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IpBlockFindUniqueOrThrowArgs} args - Arguments to find a IpBlock
     * @example
     * // Get one IpBlock
     * const ipBlock = await prisma.ipBlock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IpBlockFindUniqueOrThrowArgs>(args: SelectSubset<T, IpBlockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IpBlockClient<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IpBlock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IpBlockFindFirstArgs} args - Arguments to find a IpBlock
     * @example
     * // Get one IpBlock
     * const ipBlock = await prisma.ipBlock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IpBlockFindFirstArgs>(args?: SelectSubset<T, IpBlockFindFirstArgs<ExtArgs>>): Prisma__IpBlockClient<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IpBlock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IpBlockFindFirstOrThrowArgs} args - Arguments to find a IpBlock
     * @example
     * // Get one IpBlock
     * const ipBlock = await prisma.ipBlock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IpBlockFindFirstOrThrowArgs>(args?: SelectSubset<T, IpBlockFindFirstOrThrowArgs<ExtArgs>>): Prisma__IpBlockClient<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IpBlocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IpBlockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IpBlocks
     * const ipBlocks = await prisma.ipBlock.findMany()
     * 
     * // Get first 10 IpBlocks
     * const ipBlocks = await prisma.ipBlock.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ipBlockWithIdOnly = await prisma.ipBlock.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IpBlockFindManyArgs>(args?: SelectSubset<T, IpBlockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IpBlock.
     * @param {IpBlockCreateArgs} args - Arguments to create a IpBlock.
     * @example
     * // Create one IpBlock
     * const IpBlock = await prisma.ipBlock.create({
     *   data: {
     *     // ... data to create a IpBlock
     *   }
     * })
     * 
     */
    create<T extends IpBlockCreateArgs>(args: SelectSubset<T, IpBlockCreateArgs<ExtArgs>>): Prisma__IpBlockClient<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IpBlocks.
     * @param {IpBlockCreateManyArgs} args - Arguments to create many IpBlocks.
     * @example
     * // Create many IpBlocks
     * const ipBlock = await prisma.ipBlock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IpBlockCreateManyArgs>(args?: SelectSubset<T, IpBlockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IpBlocks and returns the data saved in the database.
     * @param {IpBlockCreateManyAndReturnArgs} args - Arguments to create many IpBlocks.
     * @example
     * // Create many IpBlocks
     * const ipBlock = await prisma.ipBlock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IpBlocks and only return the `id`
     * const ipBlockWithIdOnly = await prisma.ipBlock.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IpBlockCreateManyAndReturnArgs>(args?: SelectSubset<T, IpBlockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IpBlock.
     * @param {IpBlockDeleteArgs} args - Arguments to delete one IpBlock.
     * @example
     * // Delete one IpBlock
     * const IpBlock = await prisma.ipBlock.delete({
     *   where: {
     *     // ... filter to delete one IpBlock
     *   }
     * })
     * 
     */
    delete<T extends IpBlockDeleteArgs>(args: SelectSubset<T, IpBlockDeleteArgs<ExtArgs>>): Prisma__IpBlockClient<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IpBlock.
     * @param {IpBlockUpdateArgs} args - Arguments to update one IpBlock.
     * @example
     * // Update one IpBlock
     * const ipBlock = await prisma.ipBlock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IpBlockUpdateArgs>(args: SelectSubset<T, IpBlockUpdateArgs<ExtArgs>>): Prisma__IpBlockClient<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IpBlocks.
     * @param {IpBlockDeleteManyArgs} args - Arguments to filter IpBlocks to delete.
     * @example
     * // Delete a few IpBlocks
     * const { count } = await prisma.ipBlock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IpBlockDeleteManyArgs>(args?: SelectSubset<T, IpBlockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IpBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IpBlockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IpBlocks
     * const ipBlock = await prisma.ipBlock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IpBlockUpdateManyArgs>(args: SelectSubset<T, IpBlockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IpBlocks and returns the data updated in the database.
     * @param {IpBlockUpdateManyAndReturnArgs} args - Arguments to update many IpBlocks.
     * @example
     * // Update many IpBlocks
     * const ipBlock = await prisma.ipBlock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IpBlocks and only return the `id`
     * const ipBlockWithIdOnly = await prisma.ipBlock.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IpBlockUpdateManyAndReturnArgs>(args: SelectSubset<T, IpBlockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IpBlock.
     * @param {IpBlockUpsertArgs} args - Arguments to update or create a IpBlock.
     * @example
     * // Update or create a IpBlock
     * const ipBlock = await prisma.ipBlock.upsert({
     *   create: {
     *     // ... data to create a IpBlock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IpBlock we want to update
     *   }
     * })
     */
    upsert<T extends IpBlockUpsertArgs>(args: SelectSubset<T, IpBlockUpsertArgs<ExtArgs>>): Prisma__IpBlockClient<$Result.GetResult<Prisma.$IpBlockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IpBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IpBlockCountArgs} args - Arguments to filter IpBlocks to count.
     * @example
     * // Count the number of IpBlocks
     * const count = await prisma.ipBlock.count({
     *   where: {
     *     // ... the filter for the IpBlocks we want to count
     *   }
     * })
    **/
    count<T extends IpBlockCountArgs>(
      args?: Subset<T, IpBlockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IpBlockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IpBlock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IpBlockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IpBlockAggregateArgs>(args: Subset<T, IpBlockAggregateArgs>): Prisma.PrismaPromise<GetIpBlockAggregateType<T>>

    /**
     * Group by IpBlock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IpBlockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IpBlockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IpBlockGroupByArgs['orderBy'] }
        : { orderBy?: IpBlockGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IpBlockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIpBlockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IpBlock model
   */
  readonly fields: IpBlockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IpBlock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IpBlockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IpBlock model
   */
  interface IpBlockFieldRefs {
    readonly id: FieldRef<"IpBlock", 'String'>
    readonly ipAddress: FieldRef<"IpBlock", 'String'>
    readonly failedAttempts: FieldRef<"IpBlock", 'Int'>
    readonly blockedUntil: FieldRef<"IpBlock", 'DateTime'>
    readonly createdAt: FieldRef<"IpBlock", 'DateTime'>
    readonly updatedAt: FieldRef<"IpBlock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IpBlock findUnique
   */
  export type IpBlockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * Filter, which IpBlock to fetch.
     */
    where: IpBlockWhereUniqueInput
  }

  /**
   * IpBlock findUniqueOrThrow
   */
  export type IpBlockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * Filter, which IpBlock to fetch.
     */
    where: IpBlockWhereUniqueInput
  }

  /**
   * IpBlock findFirst
   */
  export type IpBlockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * Filter, which IpBlock to fetch.
     */
    where?: IpBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IpBlocks to fetch.
     */
    orderBy?: IpBlockOrderByWithRelationInput | IpBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IpBlocks.
     */
    cursor?: IpBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IpBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IpBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IpBlocks.
     */
    distinct?: IpBlockScalarFieldEnum | IpBlockScalarFieldEnum[]
  }

  /**
   * IpBlock findFirstOrThrow
   */
  export type IpBlockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * Filter, which IpBlock to fetch.
     */
    where?: IpBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IpBlocks to fetch.
     */
    orderBy?: IpBlockOrderByWithRelationInput | IpBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IpBlocks.
     */
    cursor?: IpBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IpBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IpBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IpBlocks.
     */
    distinct?: IpBlockScalarFieldEnum | IpBlockScalarFieldEnum[]
  }

  /**
   * IpBlock findMany
   */
  export type IpBlockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * Filter, which IpBlocks to fetch.
     */
    where?: IpBlockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IpBlocks to fetch.
     */
    orderBy?: IpBlockOrderByWithRelationInput | IpBlockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IpBlocks.
     */
    cursor?: IpBlockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IpBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IpBlocks.
     */
    skip?: number
    distinct?: IpBlockScalarFieldEnum | IpBlockScalarFieldEnum[]
  }

  /**
   * IpBlock create
   */
  export type IpBlockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * The data needed to create a IpBlock.
     */
    data: XOR<IpBlockCreateInput, IpBlockUncheckedCreateInput>
  }

  /**
   * IpBlock createMany
   */
  export type IpBlockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IpBlocks.
     */
    data: IpBlockCreateManyInput | IpBlockCreateManyInput[]
  }

  /**
   * IpBlock createManyAndReturn
   */
  export type IpBlockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * The data used to create many IpBlocks.
     */
    data: IpBlockCreateManyInput | IpBlockCreateManyInput[]
  }

  /**
   * IpBlock update
   */
  export type IpBlockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * The data needed to update a IpBlock.
     */
    data: XOR<IpBlockUpdateInput, IpBlockUncheckedUpdateInput>
    /**
     * Choose, which IpBlock to update.
     */
    where: IpBlockWhereUniqueInput
  }

  /**
   * IpBlock updateMany
   */
  export type IpBlockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IpBlocks.
     */
    data: XOR<IpBlockUpdateManyMutationInput, IpBlockUncheckedUpdateManyInput>
    /**
     * Filter which IpBlocks to update
     */
    where?: IpBlockWhereInput
    /**
     * Limit how many IpBlocks to update.
     */
    limit?: number
  }

  /**
   * IpBlock updateManyAndReturn
   */
  export type IpBlockUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * The data used to update IpBlocks.
     */
    data: XOR<IpBlockUpdateManyMutationInput, IpBlockUncheckedUpdateManyInput>
    /**
     * Filter which IpBlocks to update
     */
    where?: IpBlockWhereInput
    /**
     * Limit how many IpBlocks to update.
     */
    limit?: number
  }

  /**
   * IpBlock upsert
   */
  export type IpBlockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * The filter to search for the IpBlock to update in case it exists.
     */
    where: IpBlockWhereUniqueInput
    /**
     * In case the IpBlock found by the `where` argument doesn't exist, create a new IpBlock with this data.
     */
    create: XOR<IpBlockCreateInput, IpBlockUncheckedCreateInput>
    /**
     * In case the IpBlock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IpBlockUpdateInput, IpBlockUncheckedUpdateInput>
  }

  /**
   * IpBlock delete
   */
  export type IpBlockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
    /**
     * Filter which IpBlock to delete.
     */
    where: IpBlockWhereUniqueInput
  }

  /**
   * IpBlock deleteMany
   */
  export type IpBlockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IpBlocks to delete
     */
    where?: IpBlockWhereInput
    /**
     * Limit how many IpBlocks to delete.
     */
    limit?: number
  }

  /**
   * IpBlock without action
   */
  export type IpBlockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IpBlock
     */
    select?: IpBlockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IpBlock
     */
    omit?: IpBlockOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    nom: 'nom',
    prenom: 'prenom',
    role: 'role',
    createdAt: 'createdAt',
    failedLoginAttempts: 'failedLoginAttempts',
    lockedUntil: 'lockedUntil',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const LoginAttemptsScalarFieldEnum: {
    id: 'id',
    emailName: 'emailName',
    success: 'success',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
  };

  export type LoginAttemptsScalarFieldEnum = (typeof LoginAttemptsScalarFieldEnum)[keyof typeof LoginAttemptsScalarFieldEnum]


  export const IpBlockScalarFieldEnum: {
    id: 'id',
    ipAddress: 'ipAddress',
    failedAttempts: 'failedAttempts',
    blockedUntil: 'blockedUntil',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type IpBlockScalarFieldEnum = (typeof IpBlockScalarFieldEnum)[keyof typeof IpBlockScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    nom?: StringFilter<"User"> | string
    prenom?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    failedLoginAttempts?: IntFilter<"User"> | number
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    updatedAt?: DateTimeFilter<"User"> | Date | string
    LoginAttempts?: LoginAttemptsListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    LoginAttempts?: LoginAttemptsOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    nom?: StringFilter<"User"> | string
    prenom?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    failedLoginAttempts?: IntFilter<"User"> | number
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    updatedAt?: DateTimeFilter<"User"> | Date | string
    LoginAttempts?: LoginAttemptsListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    nom?: StringWithAggregatesFilter<"User"> | string
    prenom?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    failedLoginAttempts?: IntWithAggregatesFilter<"User"> | number
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type LoginAttemptsWhereInput = {
    AND?: LoginAttemptsWhereInput | LoginAttemptsWhereInput[]
    OR?: LoginAttemptsWhereInput[]
    NOT?: LoginAttemptsWhereInput | LoginAttemptsWhereInput[]
    id?: StringFilter<"LoginAttempts"> | string
    emailName?: StringFilter<"LoginAttempts"> | string
    success?: BoolFilter<"LoginAttempts"> | boolean
    ipAddress?: StringFilter<"LoginAttempts"> | string
    createdAt?: DateTimeFilter<"LoginAttempts"> | Date | string
    email?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type LoginAttemptsOrderByWithRelationInput = {
    id?: SortOrder
    emailName?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
    email?: UserOrderByWithRelationInput
  }

  export type LoginAttemptsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoginAttemptsWhereInput | LoginAttemptsWhereInput[]
    OR?: LoginAttemptsWhereInput[]
    NOT?: LoginAttemptsWhereInput | LoginAttemptsWhereInput[]
    emailName?: StringFilter<"LoginAttempts"> | string
    success?: BoolFilter<"LoginAttempts"> | boolean
    ipAddress?: StringFilter<"LoginAttempts"> | string
    createdAt?: DateTimeFilter<"LoginAttempts"> | Date | string
    email?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type LoginAttemptsOrderByWithAggregationInput = {
    id?: SortOrder
    emailName?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
    _count?: LoginAttemptsCountOrderByAggregateInput
    _max?: LoginAttemptsMaxOrderByAggregateInput
    _min?: LoginAttemptsMinOrderByAggregateInput
  }

  export type LoginAttemptsScalarWhereWithAggregatesInput = {
    AND?: LoginAttemptsScalarWhereWithAggregatesInput | LoginAttemptsScalarWhereWithAggregatesInput[]
    OR?: LoginAttemptsScalarWhereWithAggregatesInput[]
    NOT?: LoginAttemptsScalarWhereWithAggregatesInput | LoginAttemptsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LoginAttempts"> | string
    emailName?: StringWithAggregatesFilter<"LoginAttempts"> | string
    success?: BoolWithAggregatesFilter<"LoginAttempts"> | boolean
    ipAddress?: StringWithAggregatesFilter<"LoginAttempts"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LoginAttempts"> | Date | string
  }

  export type IpBlockWhereInput = {
    AND?: IpBlockWhereInput | IpBlockWhereInput[]
    OR?: IpBlockWhereInput[]
    NOT?: IpBlockWhereInput | IpBlockWhereInput[]
    id?: StringFilter<"IpBlock"> | string
    ipAddress?: StringFilter<"IpBlock"> | string
    failedAttempts?: IntFilter<"IpBlock"> | number
    blockedUntil?: DateTimeNullableFilter<"IpBlock"> | Date | string | null
    createdAt?: DateTimeFilter<"IpBlock"> | Date | string
    updatedAt?: DateTimeFilter<"IpBlock"> | Date | string
  }

  export type IpBlockOrderByWithRelationInput = {
    id?: SortOrder
    ipAddress?: SortOrder
    failedAttempts?: SortOrder
    blockedUntil?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IpBlockWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    ipAddress?: string
    AND?: IpBlockWhereInput | IpBlockWhereInput[]
    OR?: IpBlockWhereInput[]
    NOT?: IpBlockWhereInput | IpBlockWhereInput[]
    failedAttempts?: IntFilter<"IpBlock"> | number
    blockedUntil?: DateTimeNullableFilter<"IpBlock"> | Date | string | null
    createdAt?: DateTimeFilter<"IpBlock"> | Date | string
    updatedAt?: DateTimeFilter<"IpBlock"> | Date | string
  }, "id" | "ipAddress">

  export type IpBlockOrderByWithAggregationInput = {
    id?: SortOrder
    ipAddress?: SortOrder
    failedAttempts?: SortOrder
    blockedUntil?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: IpBlockCountOrderByAggregateInput
    _avg?: IpBlockAvgOrderByAggregateInput
    _max?: IpBlockMaxOrderByAggregateInput
    _min?: IpBlockMinOrderByAggregateInput
    _sum?: IpBlockSumOrderByAggregateInput
  }

  export type IpBlockScalarWhereWithAggregatesInput = {
    AND?: IpBlockScalarWhereWithAggregatesInput | IpBlockScalarWhereWithAggregatesInput[]
    OR?: IpBlockScalarWhereWithAggregatesInput[]
    NOT?: IpBlockScalarWhereWithAggregatesInput | IpBlockScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IpBlock"> | string
    ipAddress?: StringWithAggregatesFilter<"IpBlock"> | string
    failedAttempts?: IntWithAggregatesFilter<"IpBlock"> | number
    blockedUntil?: DateTimeNullableWithAggregatesFilter<"IpBlock"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"IpBlock"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"IpBlock"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    nom: string
    prenom: string
    role?: $Enums.Role
    createdAt?: Date | string
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    updatedAt?: Date | string
    LoginAttempts?: LoginAttemptsCreateNestedManyWithoutEmailInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    nom: string
    prenom: string
    role?: $Enums.Role
    createdAt?: Date | string
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    updatedAt?: Date | string
    LoginAttempts?: LoginAttemptsUncheckedCreateNestedManyWithoutEmailInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    LoginAttempts?: LoginAttemptsUpdateManyWithoutEmailNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    LoginAttempts?: LoginAttemptsUncheckedUpdateManyWithoutEmailNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    nom: string
    prenom: string
    role?: $Enums.Role
    createdAt?: Date | string
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptsCreateInput = {
    id?: string
    success: boolean
    ipAddress: string
    createdAt?: Date | string
    email: UserCreateNestedOneWithoutLoginAttemptsInput
  }

  export type LoginAttemptsUncheckedCreateInput = {
    id?: string
    emailName: string
    success: boolean
    ipAddress: string
    createdAt?: Date | string
  }

  export type LoginAttemptsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: UserUpdateOneRequiredWithoutLoginAttemptsNestedInput
  }

  export type LoginAttemptsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    emailName?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptsCreateManyInput = {
    id?: string
    emailName: string
    success: boolean
    ipAddress: string
    createdAt?: Date | string
  }

  export type LoginAttemptsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    emailName?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IpBlockCreateInput = {
    id?: string
    ipAddress: string
    failedAttempts?: number
    blockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IpBlockUncheckedCreateInput = {
    id?: string
    ipAddress: string
    failedAttempts?: number
    blockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IpBlockUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ipAddress?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    blockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IpBlockUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ipAddress?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    blockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IpBlockCreateManyInput = {
    id?: string
    ipAddress: string
    failedAttempts?: number
    blockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IpBlockUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ipAddress?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    blockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IpBlockUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ipAddress?: StringFieldUpdateOperationsInput | string
    failedAttempts?: IntFieldUpdateOperationsInput | number
    blockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type LoginAttemptsListRelationFilter = {
    every?: LoginAttemptsWhereInput
    some?: LoginAttemptsWhereInput
    none?: LoginAttemptsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LoginAttemptsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    nom?: SortOrder
    prenom?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type LoginAttemptsCountOrderByAggregateInput = {
    id?: SortOrder
    emailName?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginAttemptsMaxOrderByAggregateInput = {
    id?: SortOrder
    emailName?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type LoginAttemptsMinOrderByAggregateInput = {
    id?: SortOrder
    emailName?: SortOrder
    success?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IpBlockCountOrderByAggregateInput = {
    id?: SortOrder
    ipAddress?: SortOrder
    failedAttempts?: SortOrder
    blockedUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IpBlockAvgOrderByAggregateInput = {
    failedAttempts?: SortOrder
  }

  export type IpBlockMaxOrderByAggregateInput = {
    id?: SortOrder
    ipAddress?: SortOrder
    failedAttempts?: SortOrder
    blockedUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IpBlockMinOrderByAggregateInput = {
    id?: SortOrder
    ipAddress?: SortOrder
    failedAttempts?: SortOrder
    blockedUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IpBlockSumOrderByAggregateInput = {
    failedAttempts?: SortOrder
  }

  export type LoginAttemptsCreateNestedManyWithoutEmailInput = {
    create?: XOR<LoginAttemptsCreateWithoutEmailInput, LoginAttemptsUncheckedCreateWithoutEmailInput> | LoginAttemptsCreateWithoutEmailInput[] | LoginAttemptsUncheckedCreateWithoutEmailInput[]
    connectOrCreate?: LoginAttemptsCreateOrConnectWithoutEmailInput | LoginAttemptsCreateOrConnectWithoutEmailInput[]
    createMany?: LoginAttemptsCreateManyEmailInputEnvelope
    connect?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
  }

  export type LoginAttemptsUncheckedCreateNestedManyWithoutEmailInput = {
    create?: XOR<LoginAttemptsCreateWithoutEmailInput, LoginAttemptsUncheckedCreateWithoutEmailInput> | LoginAttemptsCreateWithoutEmailInput[] | LoginAttemptsUncheckedCreateWithoutEmailInput[]
    connectOrCreate?: LoginAttemptsCreateOrConnectWithoutEmailInput | LoginAttemptsCreateOrConnectWithoutEmailInput[]
    createMany?: LoginAttemptsCreateManyEmailInputEnvelope
    connect?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type LoginAttemptsUpdateManyWithoutEmailNestedInput = {
    create?: XOR<LoginAttemptsCreateWithoutEmailInput, LoginAttemptsUncheckedCreateWithoutEmailInput> | LoginAttemptsCreateWithoutEmailInput[] | LoginAttemptsUncheckedCreateWithoutEmailInput[]
    connectOrCreate?: LoginAttemptsCreateOrConnectWithoutEmailInput | LoginAttemptsCreateOrConnectWithoutEmailInput[]
    upsert?: LoginAttemptsUpsertWithWhereUniqueWithoutEmailInput | LoginAttemptsUpsertWithWhereUniqueWithoutEmailInput[]
    createMany?: LoginAttemptsCreateManyEmailInputEnvelope
    set?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
    disconnect?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
    delete?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
    connect?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
    update?: LoginAttemptsUpdateWithWhereUniqueWithoutEmailInput | LoginAttemptsUpdateWithWhereUniqueWithoutEmailInput[]
    updateMany?: LoginAttemptsUpdateManyWithWhereWithoutEmailInput | LoginAttemptsUpdateManyWithWhereWithoutEmailInput[]
    deleteMany?: LoginAttemptsScalarWhereInput | LoginAttemptsScalarWhereInput[]
  }

  export type LoginAttemptsUncheckedUpdateManyWithoutEmailNestedInput = {
    create?: XOR<LoginAttemptsCreateWithoutEmailInput, LoginAttemptsUncheckedCreateWithoutEmailInput> | LoginAttemptsCreateWithoutEmailInput[] | LoginAttemptsUncheckedCreateWithoutEmailInput[]
    connectOrCreate?: LoginAttemptsCreateOrConnectWithoutEmailInput | LoginAttemptsCreateOrConnectWithoutEmailInput[]
    upsert?: LoginAttemptsUpsertWithWhereUniqueWithoutEmailInput | LoginAttemptsUpsertWithWhereUniqueWithoutEmailInput[]
    createMany?: LoginAttemptsCreateManyEmailInputEnvelope
    set?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
    disconnect?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
    delete?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
    connect?: LoginAttemptsWhereUniqueInput | LoginAttemptsWhereUniqueInput[]
    update?: LoginAttemptsUpdateWithWhereUniqueWithoutEmailInput | LoginAttemptsUpdateWithWhereUniqueWithoutEmailInput[]
    updateMany?: LoginAttemptsUpdateManyWithWhereWithoutEmailInput | LoginAttemptsUpdateManyWithWhereWithoutEmailInput[]
    deleteMany?: LoginAttemptsScalarWhereInput | LoginAttemptsScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLoginAttemptsInput = {
    create?: XOR<UserCreateWithoutLoginAttemptsInput, UserUncheckedCreateWithoutLoginAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoginAttemptsInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutLoginAttemptsNestedInput = {
    create?: XOR<UserCreateWithoutLoginAttemptsInput, UserUncheckedCreateWithoutLoginAttemptsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoginAttemptsInput
    upsert?: UserUpsertWithoutLoginAttemptsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLoginAttemptsInput, UserUpdateWithoutLoginAttemptsInput>, UserUncheckedUpdateWithoutLoginAttemptsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type LoginAttemptsCreateWithoutEmailInput = {
    id?: string
    success: boolean
    ipAddress: string
    createdAt?: Date | string
  }

  export type LoginAttemptsUncheckedCreateWithoutEmailInput = {
    id?: string
    success: boolean
    ipAddress: string
    createdAt?: Date | string
  }

  export type LoginAttemptsCreateOrConnectWithoutEmailInput = {
    where: LoginAttemptsWhereUniqueInput
    create: XOR<LoginAttemptsCreateWithoutEmailInput, LoginAttemptsUncheckedCreateWithoutEmailInput>
  }

  export type LoginAttemptsCreateManyEmailInputEnvelope = {
    data: LoginAttemptsCreateManyEmailInput | LoginAttemptsCreateManyEmailInput[]
  }

  export type LoginAttemptsUpsertWithWhereUniqueWithoutEmailInput = {
    where: LoginAttemptsWhereUniqueInput
    update: XOR<LoginAttemptsUpdateWithoutEmailInput, LoginAttemptsUncheckedUpdateWithoutEmailInput>
    create: XOR<LoginAttemptsCreateWithoutEmailInput, LoginAttemptsUncheckedCreateWithoutEmailInput>
  }

  export type LoginAttemptsUpdateWithWhereUniqueWithoutEmailInput = {
    where: LoginAttemptsWhereUniqueInput
    data: XOR<LoginAttemptsUpdateWithoutEmailInput, LoginAttemptsUncheckedUpdateWithoutEmailInput>
  }

  export type LoginAttemptsUpdateManyWithWhereWithoutEmailInput = {
    where: LoginAttemptsScalarWhereInput
    data: XOR<LoginAttemptsUpdateManyMutationInput, LoginAttemptsUncheckedUpdateManyWithoutEmailInput>
  }

  export type LoginAttemptsScalarWhereInput = {
    AND?: LoginAttemptsScalarWhereInput | LoginAttemptsScalarWhereInput[]
    OR?: LoginAttemptsScalarWhereInput[]
    NOT?: LoginAttemptsScalarWhereInput | LoginAttemptsScalarWhereInput[]
    id?: StringFilter<"LoginAttempts"> | string
    emailName?: StringFilter<"LoginAttempts"> | string
    success?: BoolFilter<"LoginAttempts"> | boolean
    ipAddress?: StringFilter<"LoginAttempts"> | string
    createdAt?: DateTimeFilter<"LoginAttempts"> | Date | string
  }

  export type UserCreateWithoutLoginAttemptsInput = {
    id?: string
    email: string
    password: string
    nom: string
    prenom: string
    role?: $Enums.Role
    createdAt?: Date | string
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutLoginAttemptsInput = {
    id?: string
    email: string
    password: string
    nom: string
    prenom: string
    role?: $Enums.Role
    createdAt?: Date | string
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutLoginAttemptsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLoginAttemptsInput, UserUncheckedCreateWithoutLoginAttemptsInput>
  }

  export type UserUpsertWithoutLoginAttemptsInput = {
    update: XOR<UserUpdateWithoutLoginAttemptsInput, UserUncheckedUpdateWithoutLoginAttemptsInput>
    create: XOR<UserCreateWithoutLoginAttemptsInput, UserUncheckedCreateWithoutLoginAttemptsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLoginAttemptsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLoginAttemptsInput, UserUncheckedUpdateWithoutLoginAttemptsInput>
  }

  export type UserUpdateWithoutLoginAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutLoginAttemptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    prenom?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptsCreateManyEmailInput = {
    id?: string
    success: boolean
    ipAddress: string
    createdAt?: Date | string
  }

  export type LoginAttemptsUpdateWithoutEmailInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptsUncheckedUpdateWithoutEmailInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginAttemptsUncheckedUpdateManyWithoutEmailInput = {
    id?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    ipAddress?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}