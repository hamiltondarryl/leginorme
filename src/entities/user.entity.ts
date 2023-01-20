import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique : true })
  readonly username : string;

  @Column({ unique : true })
  readonly email : string;

  @Column()
  readonly password : string;
}