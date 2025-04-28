import AddSocialProfile from "@/components/addSocialProfileButton";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsPageSkeleton() {
  // Add a blur effect to the background
  return (
    <div className="relative h-[calc(100vh-200px)] overflow-hidden">
      <Dialogue />
      <AnalyticsSkeleton />
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="pointer-events-none grid grid-cols-1 gap-y-2 p-3 opacity-20 blur-[3px] lg:grid-cols-3 lg:gap-2">
      <div className="col-span-2 space-y-2">
        <div className="h-48 rounded-lg border p-4">
          <Skeleton className="mb-2 h-5 w-[200px] animate-none" />
          <Skeleton className="mb-2 h-10 w-full animate-none" />
          <Skeleton className="h-10 w-full animate-none" />
        </div>

        <div className="rounded-lg border p-4">
          <Skeleton className="mb-2 h-5 w-[150px] animate-none" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton className="h-48 w-full animate-none" key={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-1 space-y-2">
        <div className="rounded-lg border p-4">
          <Skeleton className="mb-2 h-[180px] w-full animate-none rounded-lg" />
          <Skeleton className="mb-2 h-5 w-[80%] animate-none" />
          <Skeleton className="h-4 w-[60%] animate-none" />
        </div>

        <div className="h-72 rounded-lg border p-4">
          <Skeleton className="mb-2 h-5 w-[150px] animate-none" />
          <Skeleton className="h-10 w-full animate-none" />
          <Skeleton className="h-10 w-full animate-none" />
          <Skeleton className="mb-2 h-5 w-[150px] animate-none" />
          <Skeleton className="h-10 w-full animate-none" />
          <Skeleton className="h-10 w-full animate-none" />
        </div>
      </div>
    </div>
  );
}

function Dialogue() {
  return (
    <div className="absolute left-0 top-0 z-20 flex h-[calc(100vh-300px)] w-full items-center justify-center">
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-xl font-medium">Connect a profile</h2>
        <p className="mb-6 text-sm text-[#878787]">
          Unlock powerful social media management features. Easily schedule
          posts, analyze engagement metrics, and manage multiple platforms.
        </p>

        <AddSocialProfile />
      </div>
    </div>
  );
}
