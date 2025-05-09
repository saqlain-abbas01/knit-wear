import React from "react";

const Loading = () => {
  return (
    <main className="container mx-auto max-w-7xl py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product image skeleton */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg bg-muted animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Product details skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
            <div className="h-6 w-1/4 bg-muted rounded animate-pulse mt-2" />
          </div>

          <div className="space-y-2">
            <div className="h-5 w-1/4 bg-muted rounded animate-pulse" />
            <div className="h-24 w-full bg-muted rounded animate-pulse" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="h-5 w-1/6 bg-muted rounded animate-pulse mb-3" />
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-10 bg-muted rounded-md animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="h-5 w-1/5 bg-muted rounded animate-pulse mb-3" />
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
                <div className="h-6 w-8 bg-muted rounded animate-pulse" />
                <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="h-12 flex-1 bg-muted rounded-md animate-pulse" />
            <div className="h-12 flex-1 bg-muted rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Loading;
