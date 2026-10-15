"use client";

import React from 'react'
import ProfileUpdate from './ProfileUpdate'
import PasswordUpdate from './PasswordUpdate'
import DeleteAccount from './DeleteAccount'
import { useUserStore } from '@/src/store/useUserStore';

export default function ProfileManagement() {

    const { user } = useUserStore();
    
    return (
        <section>
            <div className="grid grid-cols-12 gap-4">
                <div className="2xl:col-span-7 lg:col-span-10 md:col-span-10 col-span-12">
                    <ProfileUpdate />
                    {!user?.isSocial && <PasswordUpdate />}
                    <DeleteAccount />
                </div>
            </div>
        </section>
    )
}
