import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'contatos' })
export class Contatos {

    @PrimaryGeneratedColumn({ name: "CON_Id" })
    id: number;

    @Column({ name: "CON_Nome" })
    nome: string;

    @Column({ name: "CON_Telefone" })
    numero: string;

    @Column({ name: "CON_Status", default: true })
    status: boolean;

    @Column({ name: "CON_GrupoId" })
    grupoId: number; 

    @Column({ name: "CON_ChatId", nullable: true })
    chatId?: string; 
}
