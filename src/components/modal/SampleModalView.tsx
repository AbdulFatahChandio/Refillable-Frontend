"use client";

import { useModalStore } from '@/src/store/useModalStore';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react';
import Button from '../Button';

function SampleModalView() {
    const [open, setOpen] = useState(false)
    const { closeModal } = useModalStore()

    setTimeout(() => {
        setOpen(true)
    }, 0)

    return (
        <>
            <Dialog
                open={open}
                onClose={() => closeModal()}
                className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-100 ease-in data-[closed]:opacity-0 z-[9999999]"
                transition
            >


                {/* Full-screen container to center the panel */}
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    {/* The actual dialog panel  */}
                    <DialogPanel className="max-w-lg space-y-4 bg-white p-12">
                        <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                        <Description>This will permanently deactivate your account</Description>
                        <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                        <div className="flex gap-4">
                            <Button text='Cancel' onClick={() => closeModal()} />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>

    )
}

export default SampleModalView;