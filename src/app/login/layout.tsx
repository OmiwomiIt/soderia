import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}