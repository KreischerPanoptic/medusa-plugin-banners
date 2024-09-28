import { Drawer, Button, Text, Label, Input, Select } from "@medusajs/ui";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Notify } from "../../../types/notify";
import { nestedForm } from "../../../utils/nested-form";
import {
  // useAdminUpdateProductCategory,
  // useAdminCreateProductCategory,
  useAdminProductCategories,
  useAdminProducts,
  useAdminCustomPost,
  useAdminUploadFile,
  adminProductCategoryKeys,
  adminProductKeys
} from "medusa-react";
import {
  AdminPostProductCategoriesCategoryReq,
  AdminPostProductCategoriesReq,
  ProductCategory,
  Product,
  Image
} from "@medusajs/medusa";
import { Trash } from "@medusajs/icons";
import ImagesMediaForm, { MediaFormType } from "../../shared/images-media-form";
import TreeCrumbs from "./utils/tree-crumbs";
import { useQueryClient } from "@tanstack/react-query";
import { ExtendedBanner } from "../../../../services/banner";
import CreateUpdateBannerRequest from "../../../../requests/create-update-banner-request";
import { CreateBannersResponse } from "../../../../api/admin/banners/route";
import { UpdateBannersResponse } from "../../../../api/admin/banners/[id]/route";

// import type { ConfigModule } from "@medusajs/medusa";
// import { getConfigFile } from "medusa-core-utils";

export type BannerDetailsFormValues = {
  type: 'product' | 'category' | 'page' | 'link' | 'none';
  productId?: string | null;
  categoryId?: string | null;
  thumbnail?: string | null;
  link?: string | null;
  media?: MediaFormType;
};

const types = [
  {
    label: "Посилання на продукт",
    value: "product",
  },
  {
    label: "Посилання на категорію",
    value: "category",
  },
  {
    label: "Зовнішнє посилання",
    value: "link",
  },
  {
    label: "Без посилання",
    value: "none",
  },
];

// TODO - add prefix into the plugin configuration file
// const { configModule, error } = getConfigFile<ConfigModule>(
//   path.resolve(process.cwd()),
//   "medusa-config.js"
// )

// const fileNamePrefix = "---"
const fileNamePrefix = "";

const getDefaultValues = (
  banner: ExtendedBanner | null,
  createNew: boolean
): BannerDetailsFormValues => {
  // Adding new child category
  if (createNew) {
    return {
      link: null,
      categoryId: null,
      productId: null,
      thumbnail: null,
      media: {
        images: [],
      },
      type: "none"
    };
  }

  return {
    link: banner?.link,
    categoryId: banner?.categoryId,
    productId: banner?.productId,
    thumbnail: banner?.thumbnail,
    media: {
      images: [],
    },
    type: banner?.type,
  };
};

// const translateType = (banner: ExtendedBanner): 'product' | 'category' | 'page' | 'link' | 'none' => {
//   if(!banner) {
//     return 'none'
//   }
//   else if(banner && !banner.type) {
//     return 'none'
//   }
//   else {
//     switch(banner.type) {
//       case BannerType.CATEGORY:
//         return 'category';
//       case BannerType.PRODUCT:
//         return 'product';
//       case BannerType.LINK:
//         return 'link';
//       case BannerType.PAGE:
//         return 'page';
//       default:
//         return 'none';
//     }
//   }
// }

