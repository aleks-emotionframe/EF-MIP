/* eslint-disable @next/next/no-img-element */
import logoDark from "@/public/logo-dark.svg"

export function EFLogo({ size = 40 }: { size?: number }) {
  return (
    <img
      src={logoDark.src}
      alt="EmotionFrame"
      width={logoDark.width}
      height={logoDark.height}
      style={{ height: size, width: "auto" }}
      fetchPriority="high"
    />
  )
}
