import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/frooxi
JWT_SECRET=frooxi_web_glow_secret_key_2024
FRONTEND_URL=http://localhost:3000
NODE_ENV=development`;

  fs.writeFileSync(envPath, envContent);
  console.log('.env file created successfully!');
} else {
  console.log('.env file already exists.');
}

// Create uploads directory if it doesn't exist
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log('uploads directory created successfully!');
} else {
  console.log('uploads directory already exists.');
}

console.log('\nSetup completed! You can now start the server with:');
console.log('npm start'); 