import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="grid gap-6">
      <div>
        <Skeleton className="h-10 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="h-10 w-full rounded-md" />

      <Skeleton className="h-[400px] w-full rounded-md" />
    </div>
  )
}

