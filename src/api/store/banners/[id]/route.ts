import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import BannerService from "../../../../services/banner";

  
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