const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#1a1a1f"/>
  <rect x="16" y="16" width="480" height="480" rx="84" fill="none" stroke="#d4a853" stroke-width="8" opacity="0.3"/>
  <g transform="translate(256,256) rotate(-45) translate(-256,-256)">
    <circle cx="180" cy="180" r="50" fill="none" stroke="#d4a853" stroke-width="28" stroke-linecap="round"/>
    <circle cx="332" cy="332" r="50" fill="none" stroke="#d4a853" stroke-width="28" stroke-linecap="round"/>
    <line x1="220" y1="220" x2="360" y2="152" stroke="#d4a853" stroke-width="28" stroke-linecap="round"/>
    <line x1="292" y1="292" x2="152" y2="360" stroke="#d4a853" stroke-width="28" stroke-linecap="round"/>
  </g>
</svg>`;

const publicDir = '/vercel/share/v0-project/public';

async function generateFavicons() {
  const svgBuffer = Buffer.from(svgContent);
  
  // Generate different sizes
  const sizes = [16, 32, 48, 64, 128, 180, 192, 512];
  
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
    console.log(`Created favicon-${size}x${size}.png`);
  }
  
  // Create apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');
  
  // Create favicon.ico (using 32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Created favicon.png');
  
  // Save SVG as well
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
  console.log('Created favicon.svg');
  
  console.log('All favicons generated!');
}

generateFavicons().catch(console.error);
