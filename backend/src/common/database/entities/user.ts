import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "usuario"})
export class User {

    @PrimaryGeneratedColumn({name: "USR_Id"})
    id: number;

    @Column({name: "USR_Nome"})
    nome: string;

    @Column({name: "USR_Email"})
    email: string;

    @Column({name: "USR_Senha"})
    senha: string;

    @Column({name: "USR_TipoUsuario"})
    tipo: string;
}
