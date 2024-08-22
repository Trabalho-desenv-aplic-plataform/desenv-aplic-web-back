import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Grupos1724366797890 implements MigrationInterface {
    private tableName = "grupos";

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name: this.tableName,
            columns: [
                {
                    name: "GRU_Id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                    isNullable: false
                },
                {
                    name: "GRU_Nome",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "GRU_DataCriacao",
                    type: "timestamp",
                    default: "now()",
                    isNullable: false
                },
                {
                    name: "GRU_Cor",
                    type: "varchar",
                    length:"7",
                    isNullable: false,
                },

            ]        
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("DROP TABLE " + this.tableName)
    }

}
