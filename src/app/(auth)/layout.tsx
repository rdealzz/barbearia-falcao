import { MediaFrame } from '@/components/shared/media-frame';
import { media } from '@/lib/data/media';
import { siteConfig } from '@/lib/config/site';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <MediaFrame
          src={media.heroPortrait}
          alt="Barbearia Falcão"
          className="size-full rounded-none"
          imageClassName="opacity-60"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-[#121212]/10" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-md font-display text-3xl leading-tight text-[#F2E4C9]">
            {siteConfig.slogan}
          </p>
          <p className="mt-3 max-w-md text-sm text-[#F2E4C9]/75">{siteConfig.sloganSupport}</p>
          <p className="mt-2 text-sm text-[#F2E4C9]/50">
            {siteConfig.address.district} · {siteConfig.address.city}/{siteConfig.address.state}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 sm:px-12">{children}</div>
    </div>
  );
}
