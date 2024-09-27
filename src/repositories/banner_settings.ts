import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { BannerSettings } from "../models/banner_settings";

export const BannerSettingsRepository = dataSource
    .getRepository(BannerSettings);

export default BannerSettingsRepository;
