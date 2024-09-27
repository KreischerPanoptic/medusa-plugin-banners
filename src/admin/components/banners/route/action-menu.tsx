import {
  EllipsisHorizontal,
  Bolt,
  XCircle,
  PencilSquare,
  Trash,
} from "@medusajs/icons";
import {
  useAdminDeleteProductCategory,
  useAdminUpdateProductCategory,
  adminProductCategoryKeys,
} from "medusa-react";
import { DropdownMenu, IconButton, usePrompt } from "@medusajs/ui";
import { Notify } from "../../../types/notify";
import PublishIcon from "../../shared/icons/publish-icon";
import UnpublishIcon from "../../shared/icons/unpublish-icon";
import { useQueryClient } from "@tanstack/react-query";
import { ExtendedBanner } from "../../../../services/banner";

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

  // const updateCategory = useAdminUpdateProductCategory(category.id);

  // const handleUpdateStatus = (changeTarget: "is_active" | "is_internal") => {
  //   updateCategory.mutate(
  //     {
  //       is_active:
  //         changeTarget === "is_active"
  //           ? !category.is_active
  //           : (category.is_active as boolean),
  //       is_internal:
  //         changeTarget === "is_internal"
  //           ? !category.is_internal
  //           : (category.is_internal as boolean),
  //     },
  //     {
  //       onSuccess: () => {
  //         notify.success("Успіх", "Статус категорії змінено успішно");
  //       },
  //       onError: (error) => {
  //         notify.error(
  //           "Помилка",
  //           `Під час змінення статусу категорії виникла помилка: "${error.message}"`
  //         );
  //       },
  //     }
  //   );
  // };


  // const onDelete = async () => {
  //   const confirmed = await prompt({
  //     title: `Видалення категорії - ${category.name}`,
  //     description: "Ви впевнені що хочете видалити цю категорію?",
  //     confirmText: "Видалити",
  //   });

  //   if (confirmed) {
  //     mutate();
  //   }
  // };

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
        //onClick={onDelete}
        >
          <Trash className="text-ui-fg-subtle" />
          Видалити
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
