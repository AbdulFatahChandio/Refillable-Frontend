"use client";

import { useModalStore } from "@/src/store/useModalStore";
import dynamic from "next/dynamic";
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useEffect } from "react";


const SampleModal = dynamic(() => import('@/src/components/modal/SampleModalView'));
const AddToCartModal = dynamic(() => import('@/src/components/modal/AddToCartModal'));


const ManagedModal = () => {
    const { view, closeModal } = useModalStore();
    const router = useAppRouter();

    useEffect(() => {
        closeModal();
    }, [router.asPath]);

    return (
        <>
            {view === "SAMPLE_MODAL" && <SampleModal />}
            {view === "ADD_TO_CART_MODAL" && <AddToCartModal />}

        </>
    );
};

export default ManagedModal;
