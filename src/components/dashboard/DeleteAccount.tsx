"use client";

import React from "react";
import DashboardSecHd from "./DashboardSecHd";
import Button from "../Button";
import { useDeleteAccount } from "@/src/hooks/useDeleteAccount";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useUserStore } from "@/src/store/useUserStore";
import { useTranslation } from "react-i18next";
import useClickOutside from "@/src/hooks/useClickOutside";
import Image from "next/image";

export default function DeleteAccount() {
  const { t } = useTranslation();
  const router = useAppRouter();

  const { clearUser } = useUserStore();

  const { mutate, isPending } = useDeleteAccount();
  const { modal, setModal, modalRef } = useClickOutside()

  const deleteAccount = () => {
    mutate();
    clearUser();
    router.push("/");
  };

  return (
    <>
      <DashboardSecHd text={t("Delete Account")} />
      <div className="flex gap-2 flex-wrap mt-10">
        <Button
          text={t("Delete Account")}
          loading={isPending}
          onClick={() => setModal(true)}
          type="button"
          className="!capitalize !bg-[#EA4335] border-[#EA4335]! max-sm:grow !text-secondary dark:!text-secondary"
        />
        {/* <Button text={t('Deactivate account')} type='submit' className='!capitalize !flex !text-base max-sm:grow !font-medium' /> */}
      </div>

      {modal &&
        <div ref={modalRef} className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-100 ease-in data-[closed]:opacity-0 z-[99999999999]">
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className='bg-secondary rounded-xl w-[90%] text-black md:px-10 px-5 md:py-20 py-10 min-h-[40vh] max-w-[500px] flex flex-col justify-center text-center items-center'>
              <Image src={"/assets/images/warning.png"} alt='coffee' className="brightness-0" width={70} height={70} />
              <h3 className='! md:text-2xl mt-5'>{t("Are you sure you want to Delete your account?")}</h3>

              <div className="flex gap-2 mt-10">
                <Button
                  text={t("Delete Account")}
                  loading={isPending}
                  onClick={deleteAccount}
                  type="button" className='bg-[#EA4335]! !text-secondary border-[#EA4335]!' />
                <Button text={t('Cancel')} onClick={() => setModal(false)} className="md:px-9 " />
              </div>
            </div>
          </div>
        </div>
      }

    </>
  );
}
