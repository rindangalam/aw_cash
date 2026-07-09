import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const svgPath = resolve('public/favicon.svg');
const svgBuffer = readFileSync(svgPath);

async function generate() {
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(resolve('public/icons/icon-192.png'));

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(resolve('public/icons/icon-512.png'));

  console.log('Generated icon-192.png and icon-512.png');
}

generate().catch(console.error);
