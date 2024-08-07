import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class User1711986669201 implements MigrationInterface {
    private tableName = "usuario";

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name: this.tableName,
            columns: [
                {
                    name: "USR_Id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                    isNullable: false
                },
                {
                    name: "USR_Nome",
                    type: "varchar",
                    length: "100",
                    isNullable: false
                },
                {
                    name: "USR_Email",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: "USR_Senha",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "USR_TipoUsuario",
                    type: "varchar",
                    length: "50",
                    isNullable: false
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("DROP TABLE " + this.tableName)
    }

}
