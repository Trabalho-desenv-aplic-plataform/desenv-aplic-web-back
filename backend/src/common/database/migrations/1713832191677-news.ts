import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class News1713832191677 implements MigrationInterface {

    private tableName = "news";

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name: this.tableName,
            columns: [
                {
                    name: "NWS_Id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                    isNullable: false
                },
                {
                    name: "NWS_Titulo",
                    type: "varchar",
                    length: "110",
                },
                {
                    name: "NWS_DataCriado",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "NWS_DataAtualizado",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("DROP TABLE " + this.tableName)
    }

}
