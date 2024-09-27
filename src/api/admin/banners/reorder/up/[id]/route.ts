import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import BannerService from "../../../../../../services/banner"
import { Banner } from "../../../../../../models/banner";
import BannerSettingsService from "../../../../../../services/banner_settings";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const {id} = req.params;

    const bannersService: BannerService = req.scope.resolve(
        "bannerService"
     )
     const bannersSettingsService: BannerSettingsService = req.scope.resolve(
        "bannerSettingsService"
     );

     const settingsResult = await bannersSettingsService.retrieve()

    if (!settingsResult) {
        throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Banner settings was not found"
        )
    }

     const bannerResponse: Banner = await bannersService.retrieve(id)
     if (!bannerResponse) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Banner with id: ${id} was not found`
        )
      }
    if(bannerResponse.rank >= settingsResult.max) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Banner with id: ${id} was already at the lowest position!`
          )
    }
    const allBanners = await bannersService.list();

    let updateToDown: Banner;
    for(let banner of allBanners) {
        if(banner.rank === bannerResponse.rank+1) {
            updateToDown = banner;
        }
    }

    if(!updateToDown) {
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Banner to swap down with banner with id - ${id} which goes up - not found`
          )
    } 

    updateToDown.rank -= 1;
    bannerResponse.rank += 1;

    const updateToDownResult = await bannersService.update(updateToDown.id, updateToDown);
    const updateToUpResult = await bannersService.update(bannerResponse.id, bannerResponse);
    
    res.json({ banner: updateToUpResult })
}