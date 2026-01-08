export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-black/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-black/60 text-sm font-medium">Loading 3D model...</p>
      </div>
    </div>
  );
}
