import { Skeleton } from "@/components/ui/skeleton";

export default function CartPageLoading() {
  return (
    <main className="container mx-auto max-w-7xl py-8 md:py-12">
      <Skeleton className="h-10 w-64 mb-8" /> {/* Page Title */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
                <div className="col-span-1 md:col-span-2 flex justify-center">
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="col-span-1 md:col-span-2 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </div>
              </div>
              <Skeleton className="h-px w-full mt-6" />
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-muted/30 rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3 text-sm">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      </div>
    </main>
  );
}
