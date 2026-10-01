import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-bg dark:bg-bg-dark flex flex-col items-center justify-center z-50">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <h2 className="font-display text-xl font-semibold">Valetventure</h2>
    </div>
  );
}
