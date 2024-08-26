import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { hashSync } from 'bcrypt';
@Entity({name: "usuario"})
@Unique(['email'])
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

    @BeforeInsert() // Antes do typeorm inserir um novo usuário no bd, vai executar essa função
    hashPassword() {
        this.senha = hashSync(this.senha, 10);
    }
}
