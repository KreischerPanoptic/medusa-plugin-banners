export default class CreateUpdateBannerRequest {
    type: 'product' | 'category' | 'page' | 'link' | 'none' = 'none';
    productId?: string | null;
    categoryId?: string | null;
    imageId?: string | null;
    link?: string | null;
}