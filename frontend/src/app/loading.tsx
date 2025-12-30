// app/your-page/loading.tsx

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full p-6">
      <div className="animate-pulse space-y-4 w-full max-w-md">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}
