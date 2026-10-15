"use client";

import { useTranslation } from "react-i18next";
import useClickOutside from "../hooks/useClickOutside";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { GoDotFill } from "react-icons/go";
import { useNotificationGetAll } from "../hooks/notifications/useNotificationGetAll";
import { useMarkReadNotification } from "../hooks/notifications/useMarkReadNotification";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeToMessages } from "@/firebase";
import NotificationToast from "./NotificationToast";
import { toast } from "react-toastify";
import { BsBell, BsBellFill } from "react-icons/bs";

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function DashboardNotificationDropdown({ isScrolled }: any) {
  const { t, i18n } = useTranslation();
  const { modal, setModal, modalRef } = useClickOutside();
  const router = useAppRouter();
  const queryClient = useQueryClient();
  const arabic = i18n.language === "ar";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationGetAll({ limit: 10 });

  const notifications = data?.pages.flatMap((page: any) => page.data) ?? [];
  const unread = data?.pages?.[0]?.meta?.unreadCount ?? 0;

  const { mutate } = useMarkReadNotification();

  const notificationRoutes = [
    "orderShipped",
    "orderDelivered",
    "orderCancelledByAdmin",
    "adminApprovedRefundPartial",
    "adminApprovedRefundFull",
    "adminRejectRefund",
  ];

  const refundEvents = [
    "adminApprovedRefundPartial",
    "adminApprovedRefundFull",
    "adminRejectRefund",
  ];

  const handleNotificationUpdate = (item: any) => {
    mutate(
      { id: item.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          if (notificationRoutes.includes(item?.notification?.event)) {
            const idKey = refundEvents.includes(item?.notification?.event)
              ? "order_id"
              : "id";

            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order"] });
            router.push(
              `/dashboard/order-history/${item?.notification?.metadata?.[idKey]}`,
            );
          }
        },
      },
    );
  };

  useEffect(() => {
    const unsubscribe = subscribeToMessages((payload: any) => {
      console.log(payload);

      const title = payload.notification?.title || "";
      const body = payload.notification?.body || "";
      toast(<NotificationToast title={title} body={body} />, {
        className: "custom-toast",
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      // agar cleanup karna ho to yahan karo
    };
  }, [queryClient]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "NEW_NOTIFICATION") {
          const payload = event.data.payload;
          console.log("📨 Background → React message:", payload);
        }
      });
    }
  }, [queryClient]);

  useEffect(() => {
    if (!modal) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [modal]);

  return (
    <div
      onClick={() => setModal((prev: any) => !prev)}
      ref={modalRef}
      className="relative flex flex-shrink-0 cursor-pointer items-center justify-center rounded-full z-50"
    >
      <span className="!leading-none relative">
        {unread && unread > 0 ? (
          <BsBellFill className="2xl:text-2xl text-xl" />
        ) : (
          <BsBell className="2xl:text-2xl text-xl" />
        )}
      </span>

      <div
        className={`absolute rtl:left-0 ltr:right-0 py-1 ps-2 !pe-0 md:p-3 top-12 md:w-[366px] w-[260px] ${
          arabic ? "origin-top-left" : "origin-top-right"
        } border border-[#D9D9D9] rounded-xl bg-secondary text-primary duration-500 ${
          modal
            ? "visible scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="max-h-[60vh] overflow-y-auto pe-3
             nice-scroll nice-scroll--dark scroll-autohide"
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }
          }}
        >
          {isLoading && notifications?.length === 0 ? (
            <p className="text-sm font-medium text-primary py-10 text-center">
              {t("Loading...")}
            </p>
          ) : notifications?.length > 0 ? (
            <>
              {notifications?.map((item: any) => {
                const isUnread = !item.read;
                const translation =
                  item?.notification?.translations?.find(
                    (tr: any) => tr?.language === (arabic ? "ar" : "en"),
                  ) || item?.notification?.translations?.[0];
                const title = translation?.title || "";
                const body = translation?.body || "";
                const plainBody = stripHtml(body);
                const itemId = item.id ?? title;
                const isRtlBody = Boolean(
                  arabic &&
                    item?.notification?.translations?.find(
                      (tr: any) => tr?.language === "ar",
                    )?.body,
                );

                return (
                  <div key={itemId}>
                    <button
                      className="w-full text-left pt-3 pb-5 transition bg-transparent rtl:pr-3"
                      onClick={() => {
                        handleNotificationUpdate(item);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 pb-1.5">
                        <p
                          className={`flex items-start gap-1 text-sm capitalize min-w-0 flex-1 ${
                            isUnread
                              ? "text-primary font-bold"
                              : "text-primary font-medium"
                          }`}
                        >
                          {isUnread && (
                            <GoDotFill className="shrink-0 mt-0.5" />
                          )}
                          <span
                            className="line-clamp-2 break-words text-start"
                            title={title}
                          >
                            {title}
                          </span>
                        </p>
                        <p
                          className="text-[10px] font-medium text-primary shrink-0 whitespace-nowrap pt-0.5"
                          dir="ltr"
                        >
                          {item.notification?.createdAt
                            ? new Date(
                                item.notification?.createdAt,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : ""}
                        </p>
                      </div>

                      <p
                        className={`text-xs capitalize text-primary line-clamp-2 break-words overflow-hidden ${
                          isRtlBody ? "text-right" : "text-left"
                        } ${isUnread ? "ps-4" : ""}`}
                        title={plainBody}
                        dangerouslySetInnerHTML={{ __html: body }}
                      />
                    </button>
                    <hr className="text-primary" />
                  </div>
                );
              })}
            </>
          ) : (
            <p className="text-sm font-medium text-primary py-16 text-center">
              {t("No notifications Available")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardNotificationDropdown;