const BannerEditModal = ({
  banner,
  banners,
  isOpen,
  onClose,
  createNew,
  notify,
}: {
  banner: ExtendedBanner;
  banners: ExtendedBanner[];
  isOpen: boolean;
  onClose: () => void;
  createNew: boolean;
  notify: Notify;
}) => {
  const form = useForm<BannerDetailsFormValues>({
    defaultValues: getDefaultValues(banner, createNew),
  });

  // for update after change
  const queryClient = useQueryClient();
  // const { client } = useMedusa();
  const uploadFile = useAdminUploadFile();

  const {product_categories} = useAdminProductCategories({offset: 0, limit: 0});
  const [categories, setCategories] = useState<{
    label: string;
    value: string;
  }[]|undefined>();

  useEffect(() => {
    if(product_categories) {
      let tmpCategories: {
        label: string;
        value: string;
      }[] = [];

      for(let category of product_categories) {
        tmpCategories.push({
          label: category.name,
          value: category.id
        })
      }
      setCategories(tmpCategories);
    }
  }, [product_categories])

  const {products: medusaProducts} = useAdminProducts({offset: 0, limit: 0});

  const [products, setProducts] = useState<{
    label: string;
    value: string;
  }[]|undefined>();

  useEffect(() => {
    if(medusaProducts) {
      let tmpProduct: {
        label: string;
        value: string;
      }[] = [];

      for(let product of medusaProducts) {
        tmpProduct.push({
          label: product.title,
          value: product.id
        })
      }
      setProducts(tmpProduct);
    }
  }, [medusaProducts])

  const { mutateAsync: mutateCreateAsync, isLoading: isLoadingCreation } = useAdminCustomPost
  <CreateUpdateBannerRequest, CreateBannersResponse>(
    "/banners",
    ["banners"]
  )
  const { mutateAsync: mutateUpdateAsync, isLoading: isLoadingUpdate } = useAdminCustomPost
    <CreateUpdateBannerRequest, UpdateBannersResponse>(
      `/banners/${banner?.id}`,
      ["banners"]
    )
  // const { mutateAsync, isLoading } = useAdminUpdateProductCategory(
  //   category?.id
  // );

  // const { mutate } = useAdminCustomPost
  
  
  //useAdminCreateProductCategory();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (banner) {
      form.reset(getDefaultValues(banner, createNew));
    }
  }, [banner]);

  // useEffect(() => {
  //   if (form.watch("handle")) {
  //     setHandlePreview(
  //       encodeURI(form.watch("handle").replace(/ /g, "-").toLowerCase())
  //     );
  //   }
  // }, [form.watch("handle")]);

  const onReset = () => {
    form.reset(getDefaultValues(banner, createNew));
    onClose();
  };

  const handlerRemoveThumbnail = () => {
    form.setValue("thumbnail", "");
    // form.setValue("media", { images: [] });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsSaving(true);

    const nativeFiles = data.media.images.map(
      (i) =>
        new File([i.nativeFile], `${fileNamePrefix}${i.nativeFile.name}`, {
          type: i.nativeFile.type,
        })
    );
    console.log('web form files: ',nativeFiles)
    const { uploads: uploadedImages } = await uploadFile.mutateAsync(
      nativeFiles
    );
    console.log('uploaded files: ', uploadedImages)

    console.log('uploadedImages[0]?.url: ', uploadedImages[0]?.url)
    console.log('data.media.images[0]?.url: ', data.media.images[0]?.url)
    console.log('data.thumbnail: ', data.thumbnail)

    const payload: CreateUpdateBannerRequest = {
      type: data.type,
      categoryId: data.categoryId && data.categoryId.length > 0 ? data.categoryId : null,
      productId: data.productId && data.productId.length > 0 ? data.productId : null,
      thumbnail: uploadedImages[0]?.url ||
      data.media.images[0]?.url ||
      data.thumbnail ||
      "",
      link: data.link && data.link.length > 0 ? data.link : null,
    };
    console.log('constructed payload: ', payload)
    // add new one category
    if (createNew) {
      console.log('thumbnail upload: ', uploadedImages[0]?.url ||
      data.media.images[0]?.url ||
      data.thumbnail ||
      "");
      const payloadNew: CreateUpdateBannerRequest = {
        type: data.type,
        categoryId: data.categoryId && data.categoryId.length > 0 ? data.categoryId : null,
        productId: data.productId && data.productId.length > 0 ? data.productId : null,
        thumbnail: uploadedImages[0]?.url ||
        data.media.images[0]?.url ||
        data.thumbnail ||
        "",
        link: data.link && data.link.length > 0 ? data.link : null,
      };

      mutateCreateAsync(payloadNew, {
        onSuccess: async ({banner}) => {
          notify.success("Успіх", `Банер з ID ${banner.id} створено`);
          onReset();
          await queryClient.invalidateQueries(["banner"]);
        },
        onError: () => {
          notify.error(
            "Помилка",
            `Під час створення банеру виникла помилка`
          );
        },
      })
      setIsSaving(false);
      return;
    }

    mutateUpdateAsync(payload, {
      onSuccess: async ({banner}) => {
        notify.success("Успіх", `Банер з ID ${banner.id} оновлено`);
        onReset();
        await queryClient.invalidateQueries(adminProductCategoryKeys.lists());
      },
      onError: () => {
        notify.error(
          "Помилка",
          `Під час оновлення банеру виникла помилка`
        );
      },
    });
    setIsSaving(false);
  });

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <Drawer.Content className="w-auto right-2 overflow-y-scroll">
        <form onSubmit={onSubmit}>
          <Drawer.Header>
            <Drawer.Title>
              {createNew ? (
                <>Додати банер</>
              ) : (
                <>Оновити банер</>
              )}
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
                  <Label htmlFor="thumbnail" className="text-ui-fg-subtle">
                    Зображення
                  </Label>
                  {!form.watch("thumbnail") && form.watch('thumbnail').length > 0 && (
                    <ImagesMediaForm
                      form={nestedForm(form, "media")}
                      type="thumbnail"
                    />
                  )}
                  {form.watch("thumbnail") && (
                    <div className="max-w-[400px] h-auto">
                      <img
                        src={form.watch("thumbnail")}
                        alt={`Зображення для банера`}
                        className="rounded-rounded"
                      />
                    </div>
                  )}
                  {form.watch("thumbnail") && (
                    <Button
                      onClick={handlerRemoveThumbnail}
                      variant="secondary"
                      disabled={isLoadingCreation || isLoadingUpdate}
                      className="ml-auto"
                    >
                      <Trash /> Видалити зображення
                    </Button>
                  )}
                </div>
                <div className="flex flex-row flex-wrap gap-x-4">
                <div className="flex flex-col flex-1 gap-y-2">
                  <Label htmlFor="is_internal" className="text-ui-fg-subtle">
                    Тип посилання банера
                  </Label>
                  <Controller
                    name="type"
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...other } }) => (
                      <Select {...other} onValueChange={onChange}>
                        <Select.Trigger>
                          <Select.Value placeholder="Оберіть тип посилання для банера" />
                        </Select.Trigger>
                        <Select.Content>
                          {types.map((item) => (
                            <Select.Item key={item.label} value={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    )}
                  />
                </div>
              </div>
              {
                form.watch("type") === 'link' ?
                  <div className="flex flex-col gap-y-2">
                    <Label htmlFor="link" className="text-ui-fg-subtle">
                      Зовнішнє посилання
                    </Label>
                    <Input
                      id="link"
                      placeholder="https://..."
                      {...form.register("link")}
                    />
                  </div>
                :
                form.watch("type") === 'category' ?
                <div className="flex flex-row flex-wrap gap-x-4">
                <div className="flex flex-col flex-1 gap-y-2">
                  <Label htmlFor="is_internal" className="text-ui-fg-subtle">
                    {"Зв`язана категорія"}
                  </Label>
                  <Controller
                    name="categoryId"
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...other } }) => (
                      <Select {...other} onValueChange={onChange}>
                        <Select.Trigger>
                          <Select.Value placeholder="Оберіть зв`язану категорію для банера" />
                        </Select.Trigger>
                        <Select.Content>
                          {
                            categories && categories.length > 0 ? 
                            categories.map((item) => (
                              <Select.Item key={item.label} value={item.value}>
                                {item.label}
                              </Select.Item>
                            )) : null
                          }
                        </Select.Content>
                      </Select>
                    )}
                  />
                </div>
              </div>
                :
                form.watch("type") === 'product' ?
                <div className="flex flex-row flex-wrap gap-x-4">
                <div className="flex flex-col flex-1 gap-y-2">
                  <Label htmlFor="is_internal" className="text-ui-fg-subtle">
                    {"Зв`язаний продукт"}
                  </Label>
                  <Controller
                    name="productId"
                    control={form.control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...other } }) => (
                      <Select {...other} onValueChange={onChange}>
                        <Select.Trigger>
                          <Select.Value placeholder="Оберіть зв`язаний продукт для банера" />
                        </Select.Trigger>
                        <Select.Content>
                          {
                            products && products.length > 0 ? 
                            products.map((item) => (
                              <Select.Item key={item.label} value={item.value}>
                                {item.label}
                              </Select.Item>
                            )) : null
                          }
                        </Select.Content>
                      </Select>
                    )}
                  />
                </div>
              </div>
                :
                null
              }
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary" disabled={isLoadingCreation || isLoadingUpdate}>
                Скасувати
              </Button>
            </Drawer.Close>
            <Button isLoading={isLoadingCreation || isLoadingUpdate || isSaving}>Зберегти</Button>
          </Drawer.Footer>
        </form>
      </Drawer.Content>
    </Drawer>
  );
};

export default BannerEditModal;
