import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity({name: "grupos"})
export class Grupos{

    @PrimaryGeneratedColumn({name: "GRU_Id"})
    id: number;

    @Column({name: "GRU_Nome"})
    nome: string;

    @Column({name: "GRU_DataCriacao", type:"timestamp"})
    dataCriacao: Date;
    
    @Column({name: "GRU_Cor"})
    cor: string;

}