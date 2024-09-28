import { 
    MedusaRequest, 
    MedusaResponse,
    FindPaginationParams,
} from "@medusajs/medusa"
import BannerService from "../../../services/banner";

export const GET = async (
    req: MedusaRequest<FindPaginationParams>,
    res: MedusaResponse
) => {
    const {limit,offset} = req.query;
    const bannersService: BannerService = req.scope.resolve(
       "bannerService"
    )

    let results = await bannersService.listAndCount({}, {take: parseInt(`${limit || '10'}`), skip: parseInt(`${offset || '0'}`)});
      res.json({
        count: results[1],
        limit: limit,
        offset: offset,
        banners: results[0].sort(function(a,b) {return a.rank - b.rank})
    })
}