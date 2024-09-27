import { 
    ProductService, 
    ConfigModule,
    MedusaContainer,
  } from "@medusajs/medusa"
import BannerService from "../services/banner"
  
  export default async (
    container: MedusaContainer,
    config: ConfigModule
  ): Promise<void> => {
    console.info("Starting loader...")
    const bannerService = container.resolve<BannerService>(
      "bannerService"
    )
    console.info(`Banners count: ${
      await bannerService.count()
    }`)
    console.info("Ending loader...")
  }