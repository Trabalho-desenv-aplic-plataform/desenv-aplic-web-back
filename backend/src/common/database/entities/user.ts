import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "usuario"})
export class User {

    @PrimaryGeneratedColumn({name: "USR_Id"})
    id: number;

    @Column({name: "USR_Nome"})
    nome: string;

    @Column({name: "USR_Email", unique:true})
    email: string;

    @Column({name: "USR_Senha"})
    senha: string;

    @Column({name: "USR_TipoUsuario"})
    tipo: string;

    // Nova coluna para o token de recuperação de senha
    @Column({ type: 'varchar', nullable: true })
    USR_resetToken: string | null;

    // Nova coluna para a data de expiração do token
    @Column({ type: 'timestamp', nullable: true })
    USR_resetTokenExpires: Date | null;
}
