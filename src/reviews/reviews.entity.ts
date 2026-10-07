import { Product } from "src/products/products.entity";
import { User } from "src/users/user.entity";
import { CURRENT_TIMESTAMP } from "src/utils/constant";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({name: 'reviews'})
export class Review{

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'int'})
  rating!: number;

  @Column()
  comment!: string;

  @CreateDateColumn({type:'timestamp', default: () => CURRENT_TIMESTAMP})
  createdAt!: Date;
  
  @UpdateDateColumn({type: 'timestamp', default: () =>  CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP})
  updatedAt!: Date;

  @ManyToOne(() => Product, (product) => product.reviews,{onDelete: 'CASCADE'})
  product!: Product

  @ManyToOne(() => User, (user) => user.reviews, {eager: true, onDelete: 'CASCADE'})
  user!: User
}