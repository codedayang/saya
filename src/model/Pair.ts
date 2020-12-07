import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Pair {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @Column("longtext")
    value: string = "";

    // 为空则不执行
    @Column({default: ""})
    redirectTo: string;

    /*
        webhook链接列表，使用***分隔
     */
    @Column({default: ""})
    webhookList: string;

}