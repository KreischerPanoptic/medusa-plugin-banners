import { 
    MedusaRequest, 
    MedusaResponse,
    FindPaginationParams,
    ProductCategoryService,
    ProductService,
} from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import BannerService, { ExtendedBanner } from "../../../services/banner";
import CreateUpdateBannerRequest from "../../../requests/create-update-banner-request";
import { Banner, BannerType } from "../../../models/banner";
import BannerSettingsService from "../../../services/banner_settings";

export class ExtendedBannersResponse extends FindPaginationParams {
    count: number;
    banners: ExtendedBanner[]
}

export class CreateBannersResponse {
    banner: Banner
}

export const GET = async (
    req: MedusaRequest<FindPaginationParams>,
    res: MedusaResponse<ExtendedBannersResponse>
) => {
    const {limit,offset} = req.query;
    const bannersService: BannerService = req.scope.resolve(
       "bannerService"
    )

    let results = await bannersService.listAndCount({}, {take: parseInt(`${limit || '10'}`), skip: parseInt(`${offset || '0'}`)});
      res.json({
        count: results[1],
        limit: parseInt(`${limit || '10'}`),
        offset: parseInt(`${offset || '0'}`),
        banners: results[0]
    })
}

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
  }

export const POST = async (
    req: MedusaRequest<CreateUpdateBannerRequest>,
    res: MedusaResponse<CreateBannersResponse>
  ) => {
    const bannersService: BannerService = req.scope.resolve(
        "bannerService"
     )
     const bannersSettingsService: BannerSettingsService = req.scope.resolve(
        "bannerSettingsService"
     );
     const categoryService: ProductCategoryService = req.scope.resolve(
      "productCategoryService"
      )
      const productService: ProductService = req.scope.resolve(
        "productService"
        )
    const settingsResult = await bannersSettingsService.retrieve()

    if (!settingsResult) {
        throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Banner settings was not found"
        )
    }

    const bannersCount = await bannersService.count()
    if(settingsResult.max <= bannersCount) {
      throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Max banners count - reached! Creation of new banners - prohibited."
        )
    }
    let bannerObj: Banner = new Banner();
    switch (req.body.type) {
      case 'category':
        if(!req.body.categoryId) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `When type 'category' selected - must provide categoryId`
          )
        }
        else {
          const category = await categoryService.retrieve(req.body.categoryId)
          if(!category) {
            throw new MedusaError(
              MedusaError.Types.NOT_FOUND,
              `Category with ID - ${req.body.categoryId} was not found`
              )
          }
          else {
            bannerObj.type = BannerType.CATEGORY;
            bannerObj.categoryId = category.id;
          }
        }
        break;
      case 'product':
        if(!req.body.productId) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `When type 'product' selected - must provide productId`
          )
        }
        else {
          const product = await productService.retrieve(req.body.productId)
          if(!product) {
            throw new MedusaError(
              MedusaError.Types.NOT_FOUND,
              `Product with ID - ${req.body.productId} was not found`
              )
          }
          else {
            bannerObj.type = BannerType.PRODUCT;
            bannerObj.productId = product.id;
          }
        }
        break;
      case 'link':
        if(!req.body.link) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `When type 'link' selected - must provide valid link`
          )
        }
        else {
          if(!isValidUrl(req.body.link)) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `When type 'link' selected - must provide valid link`
            )
          }
          else {
            bannerObj.type = BannerType.LINK;
            bannerObj.link = req.body.link;
          }
        }
        break;
      //TODO: Add page
      case 'none':
        bannerObj.type = BannerType.NONE;
        break;
    }
  
    bannerObj.thumbnail = req.body.thumbnail;
    bannerObj.rank = bannersCount;
  
    let created = await bannersService.create(bannerObj)
     res.json({ banner: created })
  }