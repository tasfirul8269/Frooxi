#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Create a zip file for deployment
echo "Creating deployment package..."
cd dist
zip -r ../frooxi-frontend.zip .

# Instructions for deployment
echo "\n\nDeployment package created: frooxi-frontend.zip"
echo "\nTo deploy to Namecheap shared hosting:"
echo "1. Log in to your Namecheap cPanel"
echo "2. Go to File Manager"
echo "3. Navigate to public_html (or your subdomain directory)"
echo "4. Upload and extract frooxi-frontend.zip"
echo "5. Create or update .htaccess file with the following content:"
echo ""
echo "   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>"
echo ""
echo "6. Set proper permissions (755 for directories, 644 for files)"
