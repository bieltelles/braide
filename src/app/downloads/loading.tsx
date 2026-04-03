export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-40 h-6 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
          <div className="w-64 h-10 bg-muted rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="w-96 h-5 bg-muted rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Filters skeleton */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-20 h-9 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border/50 overflow-hidden animate-pulse">
              <div className="h-32 bg-muted" />
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  <div className="w-12 h-5 bg-muted rounded" />
                  <div className="w-14 h-5 bg-muted rounded" />
                </div>
                <div className="w-full h-5 bg-muted rounded mb-1" />
                <div className="w-3/4 h-4 bg-muted rounded mb-4" />
                <div className="flex justify-between items-center">
                  <div className="w-24 h-4 bg-muted rounded" />
                  <div className="w-20 h-9 bg-muted rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
