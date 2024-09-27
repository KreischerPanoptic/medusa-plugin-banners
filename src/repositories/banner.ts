import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { Banner } from "../models/banner";

export const BannerRepository = dataSource
    .getRepository(Banner);

export default BannerRepository;
