import type { 
    MedusaRequest, 
    MedusaResponse,
    ProductCategoryService,
    ProductService,
} from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import BannerService from "../../../../services/banner";
import CreateUpdateBannerRequest from "../../../../requests/create-update-banner-request";
import { Banner, BannerType } from "../../../../models/banner";
  
export class UpdateBannersResponse {
  banner: Banner
}

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const {id} = req.params;

    const bannersService: BannerService = req.scope.resolve(
        "bannerService"
     )
     const bannerResponse = await bannersService.retrieve(id)
     if (!bannerResponse) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Banner with id: ${id} was not found`
        )
      }
     res.json({ banner: bannerResponse })
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
  res: MedusaResponse<UpdateBannersResponse>
) => {
  const {id} = req.params;

  const bannersService: BannerService = req.scope.resolve(
      "bannerService"
   )
   const categoryService: ProductCategoryService = req.scope.resolve(
    "productCategoryService"
    )
    const productService: ProductService = req.scope.resolve(
      "productService"
      )
   const bannerResponse = await bannersService.retrieve(id);
   if (!bannerResponse) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Banner with id: ${id} was not found`
      )
    }
  //let bannerObj: Banner = new Banner();
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
          bannerResponse.type = BannerType.CATEGORY;
          bannerResponse.categoryId = category.id;
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
          bannerResponse.type = BannerType.PRODUCT;
          bannerResponse.productId = product.id;
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
          bannerResponse.type = BannerType.LINK;
          bannerResponse.link = req.body.link;
        }
      }
      break;
    //TODO: Add page
    case 'none':
      bannerResponse.type = BannerType.NONE;
      break;
  }

  bannerResponse.thumbnail = req.body.thumbnail;

  let updated = await bannersService.update(id, bannerResponse)
   res.json({ banner: updated })
}

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse<UpdateBannersResponse>
) => {
    const {id} = req.params;
    const bannersService: BannerService = req.scope.resolve(
        "bannerService"
     )
     const bannerResponse = await bannersService.retrieve(id);
     if (!bannerResponse) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Banner with id: ${id} was not found`
        )
      }
      await bannersService.delete(id)
    let banners = await bannersService.list();
    banners = banners.sort(function(a, b){return a.rank-b.rank})
    let index = 0;
    for(let banner of banners) {
      banner.rank = index;
      await bannersService.update(banner.id, banner);
      index++;
    }
     res.json({ banner: bannerResponse })
}