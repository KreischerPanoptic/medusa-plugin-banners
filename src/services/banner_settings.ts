/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable require-jsdoc */
import { Lifetime } from "awilix";
import { 
    Selector,
    FindConfig, 
    TransactionBaseService, 
    buildQuery,
  } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import { Logger } from "@medusajs/types";
//import { UpdateProductCategoryInput as MedusaUpdateProductCategoryInput } from "@medusajs/medusa/dist/types/product-category";
import { BannerSettings } from "../models/banner_settings";
import { BannerSettingsRepository } from '../repositories/banner_settings';

// type UpdateProductCategoryInput = {
//     images: string[];
// } & MedusaUpdateProductCategoryInput;

class BannerSettingsService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger_: Logger;
    protected readonly bannerSettingsRepository_: typeof BannerSettingsRepository;

    constructor(container) {
        super(container);

        this.logger_ = container.logger;
        this.bannerSettingsRepository_ = container.bannerSettingsRepository;
    }

    async retrieve(
      ): Promise<BannerSettings> {
        const bannerRepo = this.activeManager_.withRepository(
            this.bannerSettingsRepository_
          )
        const result = await bannerRepo.find()
        const banner = result[0]
    
        if (!banner) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            "Banner settings was not found"
          )
        }
    
        return banner
      }

      async update(
        data: Omit<Partial<BannerSettings>, "id">
      ): Promise<BannerSettings> {
        return await this.atomicPhase_(async (manager) => {
            const bannerRepo = this.activeManager_.withRepository(
                this.bannerSettingsRepository_
              )
          const banner = await this.retrieve()
          if (!banner) {
            throw new MedusaError(
              MedusaError.Types.NOT_FOUND,
              "Banner settings was not found"
            )
          }
          if(data.max < 1) {
            throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Max banners must be greater than 0"
              )
          }
          if(data.max > 99) {
            throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Max banners must be smaller than 100"
              )
          }
          Object.assign(banner, data)
    
          return await bannerRepo.save(banner)
        })
      }
}

export default BannerSettingsService;
