/* eslint-disable import/prefer-default-export */
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Autor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  genero: string;

  @Column({ length: 11 })
  cpf: string;
}
