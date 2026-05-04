import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-36 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <Skeleton className="h-3 w-16 mb-3" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 rounded-md" />)}
            </div>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <Skeleton className="h-3 w-28 mb-3" />
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-md mb-2" />)}
          </div>
        </div>
        <div className="lg:col-span-3 rounded-lg border border-gray-100 bg-white overflow-hidden">
          <Skeleton className="h-32 w-full" />
          <div className="p-5 space-y-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-md" />)}
          </div>
        </div>
      </div>
    </div>
  )
}
