import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AdicionarResetTokenUsuario1743437801541 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("usuario", [
            new TableColumn({
              name: "USR_resetToken",
              type: "varchar",
              isNullable: true,
            }),
            new TableColumn({
              name: "USR_resetTokenExpires",
              type: "timestamp",
              isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("usuario", "USR_resetToken");
        await queryRunner.dropColumn("usuario", "USR_resetTokenExpires");    
    }

}
