import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  sex!: string;

  @Column({ nullable: true })
  age!: number;

  @Column({ nullable: true })
  address!: number;

  @Column({ nullable: true })
  mapPoint!: number;

  @Column({ nullable: true })
  phone!: number;

  @Column()
  parentID: number;
}
