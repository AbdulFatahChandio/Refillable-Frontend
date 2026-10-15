"use client";

import React, { ReactNode } from 'react'
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import AboutSec from '../components/AboutSec';
import { useAppRouter } from "@/src/hooks/useAppRouter";
import { useMediaQuery } from 'react-responsive';

interface AppProps {
    page: ReactNode;
}

const AppLayout = ({ page }: AppProps) => {

    const router = useAppRouter();
    const isMobile = useMediaQuery({ query: '(max-width: 992px)' });

    const hiddenHeader = router.pathname === '/privacy-policy' || router.pathname === '/terms-and-conditions' || router.pathname === '/faqs' || router.pathname === '/shipping-policy'

    return (
        <>
            {hiddenHeader && isMobile ? null : <Header />}
            {/* <Navigation /> */}
            {page}

            {hiddenHeader && isMobile ? null :
                <>
                    {/* <Footer /> */}
                </>}
        </>
    )
}

export default AppLayout
