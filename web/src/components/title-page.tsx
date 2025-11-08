import type React from "react"

interface TitlePageProps{
  children: React.ReactNode,
  className?: string,
}

export function TitlePage({ children, className }:TitlePageProps){
  return (
    <span
      className={`
        text-2xl
        font-bold
        ${className ?? ''}
      `}
    >
      {children}
    </span>
  )
}
