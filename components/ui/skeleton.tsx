import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-gradient-to-r from-gray-100 via-gray-200/70 to-gray-100 bg-[length:200%_100%]",
        className
      )}
      style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
      {...props}
    />
  )
}
