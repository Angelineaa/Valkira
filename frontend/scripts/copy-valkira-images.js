// Node script to copy Valkira images into frontend/public/img
// Run from root or frontend dir: node scripts/copy-valkira-images.js

const fs = require('fs');
const path = require('path');

// Fix paths for this workspace structure
const source = `c:\\Users\\angie\\OneDrive\\Documents\\tareas\\Programacion\\Valikiraprueba\\Valikira\\img`;
const dest = `c:\\Users\\angie\\OneDrive\\Documents\\tareas\\Programacion\\Proyecto Comercio\\Proyecto Comercio\\frontend\\public\\img`;

console.log('Copying from:', source);
console.log('Copying to:', dest);

if (!fs.existsSync(source)) {
  console.error('❌ Source folder not found:', source);
  process.exit(1);
}

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
  console.log('✓ Created dest folder:', dest);
}

try {
  const files = fs.readdirSync(source);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
  
  if (imageFiles.length === 0) {
    console.warn('⚠️  No image files found in source');
    process.exit(0);
  }

  imageFiles.forEach(f => {
    const src = path.join(source, f);
    const dst = path.join(dest, f);
    fs.copyFileSync(src, dst);
    console.log(`✓ Copied: ${f}`);
  });

  console.log(`\n✅ Done! Copied ${imageFiles.length} images to ${dest}`);
} catch (err) {
  console.error('❌ Error during copy:', err.message);
  process.exit(1);
}
