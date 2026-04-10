export function EFLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl bg-[#0F172A] shadow-lg"
      style={{ padding: size * 0.3 }}
    >
      <img
        src="/EmotionFrame_Logo_w.png"
        alt="EmotionFrame"
        style={{ height: size * 0.7, width: "auto" }}
      />
    </div>
  )
}
