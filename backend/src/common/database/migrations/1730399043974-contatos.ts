import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class Contatos1724973619552 implements MigrationInterface {

    private tableName = "contatos";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: this.tableName,
            columns: [
                {
                    name: "CON_Id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                    isNullable: false
                },
                {
                    name: "CON_Nome",
                    type: "varchar",
                    length: "100",
                    isNullable: false
                },
                {
                    name: "CON_Telefone",
                    type: "varchar",
                    length: "16",
                    isNullable: false
                },
                {
                    name: "CON_Status",
                    type: "boolean",
                    default: true
                },
                {
                    name: "CON_GrupoId",
                    type: "int"
                },
                {
                    name: "CON_ChatId",
                    type: "varchar",
                    length: "50",
                    isNullable: true
                }
            ],
            foreignKeys: [
                {
                    columnNames: ["CON_GrupoId"],
                    referencedTableName: "grupos",
                    referencedColumnNames: ["GRU_Id"],
                    onDelete: "CASCADE"
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE " + this.tableName);
    }
}
