import { create } from "zustand";

export type ModalView =
    | "SAMPLE_MODAL"
    | "ADD_TO_CART_MODAL"
    | "";

interface ModalState {
    view: ModalView;
    data?: any;
    isOpen?: any;
    openModal: (view: ModalView, data?: any) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    view: "",
    data: null,
    isOpen: false,

    openModal: (view, data = null) =>
        set({
            view,
            data,
            isOpen: true,
        }),

    closeModal: () =>
        set({
            isOpen: false,
            view: "",
            data: null,
        }),
}));
