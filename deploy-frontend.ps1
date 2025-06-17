# Build the application
Write-Host "Building the application..." -ForegroundColor Green
npm run build

# Create a zip file for deployment
Write-Host "`nCreating deployment package..." -ForegroundColor Green
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$zipFileName = "frooxi-frontend-$timestamp.zip"

# Navigate to the dist directory and create a zip file
Set-Location -Path "dist"
Compress-Archive -Path * -DestinationPath "..\$zipFileName" -Force
Set-Location -Path ".."

# Display instructions
Write-Host "`nDeployment package created: $zipFileName" -ForegroundColor Green
Write-Host "`nTo deploy to Namecheap shared hosting:"
Write-Host "1. Log in to your Namecheap cPanel"
Write-Host "2. Go to File Manager"
Write-Host "3. Navigate to public_html (or your subdomain directory)"
Write-Host "4. Upload and extract $zipFileName"
Write-Host "5. Create or update .htaccess file with the following content:`n"
Write-Host "<IfModule mod_rewrite.c>`n  RewriteEngine On`n  RewriteBase /`n  RewriteRule ^index\.html$ - [L]`n  RewriteCond %{REQUEST_FILENAME} !-f`n  RewriteCond %{REQUEST_FILENAME} !-d`n  RewriteRule . /index.html [L]`n</IfModule>" -ForegroundColor Cyan
Write-Host "`n6. Set proper permissions (755 for directories, 644 for files)" -ForegroundColor Yellow

# Open the directory containing the zip file
Invoke-Item -Path $PWD.Path
