import { useState } from "react";
import { Tag, PlusMini } from "@medusajs/icons";
import {
  StatusBadge,
  IconButton,
  Tooltip,
  useToggleState,
  clx,
} from "@medusajs/ui";
import { BannerActions } from "./action-menu";
// import CategoryEditModal from "./category-edit-modal";
import BannerEditModal from "./banner-edit-modal";
import { Notify } from "../../../types/notify";
import { ExtendedBanner } from "../../../../services/banner";

type BannerListItemDetailsProps = {
  banners: ExtendedBanner[];
  item: ExtendedBanner;
  handler: React.ReactNode;
  collapseIcon: React.ReactNode;
  notify: Notify;
};

function BannerListItemDetails({
  banners,
  item,
  handler,
  collapseIcon,
  notify,
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
                <Tag color="#a1a1aa" />
              </div>
              <div
                className=" ml-8 flex items-center cursor-pointer w-full gap-x-2"
                onClick={() => editBanner(item)}
              >
                <div className="flex items-center gap-x-2">
                  {!item.imageUrl && (
                    <div className="flex w-14 h-10 items-center justify-center bg-ui-bg-component rounded-rounded border-[1px]"></div>
                  )}
                  {item.imageUrl && (
                    <div className="flex w-14 h-12 items-center justify-center">
                      <img
                        src={item.imageUrl}
                        alt={`Зображення ${item.id}`}
                        className="rounded-rounded max-w-14 max-h-12"
                      />
                    </div>
                  )}
                  <div className="select-none italic text-xs text-ui-fg-muted min-w-20">
                    {`(${item.rank})`}
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
