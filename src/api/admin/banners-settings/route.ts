import { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"
import BannerSettingsService from "../../../services/banner_settings";
import { BannerSettings } from "../../../models/banner_settings";

export class BannersSettingsRequest {
    max: number
}

export class BannersSettingsResponse {
  banners_settings: BannerSettings
}

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse<BannersSettingsResponse>
) => {
    const bannersService: BannerSettingsService = req.scope.resolve(
       "bannerSettingsService"
    )

    let settings = await bannersService.retrieve()
      res.json({
        banners_settings: settings
    })
}

export const POST = async (
    req: MedusaRequest<BannersSettingsRequest>,
    res: MedusaResponse
  ) => {
    const max = req.body.max
  
    const bannersService: BannerSettingsService = req.scope.resolve(
        "bannerSettingsService"
     )

    let settings = await bannersService.retrieve()

    settings.max = max;
      res.json({
        banners_settings: await bannersService.update(settings)
    })


    // do something with the data...
  }