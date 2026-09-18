import { Logo } from '@/components/shared/logo';

export default function Loading() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="animate-pulse">
        <Logo showWordmark={false} />
      </div>
    </div>
  );
}
