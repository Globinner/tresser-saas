import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Lucide scissors SVG with Tresser branding
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#1a1a1f"/>
  <rect x="16" y="16" width="480" height="480" rx="64" fill="none" stroke="#d4a853" stroke-width="4"/>
  <g transform="translate(256, 256) rotate(-45) translate(-128, -128)" stroke="#d4a853" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <circle cx="64" cy="64" r="40"/>
    <circle cx="192" cy="192" r="40"/>
    <line x1="96" y1="96" x2="160" y2="160"/>
    <line x1="160" y1="96" x2="96" y2="160"/>
  </g>
</svg>`;

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

const publicDir = '/vercel/share/v0-project/public';

async function generateFavicons() {
  const svgBuffer = Buffer.from(svgContent);
  
  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name}`);
  }
  
  // Also save the SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
  console.log('Generated icon.svg');
}

generateFavicons().catch(console.error);
