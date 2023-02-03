import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column("int", { array: true })
  idUsers: number[];

  @Column({nullable:true})
  email: string;

  @Column({nullable:true})
  emailsen: string;

  @Column({nullable:true})
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
