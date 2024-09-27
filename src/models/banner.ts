import {
    Column,
    Entity,
    BeforeInsert,
} from "typeorm";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils"

export enum BannerType {
    PRODUCT = "product",
    CATEGORY = "category",
    PAGE = "page",
    LINK = "link",
    NONE = "none"
}

@Entity()
export class Banner extends SoftDeletableEntity {
    @Column({type: 'int', nullable: false, default: 0})
    rank: number;

    @Column({
        type: "enum",
        enum: BannerType,
        default: BannerType.NONE,
    })
    type: BannerType;

    @Column({type: 'text', nullable: true})
    productId?: string | null;

    @Column({type: 'text', nullable: true})
    categoryId?: string | null;

    @Column({type: 'text', nullable: true})
    link: string | null;

    @Column({type: 'text', nullable: true})
    imageId?: string | null;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "banner")
    }
}