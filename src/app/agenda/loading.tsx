export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="w-40 h-6 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
          <div className="w-72 h-10 bg-muted rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="w-96 h-5 bg-muted rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map skeleton */}
          <div className="lg:col-span-3">
            <div className="w-full h-[500px] bg-muted rounded-2xl animate-pulse" />
          </div>

          {/* List skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-9 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-border/50 p-5 animate-pulse">
                <div className="flex gap-2 mb-3">
                  <div className="w-16 h-5 bg-muted rounded-full" />
                  <div className="w-16 h-5 bg-muted rounded-full" />
                </div>
                <div className="w-full h-5 bg-muted rounded mb-2" />
                <div className="w-3/4 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
