import {
    Column,
    Entity,
    BeforeInsert
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils"
// import { Product } from "./product";
// import { Category } from "./category";
// import { Image } from "./image";

@Entity()
export class BannerSettings extends BaseEntity {
    @Column({type: 'int', nullable: false, default: 5})
    max: number;
    
    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "banner")
    }
}