import { ImageResponse } from 'next/og';

export const alt = 'Tienda';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #000, #111)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 128,
          fontWeight: 700,
        }}
      >
        Tienda
      </div>
    ),
    { ...size },
  );
}
