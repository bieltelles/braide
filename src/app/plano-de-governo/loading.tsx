export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-40 h-6 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
          <div className="w-64 h-10 bg-muted rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="w-96 h-5 bg-muted rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Categories skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border/50 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-xl" />
                <div className="flex-1">
                  <div className="w-24 h-5 bg-muted rounded mb-2" />
                  <div className="w-full h-4 bg-muted rounded" />
                </div>
                <div className="w-5 h-5 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
