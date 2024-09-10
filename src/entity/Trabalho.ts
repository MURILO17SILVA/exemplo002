/* eslint-disable import/prefer-default-export */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Autor } from "./Autor";

@Entity()
export class Trabalho {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  codigo: string;

  @Column()
  area: string;

  @ManyToMany(() => Autor)
  @JoinTable()
  autores: Autor[];
}
