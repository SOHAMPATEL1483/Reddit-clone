import { DB } from "@/db/types";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from 'pg';


const dialect = new PostgresDialect({
    pool: new Pool({
        database: 'reddit-clone',
        host: 'localhost',
        user: 'postgres',
        password: '1234',
        port: 5432,
        max: 10,
    })
})

export const kysely_db = new Kysely<DB>({
    dialect: dialect,
});