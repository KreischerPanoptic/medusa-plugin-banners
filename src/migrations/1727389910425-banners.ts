import { MigrationInterface, QueryRunner } from "typeorm";

export class Banners1727389910425 implements MigrationInterface {
    name = 'Banners1727389910425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."banner_type_enum" AS ENUM('product', 'category', 'page', 'link', 'none')`);
        await queryRunner.query(`CREATE TABLE "banner" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "rank" integer NOT NULL DEFAULT '0', "type" "public"."banner_type_enum" NOT NULL DEFAULT 'none', "productId" text, "categoryId" text, "link" text, "imageId" text, CONSTRAINT "PK_6d9e2570b3d85ba37b681cd4256" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "banner"`);
        await queryRunner.query(`DROP TYPE "public"."banner_type_enum"`);
    }

}
