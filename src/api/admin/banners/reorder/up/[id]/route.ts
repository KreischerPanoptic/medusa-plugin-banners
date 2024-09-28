import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import BannerService from "../../../../../../services/banner"
import { Banner } from "../../../../../../models/banner";
import { BannerResponse } from "../../down/[id]/route";

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse<BannerResponse>
) => {
    const {id} = req.params;

    const bannersService: BannerService = req.scope.resolve(
        "bannerService"
     )
     const bannerResponse: Banner = await bannersService.retrieve(id)
     if (!bannerResponse) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Banner with id: ${id} was not found`
        )
      }
    if(bannerResponse.rank <= 0) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Banner with id: ${id} was already at the lowest position!`
          )
    }
    const allBanners = await bannersService.list();

    let updateToUp: Banner;
    for(let banner of allBanners) {
        if(banner.rank === bannerResponse.rank-1) {
            updateToUp = banner;
        }
    }

    if(!updateToUp) {
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Banner to swap up with banner with id - ${id} which goes down - not found`
          )
    } 

    updateToUp.rank += 1;
    bannerResponse.rank -= 1;

    const updateToUpResult = await bannersService.update(updateToUp.id, updateToUp);
    const updateToDownResult = await bannersService.update(bannerResponse.id, bannerResponse);
    
    res.json({ banner: updateToDownResult })
}