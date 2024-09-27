import {
  EllipsisHorizontal,
  PencilSquare,
  Trash,
} from "@medusajs/icons";
import {
  useAdminCustomDelete
} from "medusa-react";
import { DropdownMenu, IconButton, usePrompt } from "@medusajs/ui";
import { Notify } from "../../../types/notify";
import { useQueryClient } from "@tanstack/react-query";
import { ExtendedBanner } from "../../../../services/banner";
import { UpdateBannersResponse } from "../../../../api/admin/banners/[id]/route";

export function BannerActions({
  banner,
  onEdit,
  notify,
}: {
  banner: ExtendedBanner;
  onEdit: () => void;
  notify: Notify;
}) {
  const prompt = usePrompt();
  const queryClient = useQueryClient();

  // const { mutate } = useAdminDeleteProductCategory(category.id, {
  //   onSuccess: async () => {
  //     notify.success("Успіх", "Категорію видалено успішно");
  //     await queryClient.invalidateQueries(adminProductCategoryKeys.lists());
  //   },
  //   onError: (error) => {
  //     notify.error(
  //       "Помилка",
  //       `Під час видалення категорії виникла помилка: "${error.message}"`
  //     );
  //   },
  // });

  const { mutate: mutateDelete, isLoading: isLoadingDeletion } = useAdminCustomDelete<UpdateBannersResponse>(
    `/banners/${banner?.id}`,
    ["banners"], {}, {
      onSuccess: async () => {
        notify.success("Успіх", "Банер видалено успішно");
        await queryClient.invalidateQueries(["banners"]);
      },
      onError: (error) => {
        notify.error(
          "Помилка",
          `Під час видалення банера виникла помилка: "${error.message}"`
        );
      },
    }
  );

  const onDelete = async () => {
    const confirmed = await prompt({
      title: `Видалення банеру - ${banner.id}`,
      description: "Ви впевнені що хочете видалити цей банер?",
      confirmText: "Видалити",
    });

    if (confirmed) {
      mutateDelete();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className="gap-x-2" onClick={onEdit}>
          <PencilSquare className="text-ui-fg-subtle" />
          Редагувати
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        {/* <DropdownMenu.Item className="gap-x-2" onClick={onClearVisits}>
          <Trash className="text-ui-fg-subtle" />
          Очистити перегляди
        </DropdownMenu.Item> */}
        <DropdownMenu.Item className="gap-x-2"
          onClick={onDelete}
        >
          <Trash className="text-ui-fg-subtle" />
          Видалити
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
