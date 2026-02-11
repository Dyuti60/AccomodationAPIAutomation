declare namespace NodeJS {
  interface ProcessEnv {
    BASE_API_URL: string;
    BASE_URL: string;
    LOGIN_CONTACT_NUMBER:string;
    SYS_ENV:string,
    PG_HOST:string;
    PG_PORT:number;
    PG_DATABASE:string;
    PG_USER:string;
    PG_PASSWORD:string;
    PG_SSL:string;
    PG_HOST_DATA:string;
    PG_PORT_DATA:number;
    PG_DATABASE_DATA:string;
    PG_USER_DATA:string;
    PG_PASSWORD_DATA:string;
    PG_SSL_DATA:string;
  }
}
