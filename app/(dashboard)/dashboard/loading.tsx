import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded border border-gray-100 bg-white p-5">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-20 mb-5" />
          <Skeleton className="h-[260px] w-full rounded" />
        </div>
        <div className="rounded border border-gray-100 bg-white p-5">
          <Skeleton className="h-5 w-24 mb-4" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-2 w-2 rounded-full mt-2 shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1.5" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
