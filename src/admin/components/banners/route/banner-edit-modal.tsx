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
    const { uploads: uploadedImages } = await uploadFile.mutateAsync(
      nativeFiles
    );

    // const metadataWithThumbnail = {
    //   ...getSubmittableMetadata(data.metadata),
    //   thumbnailImageUrl: uploadedImages[0]?.url || data.thumbnail || "",
    //   visitsCount: parseInt(`${data.visits}`) || 0
    // };

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
                  {!form.watch("thumbnail") && (
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
                  //TODO: add categories select
                  null
                :
                form.watch("type") === 'product' ?
                  //TODO: add product select
                  null
                :
                null
              }
              {/* <div className="flex flex-col gap-y-2">
                <Label htmlFor="name" className="text-ui-fg-subtle">
                  Назва
                </Label>
                <Input
                  id="name"
                  placeholder="Солодощі"
                  {...form.register("name")}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="handle" className="text-ui-fg-subtle">
                  Посилання
                  <span className="italic">{` (.../category/${handlePreview})`}</span>
                </Label>
                <Input
                  id="handle"
                  onChangeCapture={(event) =>
                    handlerSanitize(event.currentTarget.value)
                  }
                  onFocus={(event) => {
                    if (event.currentTarget.value === "") {
                      event.currentTarget.value = handlerSanitizeReturn(form.getValues().name);
                      handlerSanitize(form.getValues().name);
                    }
                  }}
                  placeholder="solodoshi"
                  {...form.register("handle")}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="description" className="text-ui-fg-subtle">
                  Опис
                </Label>
                <Input
                  id="description"
                  type="textarea"
                  placeholder="Корисні та смачні солодощі"
                  {...form.register("description")}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="visits" className="text-ui-fg-subtle">
                  Перегляди
                </Label>
                <Input
                  id="visits"
                  type="number"
                  placeholder="0"
                  {...form.register("visits")}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="metadata" className="text-ui-fg-subtle">
                  Метадані
                </Label>
                <MetadataForm
                  form={nestedForm(form, "metadata")}
                  hiddenKeys={["thumbnailImageUrl", "visitsCount"]}
                />
              </div> */}
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
