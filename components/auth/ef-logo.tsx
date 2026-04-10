/* eslint-disable @next/next/no-img-element */
export function EFLogo({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/logo-dark.svg"
      alt="EmotionFrame"
      width={size * 4}
      height={size}
      style={{ height: size, width: "auto" }}
      fetchPriority="high"
    />
  )
}
