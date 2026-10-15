import React from 'react'

export default function Subtitle({ text, className }: { text: string, className?: string }) {
    return (
        <span className={`subtitle ${className}`}>{text}</span>
    )
}