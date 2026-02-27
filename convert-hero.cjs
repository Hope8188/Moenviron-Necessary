const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, 'src', 'assets', 'hero-mountain.png');
const outputWebp = path.join(__dirname, 'src', 'assets', 'hero-mountain.webp');
const outputAvif = path.join(__dirname, 'src', 'assets', 'hero-mountain.avif');

async function convert() {
    console.log('Starting image conversion...');

    // WebP
    await sharp(input)
        .resize(1536, 1024, { fit: 'cover' })
        .webp({ quality: 82, effort: 6 })
        .toFile(outputWebp);
    console.log('Converted to WebP');

    // AVIF
    await sharp(input)
        .resize(1536, 1024, { fit: 'cover' })
        .avif({ quality: 65, effort: 6 })
        .toFile(outputAvif);
    console.log('Converted to AVIF');

    console.log('Conversion complete!');
}

convert().catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
});
