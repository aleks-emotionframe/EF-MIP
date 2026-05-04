import { Skeleton } from "@/components/ui/skeleton"

export default function ScenariosLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-44 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded border border-gray-100 bg-white p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded" />
          ))}
          <Skeleton className="h-12 w-full rounded" />
        </div>
        <div className="lg:col-span-3 rounded border border-gray-100 bg-white p-6">
          <Skeleton className="h-5 w-24 mb-5" />
          <Skeleton className="h-[320px] w-full rounded" />
        </div>
      </div>
    </div>
  )
}
