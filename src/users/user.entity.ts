import { Exclude } from "class-transformer";
import { Product } from "src/products/products.entity";
import { Review } from "src/reviews/reviews.entity";
import { CURRENT_TIMESTAMP } from "src/utils/constant";
import { UserType } from "src/utils/enums";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({name: 'users'})
export class User{

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'varchar', length: 150, nullable: true})
  username!: string;

  @Column({type: 'varchar', length: 250, unique: true})
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({type: 'enum', enum: UserType, default: UserType.NORMAL_USER})
  userType!: UserType;

  @Column({default: false})
  isAcountVarified!: boolean;

  @Column({type: 'varchar', nullable: true, default: null, length: 64})
  verificationToken!: string | null;

  @Column({type: 'varchar', nullable: true, default: null, length: 64})
  resetPasswordToken!: string | null;


  @Column({type: 'varchar',nullable: true, default: null})
  profileImage!: string | null;

  @CreateDateColumn({type:'timestamp', default: () => CURRENT_TIMESTAMP})
  createdAt!: Date;
  
  @UpdateDateColumn({type: 'timestamp', default: () =>  CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP})
  updatedAt!: Date;

  @OneToMany(() => Product, (product) => product.user)
  product!: Product[]

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[]
}