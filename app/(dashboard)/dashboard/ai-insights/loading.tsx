import { Skeleton } from "@/components/ui/skeleton"

export default function AIInsightsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-36 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-9 w-96 rounded-xl" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 flex gap-4">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <Skeleton className="h-1.5 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
