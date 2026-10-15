"use client";

import React, { useState } from "react";
import DashboardSecHd from "./DashboardSecHd";
import locationicon from "@/public/assets/images/location-add.png";
import trash from "@/public/assets/images/trash.png";
import edit from "@/public/assets/images/edit.png";
import Image from "next/image";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useAddressGetAll } from "@/src/hooks/address/useAddressGetAll";
import Pagination from "../Pagination";
import ProductError from "../ProductError";
import { useUserUpdateAddress } from "@/src/hooks/address/useUserUpdateAddress";
import { useQueryClient } from "@tanstack/react-query";
import { useUserDeleteAddress } from "@/src/hooks/address/useUserDeleteAddress";
import { useTranslation } from "react-i18next";
import Spinner from "../Spinner";
import { MdOutlineHome } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Button from "../Button";

export default function Address() {
  const queryClient = useQueryClient();

  const router = useAppRouter();

  const [page, setPage] = useState(1);

  const { data, isLoading } = useAddressGetAll({
    limit: 10,
    page,
  });

  const address = data?.data;

  const totalpages = data?.meta?.totalPages || 4;

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  const { t } = useTranslation();
  const { mutate, isPending } = useUserUpdateAddress();

  const { mutate: deleteAddress, isPending: isDeleting } =
    useUserDeleteAddress();

  const handleUpdate = (id: string) => {
    mutate(
      {
        id, // address ID
        input: { isDefault: true }, // body
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
      }
    );
  };
  const handleDelete = (id: string) => {
    deleteAddress(
      {
        id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
      }
    );
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="2xl:col-span-6 lg:col-span-10 md:col-span-11 col-span-12">
          <div className="flex justify-between items-center gap-2">
            <DashboardSecHd text={t("Address")} />
            <Button
              text={<>
                <FaPlus className="inline me-2" />
                {t("Add Address")}
              </>}
              btnTheme="dark"
              type="button"
              onClick={() => router.push("/dashboard/address/add")}
            />
            {/* <Image
                src={locationicon}
                alt="locationicon"
                className="group-hover:invert-0 invert"
                width={24}
                height={24}
              /> */}


          </div>
          {address && address.length > 0 && (
            <ul className="md:mt-14 mt-10 flex flex-col gap-6 md:mb-10 mb-5">
              {address?.map((address, index) => (
                <li
                  key={index}
                  className="md:py-4 py-2 md:px-5 px-3 border border-brown"
                >
                  <div className="flex items-center md:gap-3 gap-2">
                    <input
                      type="radio"
                      name="address"
                      id={`${address?.id}`}
                      value={`${address?.id}`}
                      checked={address?.isDefault}
                      disabled={isPending}
                      hidden
                      onChange={() => handleUpdate(String(address?.id))}
                      className="relative w-5 h-5 shrink-0 border-2 border-primary rounded-[2px] bg-transparent appearance-none cursor-pointer
                           checked:before:absolute checked:before:bg-primary checked:before:rounded-[2px] checked:before:w-2 checked:before:h-2 checked:before:left-[4px] checked:before:top-[4px]
                           transition-all duration-200"
                    />
                    <MdOutlineHome size={26} />
                    <span
                      className="font-medium capitalize max-sm:text-sm"
                    >
                      {address?.firstName}{" "}
                    </span>
                    <label
                      htmlFor={`${address?.id}`}
                      className="cursor-pointer bg-light-brown md:px-5 px-3 sm:text-sm text-[11px] py-1.5 text-secondary font-medium"
                    >
                      {address?.isDefault ? t("Default") : t("Set Default")}

                    </label>
                    <button
                      type="button"
                      className="shrink-0 flex items-center gap-2 font-medium ms-auto"
                      onClick={() =>
                        router.push(`/dashboard/address/edit?id=${address?.id}`)
                      }
                    >
                      <Image
                        src={edit}
                        alt="edit"
                        className="invert max-sm:w-5 max-sm:h-5"
                        width={24}
                        height={24}
                      />
                      <span className="max-sm:hidden">{t("Edit")}</span>
                    </button>
                    <button
                      type="button"
                      className="shrink-0 flex items-center gap-2 font-medium"
                      onClick={() => handleDelete(String(address?.id))}
                    >
                      <Image
                        src={trash}
                        alt="trash"
                        className="invert max-sm:w-5 max-sm:h-5"
                        width={24}
                        height={24}
                      />
                      <span className="max-sm:hidden">{t("Delete")}</span>
                    </button>
                  </div>
                  <p className="text-[#C4C8C2] dark:text-[#465240] line-clamp-2 mt-2 max-sm:text-sm">
                    {address?.addressLine1}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && address?.length === 0 && <div className="md:mt-28 mt-18"><ProductError text={t("Address Not Found!")} /></div>}
          {isLoading && <Spinner className="mt-20" />}

          {address && address.length > 10 && (
            <Pagination
              totalPages={totalpages}
              currentPage={page}
              onPageChange={handlePageClick}
            />
          )}
        </div>
      </div>
    </>
  );
}
