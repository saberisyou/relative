import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, comment: '姓名' })
  name!: string;

  @Column({ nullable: true, length: 50, comment: '头像' })
  avatar!: string;

  @Column({ nullable: true, length: 50, comment: '性别' })
  sex!: string;

  @Column({ nullable: true })
  age!: number;

  @Column({ nullable: true, length: 50, comment: '联系地址' })
  address!: string;

  @Column({ nullable: true })
  mapPoint!: string;

  @Column({ nullable: true, length: 50, comment: '联系电话' })
  phone!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column()
  parentID: number;
}
