import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT as any,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [`${__dirname}/entities/{.ts,*.js}`],
    migrations: [`${__dirname}/migrations/{.ts,*.js}`],

    // NÃO ALTERAR PARA TRUE OS VALORES ENTRE ESSES COMENTÁRIOS
    synchronize: false,
    migrationsRun: false
} 

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;