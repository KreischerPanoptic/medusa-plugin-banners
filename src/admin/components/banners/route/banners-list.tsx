import React, { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { dropRight, flatMap, get } from "lodash";
import Nestable from "react-nestable";

// import "react-nestable/dist/styles/index.css";
import NestableCategoriesStyle from "./utils/nestable-style";

import { AiOutlineDrag } from "react-icons/ai";
import { useToggleState, clx } from "@medusajs/ui";
import { PlaySolid } from "@medusajs/icons";
import { ProductCategory } from "@medusajs/medusa";
import { adminProductCategoryKeys, useMedusa } from "medusa-react";

import ProductCategoryListItemDetails from "./banner-list-item-details";

import { Notify } from "../../../types/notify";
// import { flattenCategoryTree } from "./utils/categories-utils";
import { ExtendedBanner } from "../../../../services/banner";
import BannerListItemDetails from "./banner-list-item-details";

type BannersListProps = {
  banners: ExtendedBanner[];
  notify: Notify;
};

/**
 * Draggable list that renders product categories tree view.
 */
function BannersList(props: BannersListProps) {
  const { client } = useMedusa();
  const queryClient = useQueryClient();
  const [isUpdating, enableUpdating, disableUpdating] = useToggleState(false);
  const [isError, enableError, disableError] = useToggleState(false);
  const { banners, notify } = props;

//   const onItemDrop = useCallback(
//     async (params: {
//       dragItem: ProductCategory;
//       items: ProductCategory[];
//       targetPath: number[];
//     }) => {
//       enableUpdating();
//       let parentId = null;
//       const { dragItem, items, targetPath } = params;
//       const [rank] = targetPath.slice(-1);

//       if (targetPath.length > 1) {
//         const path = dropRight(
//           flatMap(targetPath.slice(0, -1), (item) => [
//             item,
//             "category_children",
//           ])
//         );

//         const newParent = get(items, path);
//         parentId = newParent.id;
//       }

//       try {
//         disableError();

//         await client.admin.productCategories.update(dragItem.id, {
//           parent_category_id: parentId,
//           rank,
//         });
//         notify.success("Успіх", "Успішно оновлено дерево категорій");
//       } catch (e) {
//         notify.error("Помилка", "Не вдалось оновити дерево категорій");
//         enableError();
//       } finally {
//         await queryClient.invalidateQueries(adminProductCategoryKeys.lists());
//         disableUpdating();
//       }
//     },
//     []
//   );

  const NestableList = (
    <Nestable
      items={banners}
      collapsed={true}
      //onChange={onItemDrop}
      // Adding an unreasonably high number here to prevent us from
      // setting a hard limit  on category depth. This should be decided upon
      // by consumers of medusa after considering the pros and cons to the approach
      maxDepth={99}
      renderItem={({ item, handler, collapseIcon }) => (
        <BannerListItemDetails
          item={item as ExtendedBanner}
          banners={banners}
          handler={handler}
          collapseIcon={collapseIcon}
          notify={notify}
        />
      )}
      handler={
        <AiOutlineDrag className="cursor-move" color="#a1a1aa" size={24} />
      }
      renderCollapseIcon={({ isCollapsed }) => (
        <PlaySolid
          color="#a1a1aa"
          className={clx("cursor-pointer", { "rotate-90": !isCollapsed })}
        />
      )}
    />
  );
  return (
    <div className={clx("relative", { "pointer-events-none": isUpdating })}>
      <NestableCategoriesStyle />
      {NestableList}
      {isUpdating && (
        <div className="absolute w-full top-0 bottom-0 cursor-progress" />
      )}
    </div>
  );
}

export default React.memo(BannersList); // Memo prevents list flicker on reorder
