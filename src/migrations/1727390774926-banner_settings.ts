import { MigrationInterface, QueryRunner } from "typeorm";

export class BannerSettings1727390774926 implements MigrationInterface {
    name = 'BannerSettings1727390774926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banner_settings" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "max" integer NOT NULL DEFAULT '5', CONSTRAINT "PK_4a5c6ce60787d02881b3bcdc155" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO banner_settings (max) VALUES (5);`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "banner_settings"`);
    }

}
