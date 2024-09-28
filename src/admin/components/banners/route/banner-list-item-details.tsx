import { useState } from "react";
import { ArrowUpMini, ArrowDownMini } from "@medusajs/icons";
import {
  useToggleState,
  clx,
} from "@medusajs/ui";
import { BannerActions } from "./action-menu";
// import CategoryEditModal from "./category-edit-modal";
import BannerEditModal from "./banner-edit-modal";
import { Notify } from "../../../types/notify";
import { ExtendedBanner } from "../../../../services/banner";
import { Product, ProductCategory } from "@medusajs/medusa";
import { BannerSettings } from "../../../../models/banner_settings";
import { useAdminCustomPost } from "medusa-react";
import { BannerResponse } from "../../../../api/admin/banners/reorder/down/[id]/route";

type BannerListItemDetailsProps = {
  banners: ExtendedBanner[];
  item: ExtendedBanner;
  settings: BannerSettings;
  notify: Notify;
  refresh: () => void
};

function BannerListItemDetails({
  banners,
  item,
  settings,
  notify,
  refresh
}: BannerListItemDetailsProps) {
  const [activeBanner, setActiveBanner] = useState<ExtendedBanner>(null);

  //const hasChildren = !!item.category_children?.length;

  // const metadataContext = JSON.stringify(item.metadata).split(" ")[0];

  const {
    state: isCreateModalVisible,
    open: showCreateModal,
    close: hideCreateModal,
  } = useToggleState();

  const {
    state: isEditModalVisible,
    open: showEditModal,
    close: hideEditModal,
  } = useToggleState();

  const editBanner = (banner: ExtendedBanner) => {
    setActiveBanner(banner);
    showEditModal();
  };

  const closeEditModal = () => {
    setActiveBanner(null);
    hideEditModal();
    hideCreateModal();
  };

  const { mutateAsync: mutateUpAsync, isLoading: isLoadingUp } = useAdminCustomPost
    <any, BannerResponse>(
      `/banners/reorder/up/${item?.id}`,
      ["banners"]
    )

  const { mutateAsync: mutateDownAsync, isLoading: isLoadingDown } = useAdminCustomPost
    <any, BannerResponse>(
      `/banners/reorder/down/${item?.id}`,
      ["banners"]
    )

  const sendDown = async () => {
    await mutateDownAsync({}, 
      {
        onSuccess: async ({banner}) => {
          notify.success("Успіх", `Банер з ID ${banner.id} понижено у видачі`);
          refresh();
        },
        onError: () => {
          notify.error(
            "Помилка",
            `Під час редагування позиції банеру виникла помилка`
          );
        },
      }
    )
  }

  const sendUp = async () => {
    await mutateUpAsync({}, 
      {
        onSuccess: async ({banner}) => {
          notify.success("Успіх", `Банер з ID ${banner.id} підвищено у видачі`);
          refresh();
        },
        onError: () => {
          notify.error(
            "Помилка",
            `Під час редагування позиції банеру виникла помилка`
          );
        },
      }
    )
  }

  return (
    <>
      <BannerEditModal
        isOpen={
          !!activeBanner && (isEditModalVisible || isCreateModalVisible)
        }
        onClose={closeEditModal}
        banner={activeBanner}
        banners={banners}
        createNew={isCreateModalVisible}
        notify={notify}
      />
      <div className="bg-ui-bg-component hover:bg-ui-bg-component-hover rounded-rounded">
        <div
          // style={{ marginLeft: depth * -8 }}
          className="flex w-full h-14 items-center"
        >
          {/* <div className="flex w-8 items-center justify-center">{handler}</div> */}

          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center">
              <div className="absolute flex w-5 items-center justify-center">
                {
                  item.rank <= 0 ?
                  //Add up button
                  <ArrowDownMini onClick={() => {sendDown()}}/>
                  :
                  item.rank >= settings.max || item.rank === banners?.[banners?.length-1]?.rank ?
                  <ArrowUpMini onClick={() => {sendUp()}}/>
                  :
                  <div className="flex flex-col gap-y-2">
                    <ArrowUpMini onClick={() => {sendUp()}}/>
                    <ArrowDownMini onClick={() => {sendDown()}}/>
                  </div>
                }
              </div>
              <div
                className=" ml-8 flex items-center cursor-pointer w-full gap-x-2"
                onClick={() => editBanner(item)}
              >
                <div className="flex items-center gap-x-2">
                  {!item.thumbnail && (
                    <div className="flex w-14 h-10 items-center justify-center bg-ui-bg-component rounded-rounded border-[1px]"></div>
                  )}
                  {item.thumbnail && (
                    <div className="flex w-14 h-12 items-center justify-center">
                      <img
                        src={item.thumbnail}
                        alt={`Зображення ${item.id}`}
                        className="rounded-rounded max-w-14 max-h-12"
                      />
                    </div>
                  )}
                  <div className="select-none italic text-xs text-ui-fg-muted min-w-20">
                    {`(${item.rank+1})`}
                  </div>
                  <div
                    className={clx("select-none text-xs font-medium min-w-16", {
                      "font-normal text-ui-fg-muted": false,
                    })}
                  >
                    {item.type}
                  </div>
                  {item.link && (
                    <div className="select-none text-xs text-ui-fg-muted">
                      {item.link}
                    </div>
                  )}
                  {item.product && item.productId && (
                    <div className="select-none text-xs text-ui-fg-muted">
                      {(item.product as Product).title}
                    </div>
                  )}
                  {item.category && item.categoryId && (
                    <div className="select-none text-xs text-ui-fg-muted">
                      {(item.category as ProductCategory).name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BannerActions
                banner={item}
                notify={notify}
                onEdit={() => editBanner(item)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BannerListItemDetails;
