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

    @Column({ nullable: true })
    resetToken?: string;

    // Novo campo: Expiração do token
    @Column({ type: "timestamp", nullable: true })
    resetTokenExpires?: Date;
}
