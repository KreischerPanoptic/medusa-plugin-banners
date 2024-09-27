/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable require-jsdoc */
import { Lifetime } from "awilix";
import { Logger } from "@medusajs/types";
//import { UpdateProductCategoryInput as MedusaUpdateProductCategoryInput } from "@medusajs/medusa/dist/types/product-category";
import ImageRepository from "@medusajs/medusa/dist/repositories/image";
import ProductCategoryRepository from "@medusajs/medusa/dist/repositories/product-category";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";
import { Banner, BannerType } from "../models/banner";
import {BannerRepository} from '../repositories/banner'
import { 
    Selector,
    FindConfig, 
    TransactionBaseService, 
    buildQuery,
    ProductCategory,
    Image,
    Product,
  } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import BannerSettingsRepository from "../repositories/banner_settings";
// type UpdateProductCategoryInput = {
//     images: string[];
// } & MedusaUpdateProductCategoryInput;

export class ExtendedBanner extends Banner {
    imageUrl?: string | undefined;
    image: Image | {}
    product: Product | {}
    category: ProductCategory | {}
}

class BannerService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly imageRepository_: typeof ImageRepository;
    protected readonly categoryRepository_: typeof ProductCategoryRepository;
    protected readonly productRepository_: typeof ProductRepository;
    protected readonly bannerRepository_: typeof BannerRepository;
    protected readonly bannerSettingsRepository_: typeof BannerSettingsRepository;
    protected readonly logger_: Logger;

    constructor(container) {
        super(container);

        this.imageRepository_ = container.imageRepository;
        this.productRepository_ = container.productRepository;
        this.categoryRepository_ = container.productCategoryRepository;
        this.bannerRepository_ = container.bannerRepository;
        this.bannerSettingsRepository_ = container.bannerSettingsRepository;
        this.logger_ = container.logger;
    }

    async list(): Promise<ExtendedBanner[]> {
        const bannerRepo = this.activeManager_.withRepository(
          this.bannerRepository_
        )
        const categoryRepo = this.activeManager_.withRepository(
            this.categoryRepository_
          )
          const productRepo = this.activeManager_.withRepository(
            this.productRepository_
          )
          const imageRepo = this.activeManager_.withRepository(
            this.imageRepository_
          )

        let banners = await bannerRepo.find();

        let bannersResult: ExtendedBanner[] = [];
        if(banners && banners.length > 0) {
          for(let banner of banners) {
              let tmpBanner: ExtendedBanner = new ExtendedBanner();
              tmpBanner.categoryId = banner.categoryId;
              tmpBanner.created_at = banner.created_at;
              tmpBanner.deleted_at = banner.deleted_at;
              tmpBanner.id = banner.id;
              tmpBanner.thumbnail = banner.thumbnail;
              tmpBanner.link = banner.link;
              tmpBanner.productId = banner.productId;
              tmpBanner.rank = banner.rank;
              tmpBanner.type = banner.type;
              tmpBanner.updated_at = banner.updated_at;
              if(banner.type === BannerType.CATEGORY) {
                  const query = buildQuery({
                      id: banner.categoryId,
                    })
                    let category = await categoryRepo.findOne(query);
                  tmpBanner.category = category ? category : {}
              }
              else if(banner.type == BannerType.PRODUCT) {
                  const query = buildQuery({
                      id: banner.productId,
                    })
                    let product = await productRepo.findOne(query);
                  tmpBanner.product = product ? product : {}
              }
              tmpBanner.thumbnail = banner.thumbnail
              bannersResult.push(tmpBanner)
          }
        }
        return bannersResult
    }

    async count(): Promise<number> {
        const bannerRepo = this.activeManager_.withRepository(
            this.bannerRepository_
          )
          return await bannerRepo.count()
    }

    async listAndCount(
        selector?: Selector<Banner>,
        config: FindConfig<Banner> = {
          skip: 0,
          take: 20,
          relations: [],
      }): Promise<[ExtendedBanner[], number]> {
        const bannerRepo = this.activeManager_.withRepository(
          this.bannerRepository_
        )
    
        const query = buildQuery(selector, config)
    
        let results = bannerRepo.findAndCount(query)

        const categoryRepo = this.activeManager_.withRepository(
            this.categoryRepository_
          )
          const productRepo = this.activeManager_.withRepository(
            this.productRepository_
          )
          const imageRepo = this.activeManager_.withRepository(
            this.imageRepository_
          )

        let bannersResult: ExtendedBanner[] = [];
        if(results[1] > 0) {
          for(let banner of results[0]) {
              let tmpBanner: ExtendedBanner = new ExtendedBanner();
              tmpBanner.categoryId = banner.categoryId;
              tmpBanner.created_at = banner.created_at;
              tmpBanner.deleted_at = banner.deleted_at;
              tmpBanner.id = banner.id;
              tmpBanner.thumbnail = banner.thumbnail;
              tmpBanner.link = banner.link;
              tmpBanner.productId = banner.productId;
              tmpBanner.rank = banner.rank;
              tmpBanner.type = banner.type;
              tmpBanner.updated_at = banner.updated_at;
              if(banner.type === BannerType.CATEGORY) {
                  const query = buildQuery({
                      id: banner.categoryId,
                    })
                    let category = await categoryRepo.findOne(query);
                  tmpBanner.category = category ? category : {}
              }
              else if(banner.type == BannerType.PRODUCT) {
                  const query = buildQuery({
                      id: banner.productId,
                    })
                    let product = await productRepo.findOne(query);
                  tmpBanner.product = product ? product : {}
              }
              tmpBanner.thumbnail = banner.thumbnail;
              bannersResult.push(tmpBanner)
          }
        }
        return [bannersResult,results[1]]
      }

      async retrieve(
        id: string,
        config?: FindConfig<Banner>
      ): Promise<ExtendedBanner> {
        const bannerRepo = this.activeManager_.withRepository(
            this.bannerRepository_
          )
    
        const query = buildQuery({
          id,
        }, config)
    
        const banner = await bannerRepo.findOne(query)
    
        if (!banner) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            "Banner was not found"
          )
        }

        const categoryRepo = this.activeManager_.withRepository(
            this.categoryRepository_
          )
          const productRepo = this.activeManager_.withRepository(
            this.productRepository_
          )
          const imageRepo = this.activeManager_.withRepository(
            this.imageRepository_
          )

          let tmpBanner: ExtendedBanner = new ExtendedBanner();
          tmpBanner.categoryId = banner.categoryId;
          tmpBanner.created_at = banner.created_at;
          tmpBanner.deleted_at = banner.deleted_at;
          tmpBanner.id = banner.id;
          tmpBanner.thumbnail = banner.thumbnail;
          tmpBanner.link = banner.link;
          tmpBanner.productId = banner.productId;
          tmpBanner.rank = banner.rank;
          tmpBanner.type = banner.type;
          tmpBanner.updated_at = banner.updated_at;
          if(banner.type === BannerType.CATEGORY) {
              const query = buildQuery({
                  id: banner.categoryId,
                })
                let category = await categoryRepo.findOne(query);
              tmpBanner.category = category ? category : {}
          }
          else if(banner.type == BannerType.PRODUCT) {
              const query = buildQuery({
                  id: banner.productId,
                })
                let product = await productRepo.findOne(query);
              tmpBanner.product = product ? product : {}
          }
          tmpBanner.thumbnail = banner.thumbnail
    
        return tmpBanner
      }

      async create(
        data: Pick<Banner, "type" | "rank" | 'categoryId' | 'thumbnail' | 'link' | 'productId'>
      ): Promise<ExtendedBanner> {
        return this.atomicPhase_(async (manager) => {
            const bannerRepo = this.activeManager_.withRepository(
                this.bannerRepository_
              )
              const bannerSettingsRepo = this.activeManager_.withRepository(
                this.bannerSettingsRepository_
              )
              const settingsResult = await bannerSettingsRepo.find()
              const bannerSettings = settingsResult[0]
    
        if (!bannerSettings) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            "Banner settings was not found"
          )
        }

              /////////////////

          const bannersCount = await this.count()
          if(bannerSettings.max >= bannersCount) {
            throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Max banners count - reached! Creation of new banners - prohibited."
              )
          }

          const banner = bannerRepo.create()
          banner.type = data.type;
          banner.rank = data.rank;
          banner.link = data.link;

          const categoryRepo = this.activeManager_.withRepository(
            this.categoryRepository_
          )
          const productRepo = this.activeManager_.withRepository(
            this.productRepository_
          )
          const imageRepo = this.activeManager_.withRepository(
            this.imageRepository_
          )
