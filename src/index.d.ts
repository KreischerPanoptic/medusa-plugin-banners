import { Banner, BannerType } from "./models/banner";

export declare module '@medusajs/medusa/dist/models/banner' {
    declare interface Banner {
      rank: number;
      type: string;
      productId?: string;
      link?: string;
      imageId?: string;
      categoryId?: string;
    }
}