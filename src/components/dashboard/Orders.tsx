"use client";

import React, { useState } from "react";
import DashboardSecHd from "./DashboardSecHd";
import OrderCard from "./OrderCard";
import { useOrderGetAll } from "@/src/hooks/orders/useOrderGetAll";
import ProductError from "../ProductError";
import Pagination from "../Pagination";
import { useTranslation } from "react-i18next";
import Spinner from "../Spinner";

export default function Orders() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { t } = useTranslation();

  const collections = [
    {
      name: t("All"),
      value: "all",
    },
    {
      name: t("unpaid"),
      value: "unpaid",
    },
    {
      name: t("pending_confirmation"),
      value: "pending_confirmation",
    },
    {
      name: t("processing"),
      value: "processing",
    },
    {
      name: t("shipped"),
      value: "shipped",
    },
    {
      name: t("delivered"),
      value: "delivered",
    },
    // {
    //   name: t("cancelled"),
    //   value: "cancelled",
    // },
    // {
    //   name: t("refunded"),
    //   value: "refunded",
    // },
  ];

  const { data, isLoading } = useOrderGetAll({
    limit: 10,
    page,
    ...(status && status !== "all" && { status }),
  });

  const orders = data?.data;

  const totalpages = data?.meta?.totalPages || 0;

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  return (
    <>
      <DashboardSecHd text={t("Order History")} />
      <div className="grid grid-cols-12 gap-4 md:mt-14 mt-3">
        <div className="lg:col-span-11 col-span-12">
          <div className={"flex gap-1 md:mb-10 mb-4 flex-wrap"}>
            {collections?.map((collection, index) => (
              <button
                key={index}
                onClick={() => {
                  setStatus(collection.value);
                  setPage(1);
                }}
                className={`bg-secondary text-brown outline-none ${status === collection.value
                  ? "bg-secondary text-brown border-brown"
                  : "bg-secondary text-brown border-transparent"
                  } hover:bg-secondary border-b-4  hover:border-brown hover:text-brown transition-all cursor-pointer md:px-2 px-1 md:py-2 py-1.5 uppercase md:text-sm text-[12px]`}
              >
                {collection.name}
              </button>
            ))}
          </div>
          <div>
            {orders && orders?.length > 0 && (
              orders?.map((order, index) => (
                <div className="mb-5" key={index}>
                  <OrderCard key={index} order={order} />
                </div>
              ))
            )}
            {!isLoading && orders?.length === 0 && <div className="md:mt-28 mt-18"><ProductError text={t("orders_not_found")} /></div>}
            {isLoading && <Spinner className="mt-20" />}
            {orders && totalpages > 1 && (
              <Pagination
                totalPages={totalpages}
                currentPage={page}
                onPageChange={handlePageClick}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