/////////////////////
          if(data.categoryId) {
            const categoryCheckQuery = buildQuery({
                id: data.categoryId,
            })
            let checkCategory = await categoryRepo.findOne(categoryCheckQuery);

            if (!checkCategory) {
                throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Category with ID - ${data.categoryId} was not found`
                )
            }
            else {
                banner.categoryId = checkCategory.id;
            }
          }

          if(data.productId) {
            const productCheckQuery = buildQuery({
                id: data.productId,
            })
            let checkProduct = await productRepo.findOne(productCheckQuery);

            if (!checkProduct) {
                throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Product with ID - ${data.productId} was not found`
                )
            }
            else {
                banner.productId = checkProduct.id;
            }
          }
          
/////////////////////
          const result = await bannerRepo.save(banner)

          let tmpBanner: ExtendedBanner = new ExtendedBanner();
          tmpBanner.categoryId = result.categoryId;
          tmpBanner.created_at = result.created_at;
          tmpBanner.deleted_at = result.deleted_at;
          tmpBanner.id = result.id;
          tmpBanner.thumbnail = result.thumbnail;
          tmpBanner.link = result.link;
          tmpBanner.productId = result.productId;
          tmpBanner.rank = result.rank;
          tmpBanner.type = result.type;
          tmpBanner.updated_at = result.updated_at;
          if(result.type === BannerType.CATEGORY) {
              const query = buildQuery({
                  id: result.categoryId,
                })
                let category = await categoryRepo.findOne(query);
              tmpBanner.category = category ? category : {}
          }
          else if(result.type == BannerType.PRODUCT) {
              const query = buildQuery({
                  id: result.productId,
                })
                let product = await productRepo.findOne(query);
              tmpBanner.product = product ? product : {}
          }
          tmpBanner.thumbnail = banner.thumbnail
            return tmpBanner
        })
      }
    
      async update(
        id: string,
        data: Omit<Partial<Banner>, "id">
      ): Promise<ExtendedBanner> {
        return await this.atomicPhase_(async (manager) => {
            const bannerRepo = this.activeManager_.withRepository(
                this.bannerRepository_
              )
          const banner = await this.retrieve(id)

          const categoryRepo = this.activeManager_.withRepository(
            this.categoryRepository_
          )
          const productRepo = this.activeManager_.withRepository(
            this.productRepository_
          )
          const imageRepo = this.activeManager_.withRepository(
            this.imageRepository_
          )
/////////////////////
          if(data.categoryId) {
            const categoryCheckQuery = buildQuery({
                id: data.categoryId,
            })
            let checkCategory = await categoryRepo.findOne(categoryCheckQuery);

            if (!checkCategory) {
                throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Category with ID - ${data.categoryId} was not found`
                )
            }
          }

          if(data.productId) {
            const productCheckQuery = buildQuery({
                id: data.productId,
            })
            let checkProduct = await productRepo.findOne(productCheckQuery);

            if (!checkProduct) {
                throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Product with ID - ${data.productId} was not found`
                )
            }
          }
          
/////////////////////

          Object.assign(banner, data)
    
          const result = await bannerRepo.save(banner)
          let tmpBanner: ExtendedBanner = new ExtendedBanner();
          tmpBanner.categoryId = result.categoryId;
          tmpBanner.created_at = result.created_at;
          tmpBanner.deleted_at = result.deleted_at;
          tmpBanner.id = result.id;
          tmpBanner.thumbnail = result.thumbnail;
          tmpBanner.link = result.link;
          tmpBanner.productId = result.productId;
          tmpBanner.rank = result.rank;
          tmpBanner.type = result.type;
          tmpBanner.updated_at = result.updated_at;
          if(result.type === BannerType.CATEGORY) {
              const query = buildQuery({
                  id: result.categoryId,
                })
                let category = await categoryRepo.findOne(query);
              tmpBanner.category = category ? category : {}
          }
          else if(result.type == BannerType.PRODUCT) {
              const query = buildQuery({
                  id: result.productId,
                })
                let product = await productRepo.findOne(query);
              tmpBanner.product = product ? product : {}
          }
          tmpBanner.thumbnail = banner.thumbnail
    
            return tmpBanner
        })
      }
    
      async delete(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const bannerRepo = this.activeManager_.withRepository(
                this.bannerRepository_
              )
          const banner = await this.retrieve(id)
          
          await bannerRepo.remove([banner])
        })
      }
}

export default BannerService;
