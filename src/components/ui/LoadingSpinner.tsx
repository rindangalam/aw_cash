export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-[3px] border-border dark:border-border-dark border-t-primary rounded-full animate-spin" />
    </div>
  );
}
