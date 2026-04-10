/* eslint-disable @next/next/no-img-element */
import logoPng from "@/public/EmotionFrame_LOGO-b.png"

export function EFLogo({ size = 40 }: { size?: number }) {
  return (
    <img
      src={logoPng.src}
      alt="EmotionFrame"
      width={logoPng.width}
      height={logoPng.height}
      style={{ height: size, width: "auto" }}
      fetchPriority="high"
    />
  )
}
