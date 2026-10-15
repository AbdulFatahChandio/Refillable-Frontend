"use client";

import React, { useEffect, useState } from "react";
import DashboardSecHd from "./DashboardSecHd";
import { Field, Label, Switch } from "@headlessui/react";
import { useUpdateNotificationPreference } from "@/src/hooks/notifications/useUpdateNotificationPreference";
import { useUserStore } from "@/src/store/useUserStore";
import { useTranslation } from "react-i18next";
export default function NotificationPreference() {
  const { user } = useUserStore();
  const prefs = user?.userNotificationPref;
  const { t } = useTranslation();
  const [emailNotification, setEmailNotification] = useState(false);
  const [smsNotification, setSmsNotification] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);

  const { mutate: updatePreference, isPending } =
    useUpdateNotificationPreference();

  useEffect(() => {
    if (prefs) {
      setEmailNotification(!!prefs.emailPromotional);
      setSmsNotification(!!prefs.pushSystem);
      setPushNotification(!!prefs.emailSystem);
    }
  }, [prefs]);

  const handlePreferenceChange = (type: string, value: boolean) => {
    if (type === "news") setEmailNotification(value);
    if (type === "push") setSmsNotification(value);
    if (type === "sms") setPushNotification(value);

    const query = new URLSearchParams({
      emailPromotional: (type === "news"
        ? value
        : emailNotification
      ).toString(),
      pushPromotional: (type === "news"
        ? value
        : prefs?.pushPromotional || false
      ).toString(),
      pushSystem: (type === "push" ? value : smsNotification).toString(),
      emailSystem: (type === "sms" ? value : pushNotification).toString(),
    }).toString();

    updatePreference({ input: query });
  };

  return (
    <div>
      <DashboardSecHd text={t("Notifications")} />
      <div className="grid grid-cols-12 gap-4 mt-14">
        <ul className="xl:col-span-5 lg:col-span-8 md:col-span-11 col-span-12 flex flex-col gap-10">
          <Field className="flex items-center justify-between font-archivo text-lg font-semibold">
            <Label passive>{t("News and updates")}</Label>
            <Switch
              checked={emailNotification}
              onChange={(val) => handlePreferenceChange("news", val)}
              disabled={isPending}
              className="group relative inline-flex h-7 ltr:w-16 rtl:w-20 items-center rounded-full bg-[#AFAFAF] transition data-checked:bg-[#08814E]"
            >
              <span
                className={`absolute text-[14px] font-semibold text-white transition-all duration-200 ${
                  emailNotification ? "start-2" : "end-2"
                }`}
              >
                {emailNotification ? t("ON") : t("OFF")}
              </span>
              <span className="size-5 ltr:translate-x-1 rtl:-translate-x-1 rounded-full bg-white transition ltr:group-data-checked:translate-x-10 rtl:group-data-checked:-translate-x-14" />
            </Switch>
          </Field>

          {/* Push Notification → pushSystem */}
          <Field className="flex items-center justify-between font-archivo text-lg font-semibold">
            <Label passive>{t("Push Notification")}</Label>
            <Switch
              checked={smsNotification}
              onChange={(val) => handlePreferenceChange("push", val)}
              disabled={isPending}
              className="group relative inline-flex h-7 ltr:w-16 rtl:w-20 items-center rounded-full bg-[#AFAFAF] transition data-checked:bg-[#08814E]"
            >
              <span
                className={`absolute text-[14px] font-semibold text-white transition-all duration-200 ${
                  smsNotification ? "start-2" : "end-2"
                }`}
              >
                {smsNotification ? t("ON") : t("OFF")}
              </span>
              <span className="size-5 ltr:translate-x-1 rtl:-translate-x-1 rounded-full bg-white transition ltr:group-data-checked:translate-x-10 rtl:group-data-checked:-translate-x-14" />
            </Switch>
          </Field>

          {/* Email Notification → emailSystem */}
          <Field className="flex items-center justify-between font-archivo text-lg font-semibold">
            <Label passive>{t("Email Notification")}</Label>
            <Switch
              checked={pushNotification}
              onChange={(val) => handlePreferenceChange("sms", val)}
              disabled={isPending}
              className="group relative inline-flex h-7 ltr:w-16 rtl:w-20 items-center rounded-full bg-[#AFAFAF] transition data-checked:bg-[#08814E]"
            >
              <span
                className={`absolute text-[14px] font-semibold text-white transition-all duration-200 ${
                  pushNotification ? "start-2" : "end-2"
                }`}
              >
                {pushNotification ? t("ON") : t("OFF")}
              </span>
              <span className="size-5 ltr:translate-x-1 rtl:-translate-x-1 rounded-full bg-white transition ltr:group-data-checked:translate-x-10 rtl:group-data-checked:-translate-x-14" />
            </Switch>
          </Field>
        </ul>
      </div>
    </div>
  );
}
