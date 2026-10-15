"use client";

import React, { ReactNode, useState } from 'react'
import Header from '../components/Header';
import DashboardSidebar from '../components/DashboardSidebar';

interface AppProps {
    page: ReactNode;
}

const ProfileLayout = ({ page }: AppProps) => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <Header onClick={() => setOpen(true)} />
            <div className="flex mt-[126px] max-sm:mt-[65px] min-h-[calc(100vh-100px)]">
                <DashboardSidebar open={open} onClose={() => setOpen(false)} />
                <div className='grow 2xl:ms-[350px] md:ms-[300px] pt-22 pb-8 lg:pb-10 xl:ps-16 md:ps-10 px-3 lg:pe-10'>
                    {page}
                </div>
            </div>
        </>
    )
}

export default ProfileLayout
