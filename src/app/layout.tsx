import type { Metadata } from 'next'
import './globals.css'
import '../lib/firebase'
import ClientProtection from './ClientProtection'
import { siteOrigin, siteUrl, withBasePath } from '../lib/site'

const shareImage = withBasePath('/og-card.png')

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: 'Mahmoud Tolba | Senior Flutter Developer / Senior Mobile Developer',
  description: 'Building high-performance, scalable mobile applications with Flutter. Senior Mobile Developer with 5+ years of production experience.',
  applicationName: 'Mahmoud Tolba Portfolio',
  authors: [{ name: 'Mahmoud Tolba' }],
  alternates: {
    canonical: siteUrl,
  },
  keywords: [
    'Mahmoud Tolba',
    'Senior Flutter Developer',
    'Senior Mobile Developer',
    'Flutter Expert',
    'Android Developer',
    'iOS Developer',
    'Mobile Application Architecture'
  ],
  openGraph: {
    title: 'Mahmoud Tolba | Senior Flutter Developer / Senior Mobile Developer',
    description: 'Building high-performance, scalable mobile applications with Flutter. 5+ years of experience delivering production-grade apps.',
    url: siteUrl,
    siteName: 'Mahmoud Tolba Portfolio',
    type: 'website',
    images: [
      {
        url: shareImage,
        width: 1200,
        height: 630,
        alt: 'Mahmoud Tolba - Senior Flutter Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahmoud Tolba | Senior Flutter Developer / Senior Mobile Developer',
    description: 'Building high-performance, scalable mobile applications with Flutter.',
    images: [shareImage],
  },
  icons: {
    icon: [
      { url: withBasePath('/icon.svg'), type: 'image/svg+xml' },
    ],
    shortcut: withBasePath('/icon.svg'),
    apple: withBasePath('/icon.svg'),
    other: [
      { rel: 'mask-icon', url: withBasePath('/icon.svg'), color: '#193450' },
    ],
  },
  manifest: withBasePath('/site.webmanifest'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Content Security Policy — defense-in-depth against XSS */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://*.googleapis.com https://*.googleusercontent.com https://firebasestorage.googleapis.com https://www.gstatic.com https://images.unsplash.com https://skillicons.dev https://is1-ssl.mzstatic.com https://play-lh.googleusercontent.com; media-src 'self' https://firebasestorage.googleapis.com https://*.firebasestorage.app; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net wss://*.firebaseio.com https://images.unsplash.com https://skillicons.dev; frame-src https://accounts.google.com https://*.firebaseapp.com; base-uri 'self';"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Permanent+Marker&family=Caveat:wght@400;500;600;700&family=Kalam:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <ClientProtection />
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
