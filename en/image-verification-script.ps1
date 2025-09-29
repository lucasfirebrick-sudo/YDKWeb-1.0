# Image Verification Script for All 39 Product Pages
# Final comprehensive verification of image functionality

$productDir = "D:\ai\新建文件夹\新建文件夹\7788-en\products"
$imageDir = "D:\ai\新建文件夹\新建文件夹\7788-en\images\products"
$placeholderDir = "D:\ai\新建文件夹\新建文件夹\7788-en\images\products\placeholder"

# Initialize counters
$totalPages = 0
$pagesWithIssues = 0
$totalImages = 0
$missingImages = 0
$workingImages = 0

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $productDir -Filter "*.html"
$results = @()

Write-Host "=== COMPREHENSIVE IMAGE VERIFICATION REPORT ===" -ForegroundColor Green
Write-Host "Checking $($htmlFiles.Count) product pages..." -ForegroundColor Yellow
Write-Host ""

foreach ($htmlFile in $htmlFiles) {
    $totalPages++
    $pageName = $htmlFile.BaseName
    $pageIssues = @()
    $pageImageCount = 0
    $pageMissingCount = 0

    Write-Host "Checking: $pageName" -ForegroundColor Cyan

    # Read the HTML content
    $content = Get-Content $htmlFile.FullName -Raw

    # Extract all image src attributes
    $imageMatches = [regex]::Matches($content, 'src=["'']([^"'']*\.(png|jpg|jpeg|gif))[^"'']*["'']')

    foreach ($match in $imageMatches) {
        $imagePath = $match.Groups[1].Value
        $totalImages++
        $pageImageCount++

        # Convert relative paths to absolute
        if ($imagePath.StartsWith("../images/")) {
            $absolutePath = Join-Path "D:\ai\新建文件夹\新建文件夹\7788-en" $imagePath.Substring(3)
        } else {
            $absolutePath = $imagePath
        }

        # Check if image exists
        if (Test-Path $absolutePath) {
            $workingImages++
            Write-Host "  ✓ $imagePath" -ForegroundColor Green
        } else {
            $missingImages++
            $pageMissingCount++
            $pageIssues += "Missing: $imagePath"
            Write-Host "  ✗ $imagePath (MISSING)" -ForegroundColor Red
        }
    }

    # Check for onerror fallbacks
    $fallbackMatches = [regex]::Matches($content, 'onerror=["'']this\.src=[''"]([^''"]*)[''"][^"'']*["'']')
    $hasFallbacks = $fallbackMatches.Count -gt 0

    # Create page result
    $pageResult = [PSCustomObject]@{
        PageName = $pageName
        TotalImages = $pageImageCount
        MissingImages = $pageMissingCount
        WorkingImages = $pageImageCount - $pageMissingCount
        HasFallbacks = $hasFallbacks
        FallbackCount = $fallbackMatches.Count
        Issues = $pageIssues
        Status = if ($pageMissingCount -eq 0) { "✅ PERFECT" } elseif ($pageMissingCount -le 2) { "⚠️ MINOR ISSUES" } else { "❌ MAJOR ISSUES" }
    }

    $results += $pageResult

    if ($pageMissingCount -gt 0) {
        $pagesWithIssues++
    }

    Write-Host "  Images: $pageImageCount total, $($pageImageCount - $pageMissingCount) working, $pageMissingCount missing"
    Write-Host "  Fallbacks: $($fallbackMatches.Count) onerror handlers found"
    Write-Host "  Status: $($pageResult.Status)"
    Write-Host ""
}

# Generate summary report
Write-Host "=== VERIFICATION SUMMARY ===" -ForegroundColor Green
Write-Host "Total Pages Checked: $totalPages" -ForegroundColor White
Write-Host "Pages with 100% Working Images: $($totalPages - $pagesWithIssues)" -ForegroundColor Green
Write-Host "Pages with Issues: $pagesWithIssues" -ForegroundColor $(if ($pagesWithIssues -eq 0) { "Green" } else { "Red" })
Write-Host "Total Images Found: $totalImages" -ForegroundColor White
Write-Host "Working Images: $workingImages" -ForegroundColor Green
Write-Host "Missing Images: $missingImages" -ForegroundColor $(if ($missingImages -eq 0) { "Green" } else { "Red" })
Write-Host "Success Rate: $([math]::Round(($workingImages / $totalImages) * 100, 2))%" -ForegroundColor $(if ($missingImages -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

# Show pages with issues
if ($pagesWithIssues -gt 0) {
    Write-Host "=== PAGES WITH ISSUES ===" -ForegroundColor Red
    $results | Where-Object { $_.MissingImages -gt 0 } | ForEach-Object {
        Write-Host "$($_.PageName): $($_.MissingImages) missing images" -ForegroundColor Red
        $_.Issues | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    }
    Write-Host ""
}

# Show perfect pages
$perfectPages = $results | Where-Object { $_.MissingImages -eq 0 }
Write-Host "=== PERFECT PAGES (100% Working Images) ===" -ForegroundColor Green
Write-Host "Count: $($perfectPages.Count)/$totalPages" -ForegroundColor Green
$perfectPages | ForEach-Object {
    Write-Host "✅ $($_.PageName) ($($_.TotalImages) images, $($_.FallbackCount) fallbacks)" -ForegroundColor Green
}

# Final assessment
Write-Host ""
Write-Host "=== FINAL ASSESSMENT ===" -ForegroundColor Magenta
if ($missingImages -eq 0) {
    Write-Host "🎉 PROJECT STATUS: 100% COMPLETE!" -ForegroundColor Green
    Write-Host "All 39 pages have fully working image functionality." -ForegroundColor Green
} elseif ($missingImages -le 5) {
    Write-Host "⚠️ PROJECT STATUS: NEARLY COMPLETE" -ForegroundColor Yellow
    Write-Host "Minor issues remaining: $missingImages missing images across $pagesWithIssues pages." -ForegroundColor Yellow
} else {
    Write-Host "❌ PROJECT STATUS: INCOMPLETE" -ForegroundColor Red
    Write-Host "Significant issues: $missingImages missing images across $pagesWithIssues pages." -ForegroundColor Red
}