/**
 * Script to add language switcher to all HTML pages
 * Run with Node.js: node add-language-switcher.js
 */

const fs = require('fs');
const path = require('path');

// Function to add language switcher script to HTML file
function addLanguageSwitcher(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if language switcher is already added
        if (content.includes('language-switcher.js')) {
            console.log(`✓ ${filePath} already has language switcher`);
            return false;
        }

        // Pattern to find script insertion point
        const scriptInsertPattern = /<\/body>\s*<\/html>/i;

        if (scriptInsertPattern.test(content)) {
            // Insert language switcher script before closing body tag
            const languageSwitcherScript = `
    <!-- Language Switcher Component -->
    <script src="js/language-switcher.js"></script>

</body>`;

            content = content.replace(/<\/body>/i, languageSwitcherScript);

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Added language switcher to ${filePath}`);
            return true;
        } else {
            console.log(`⚠ Could not find insertion point in ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Function to recursively find all HTML files
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules and other unnecessary directories
            if (!['node_modules', '.git', 'css', 'js', 'images', 'data'].includes(file)) {
                findHTMLFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Main execution
function main() {
    const rootDir = __dirname;
    console.log('Adding language switcher to all HTML files...\n');

    // Find all HTML files
    const htmlFiles = findHTMLFiles(rootDir);

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each HTML file
    htmlFiles.forEach(filePath => {
        const relativePath = path.relative(rootDir, filePath);
        const result = addLanguageSwitcher(filePath);

        if (result === true) {
            addedCount++;
        } else if (result === false && !filePath.includes('language-switcher')) {
            skippedCount++;
        } else {
            errorCount++;
        }
    });

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('LANGUAGE SWITCHER INTEGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total HTML files found: ${htmlFiles.length}`);
    console.log(`✓ Successfully added: ${addedCount}`);
    console.log(`- Already had switcher: ${skippedCount}`);
    console.log(`✗ Errors: ${errorCount}`);
    console.log('='.repeat(50));

    if (addedCount > 0) {
        console.log('\n✅ Language switcher integration completed successfully!');
        console.log('All pages now support switching between Chinese and English versions.');
    }
}

// Run the script
main();