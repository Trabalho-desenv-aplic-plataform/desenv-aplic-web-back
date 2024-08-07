import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: "aws-0-sa-east-1.pooler.supabase.com",
  port: 6543,
  username: "postgres.fzgxtzzvyrchuvuqjbzx",
  password: "Ds@048406#23",
  database: "postgres",
  entities: [`${__dirname}/entities/{.ts,*.js}`],
  migrations: [`${__dirname}/migrations/{.ts,*.js}`],

  // quem mudar pra true e subir VAI MORRER. Ass: Lucas Moreira Nunes.
  synchronize: false,
  migrationsRun: false
  // quem mudar pra true e subir VAI MORRER. Ass: Lucas Moreira Nunes.
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
