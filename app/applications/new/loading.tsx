import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="grid gap-6">
      <div>
        <Skeleton className="h-10 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <Skeleton className="h-[600px] w-full max-w-2xl mx-auto rounded-md" />
    </div>
  )
}

