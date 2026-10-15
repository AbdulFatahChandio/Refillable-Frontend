import React from 'react'

export default function DashboardSecHd({ text, className }: { text: string, className?: string }) {
    return (
        <h2 className={`dashboardSecHd ${className}`}>{text}</h2>
    )
}