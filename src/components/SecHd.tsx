import React from 'react'

export default function SecHd({ text, className }: { text: string, className?: string }) {
    return (
        <h2 className={`secHd ${className}`}>{text}</h2>
    )
}