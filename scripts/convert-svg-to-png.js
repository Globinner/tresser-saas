import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#1a1a1f"/>
  <rect x="5" y="5" width="90" height="90" rx="16" fill="none" stroke="#d4a853" stroke-width="1.5"/>
  <g transform="translate(50,50) rotate(-45)">
    <circle cx="-10" cy="-10" r="5" fill="none" stroke="#d4a853" stroke-width="2"/>
    <circle cx="10" cy="10" r="5" fill="none" stroke="#d4a853" stroke-width="2"/>
    <line x1="-5" y1="-5" x2="5" y2="5" stroke="#d4a853" stroke-width="2"/>
    <line x1="-10" y1="0" x2="-20" y2="15" stroke="#d4a853" stroke-width="2" stroke-linecap="round"/>
    <line x1="10" y1="0" x2="20" y2="-15" stroke="#d4a853" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

const publicDir = '/vercel/share/v0-project/public';

const sizes = [
  { name: 'icon-512x512.png', size: 512 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
];

async function generateIcons() {
  const svgBuffer = Buffer.from(svgContent);
  
  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name}`);
  }
  console.log('All icons generated!');
}

generateIcons().catch(console.error);
