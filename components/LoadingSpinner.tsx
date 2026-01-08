export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-32 h-32 bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="relative w-16 h-16 mt-2">
          <div className="absolute inset-0 border-4 border-black/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-black/60 text-xs font-medium">Loading...</p>
      </div>
    </div>
  );
}
