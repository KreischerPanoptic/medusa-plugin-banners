import { 
    ProductService, 
    ConfigModule,
    MedusaContainer,
  } from "@medusajs/medusa"
import BannerSettingsService from "../services/banner_settings"
  
  export default async (
    container: MedusaContainer,
    config: ConfigModule
  ): Promise<void> => {
    console.info("Starting loader...")
    const bannerService = container.resolve<BannerSettingsService>(
      "bannerService"
    )
    let currentSettings = await bannerService.retrieve()
    if(!currentSettings) {
      currentSettings = await bannerService.seed();
    }
    console.info(`Max banners count in settings: ${
      currentSettings.max
    }`)
    console.info("Ending loader...")
  }