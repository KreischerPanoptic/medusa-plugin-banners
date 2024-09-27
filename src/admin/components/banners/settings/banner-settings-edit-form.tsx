import { Button, Label, Input } from "@medusajs/ui";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Notify } from "../../../types/notify";
import {
    useAdminCustomPost
} from "medusa-react";
import { BannerSettings } from "../../../../models/banner_settings";
import { useQueryClient } from "@tanstack/react-query";
import { BannersSettingsRequest, BannersSettingsResponse } from "../../../../api/admin/banners-settings/route";

export type BannerSettingsDetailsFormValues = {
    max: number
  };

  const getDefaultValues = (
    settings: BannerSettings
  ): BannerSettingsDetailsFormValues => {
  
    return {
      max: settings.max
    };
  };

const BannerSettingsEditForm = ({
    settings,
    notify,
    onUpdate,
  }: {
    settings: BannerSettings;
    notify: Notify;
    onUpdate: () => void;
  }) => {
    const form = useForm<BannerSettingsDetailsFormValues>({
      defaultValues: getDefaultValues(settings),
    });
  
    // for update after change
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useAdminCustomPost
    <BannersSettingsRequest, BannersSettingsResponse>(
      "/banners-settings",
      ["banners-settings"]
    )

    const onReset = () => {
      form.reset(getDefaultValues(settings));
      onUpdate();
    };
    
    const onSubmit = form.handleSubmit(async (data) => {
      setIsSaving(true);
      const payload: BannersSettingsRequest = {
        max: data.max
      };

      mutateAsync(payload, {
        onSuccess: async ({ banners_settings }) => {
          notify.success("Успіх", `Налаштування банерів ${banners_settings.id} оновлено`);
          onReset();
          await queryClient.invalidateQueries(['banners-settings']);
        },
        onError: () => {
          notify.error(
            "Помилка",
            `Під час оновлення налаштування банерів виникла помилка`
          );
        },
      });
      setIsSaving(false);
    });

    // ...

    // const handleAction = (max: number) => {
    //   customBannerSetting.mutate({
    //     max
    //   }, {
    //     onSuccess: ({ banners_settings }) => {
    //       console.log(banners_settings)
    //     }
    //   })
    // }



    // const { mutateAsync, isLoading } = useAdminCustomPost(
    //     category?.id
    //   );
    
    //   const { mutate } = useAdminCreateProductCategory();
      const [isSaving, setIsSaving] = useState(false);
    
      useEffect(() => {
        if (settings) {
          form.reset(getDefaultValues(settings));
        }
      }, [settings]);

      return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="max" className="text-ui-fg-subtle">
                        Максимальна кількість банерів
                    </Label>
                    <Input
                    id="max"
                    type="number"
                    {...form.register("max")}
                    />
                    <Button isLoading={isLoading || isSaving}>Зберегти</Button>
              </div>
            </div>
        </form>
      )
}

export default BannerSettingsEditForm;