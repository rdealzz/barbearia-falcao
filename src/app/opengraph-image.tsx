import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config/site';

export const runtime = 'nodejs';
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: 'linear-gradient(135deg, #0b0b0b 0%, #141414 55%, #3a0d10 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: '#c62128',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 30, fontWeight: 600 }}>{siteConfig.name}</span>
            <span style={{ fontSize: 18, letterSpacing: 6, color: '#8a8a8a' }}>
              CUTS &amp; SHAVE
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
            {siteConfig.slogan}
          </span>
          <span style={{ fontSize: 28, color: '#a3a3a3' }}>
            {siteConfig.address.district} · {siteConfig.address.city}/{siteConfig.address.state} ·
            Agende online
          </span>
        </div>
      </div>
    ),
    size,
  );
}
