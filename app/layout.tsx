import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'ARAVALLI TWIN — Environmental Intelligence Platform | Southern Rajasthan',
  description: 'AI-powered geospatial digital twin for Southern Rajasthan. See the risk. Simulate the future. Protect the land.',
  keywords: [
    'Aravalli',
    'Udaipur',
    'Rajasthan',
    'Geospatial Digital Twin',
    'CesiumJS',
    'Google 3D Tiles',
    'Watershed Management',
    'Lake Conservation',
    'Agri-Tech',
    'Natural Resource Conservation'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cesium.com/downloads/cesiumjs/releases/1.121/Build/Cesium/Widgets/widgets.css"
        />
      </head>
      <body>
        <Script
          src="https://cesium.com/downloads/cesiumjs/releases/1.121/Build/Cesium/Cesium.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
