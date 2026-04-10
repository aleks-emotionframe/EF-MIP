import Image from "next/image"

export function EFLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative rounded-2xl bg-[#0F172A] p-4 shadow-lg"
      style={{ width: size * 2.5, height: size * 1.3 }}
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
