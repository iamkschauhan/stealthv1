import type { ReactNode } from 'react'

/** Feed / app chrome wordmark */
export function BrandMark({
  className = 'text-[22px] font-extrabold tracking-tight',
}: {
  className?: string
}) {
  return (
    <span className={className}>
      <span className="text-ink">Stealth</span>
      <span className="text-brand">App</span>
    </span>
  )
}

export function BrandTitle({
  as: Tag = 'h1',
  className = 'text-[26px] md:text-[28px] font-extrabold tracking-tight leading-none',
}: {
  as?: 'h1' | 'div' | 'span'
  className?: string
}) {
  return (
    <Tag className={className}>
      <span className="text-ink">Stealth</span>
      <span className="text-brand">App</span>
    </Tag>
  )
}

export function BrandInline(): ReactNode {
  return (
    <>
      <span className="text-ink">Stealth</span>
      <span className="text-brand">App</span>
    </>
  )
}
