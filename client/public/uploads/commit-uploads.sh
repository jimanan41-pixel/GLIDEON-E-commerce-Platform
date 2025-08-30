#!/bin/bash
# Script to commit uploaded files to Git repository
# Run this after uploading files through admin panel

echo "🔄 Checking for new uploaded files..."

# Add all uploaded files to Git
git add client/public/uploads/

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No new files to commit"
else
    echo "📁 Committing new uploaded files..."
    git commit -m "Add uploaded images - $(date)"
    echo "✅ Files committed to repository"
    echo "🚀 Push to GitHub and redeploy on Render to make files persistent"
fi