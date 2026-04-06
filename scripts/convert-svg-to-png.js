import sharp from 'sharp';
import path from 'path';

const SVG_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tresserlogo-oXjiHRXm3b6u5yNlVyxJiJ30jezifY.svg';
const publicDir = '/vercel/share/v0-project/public';

const sizes = [
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateIcons() {
  // Fetch the actual SVG from blob URL
  const response = await fetch(SVG_URL);
  const svgBuffer = Buffer.from(await response.arrayBuffer());
  
  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));
    console.log(`Generated ${name}`);
  }
  console.log('All icons generated from YOUR SVG!');
}

generateIcons().catch(console.error);
