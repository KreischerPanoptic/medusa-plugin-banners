import {
    useAdminCustomQuery
} from "medusa-react";
  
  import { Button, Container, Text, useToggleState } from "@medusajs/ui";
//   import ProductCategoriesList from "../../components/categories/product-categories-list";
  import { RouteConfig } from "@medusajs/admin";
  import { Notify } from "../../types/notify";
  
  import {
    Photo,
    Spinner,
    ExclamationCircle,
    PlusMini,
  } from "@medusajs/icons";
//   import CategoryEditModal from "../../components/categories/category-edit-modal";
  import { useQueryClient } from "@tanstack/react-query";
import BannersList from "../../components/banners/route/banners-list";
import { ExtendedBanner } from "../../../services/banner";
import { useEffect, useState } from "react";
import { ExtendedBannersResponse } from "../../../api/admin/banners/route";

  function BannersEmptyState() {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <p className="text-grey-40">
          Банерів не знайдено. Використайте кнопку зверху для створення першого банеру.
        </p>
      </div>
    );
  }
  
  function BannersErrorState() {
    return (
      <Container className="flex min-h-[320px] items-center justify-center mt-8">
        <div className="flex items-center gap-x-2">
          <ExclamationCircle className="text-ui-fg-base" />
          <Text className="text-ui-fg-subtle">
            Під час завантаження банерів виникла помилка. Перезавантажте сторінку
            та спробуйте ще раз. Якщо помилка залишається - спробуйте пізніше.
          </Text>
        </div>
      </Container>
    );
  }
  
  /**
   * Product category index page container.
   */
  const BannersPage = ({ notify }: { notify: Notify }) => {
    const {
      state: isCreateModalVisible,
      open: showCreateModal,
      close: hideCreateModal,
    } = useToggleState();
  
    const queryClient = useQueryClient();
  
    const closeEditModal = async () => {
      hideCreateModal();
      await queryClient.invalidateQueries(["banners"]);
    };
  
    const { data, isLoading, isError } = useAdminCustomQuery
    <any, ExtendedBannersResponse>(
      "/banners",
      ["banners"],
      {}
    )

    const [banners, setBanners] = useState<ExtendedBanner[]|undefined|null>()
    useEffect(() => {
      if(data && data.banners) {
        setBanners(data.banners);
      }
    }, [data])
  
    const showPlaceholder = !isLoading && !banners;
  
    if (isError || !banners) {
      return <BannersErrorState />;
    }
  
    return (
      <>
        {/* {isCreateModalVisible && (
          <CategoryEditModal
            isOpen={isCreateModalVisible}
            onClose={closeEditModal}
            category={null}
            categories={null}
            createNew={isCreateModalVisible}
            notify={notify}
          />
        )} */}
        <Container className="flex flex-col min-h-[640px] grow h-full w-full">
          <div className="flex justify-between align-top border-grey-20 border-b pb-4">
            <div>
              <h1 className="inter-xlarge-semibold text-grey-90">
                Керування Банерами
              </h1>
              <h3 className="inter-small-regular text-grey-50 pt-1.5">
                Тут ви можете керувати банерами та створювати нові рекламні матеріали
              </h3>
            </div>
            <Button
              variant="secondary"
              className="h-8 self-center"
              onClick={showCreateModal}
            >
              <PlusMini />
              Новий банер
            </Button>
          </div>
          <div className="flex flex-col justify-between mt-4 h-full w-full">
            {showPlaceholder ? (
              <BannersEmptyState />
            ) : isLoading ? (
              <div className="flex h-max items-center justify-center">
                <Spinner className="text-ui-fg-subtle animate-spin" />
              </div>
            ) : (
              <BannersList
                notify={notify}
                banners={banners!}
              />
            )}
          </div>
        </Container>
      </>
    );
  };
  
  export const config: RouteConfig = {
    link: {
      label: "Банери",
      icon: Photo,
    },
  };
  
  export default BannersPage;
  