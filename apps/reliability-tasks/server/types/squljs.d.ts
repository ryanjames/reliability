declare module 'sql.js' {
  export interface SqlJsStatic {
    Database: new (data?: Uint8Array) => SqlJsDatabase;
  }

  export interface SqlJsStatement {
    step(): boolean;
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
    run(...params: unknown[]): void;
    free(): void;
  }

  export interface SqlJsDatabase {
    run(sql: string): void;
    exec(sql: string): { columns: string[]; values: unknown[][] }[];
    export(): Uint8Array;
    close(): void;

    prepare(sql: string): SqlJsStatement;
  }

  const initSqlJs: () => Promise<SqlJsStatic>;
  export default initSqlJs;
}
