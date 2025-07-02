export function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Navigation Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex space-x-2">
          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>

      {/* Main Card Skeleton */}
      <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-6 mb-8">
        {/* Header */}
        <div className="mb-6">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Types */}
            <div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full mt-8">
        {/* Tabs List */}
        <div className="flex space-x-2 mb-6 w-full">
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>

        {/* Stats Tab Content */}
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg p-6 mb-6">
          {/* Stats Header */}
          <div className="flex items-center mb-6">
            <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
