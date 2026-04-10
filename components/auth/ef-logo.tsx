import Image from "next/image"

export function EFLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative rounded-2xl bg-[#1B2559] p-3 shadow-lg"
      style={{ width: size * 2.2, height: size * 1.2 }}
    >
      <Image
        src="/EmotionFrame_Logo_w.png"
        alt="EmotionFrame"
        fill
        className="object-contain p-2"
        priority
      />
    </div>
  )
}
