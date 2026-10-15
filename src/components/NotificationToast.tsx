"use client";

import { useAppRouter } from "@/src/hooks/useAppRouter";
import { IoIosNotifications } from "react-icons/io";

interface NotificationToastProps {
    title: string;
    body: string;
    onClick?: any;
}

const NotificationToast = ({ title, body, onClick }: NotificationToastProps) => {
    const router = useAppRouter()

    return (
        <div
            
            className=""
            onClick={onClick}
        >   
            <h4 className="text-base text-secondary flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-secondary rounded-full shrink-0">
                    <IoIosNotifications color="#0284C7" fontSize={20} />
                </div>
                <div>
                    <span className="line-clamp-1">{title}</span>
                    <p className="text-sm !text-[#ffffffd7]  line-clamp-1">{body}</p>
                </div>
            </h4>

            {/* <p className="text-[11px] text-gray mt-1 line-clamp-1">{"Today" + " " + date}</p> */}
        </div>
    );
};

export default NotificationToast;