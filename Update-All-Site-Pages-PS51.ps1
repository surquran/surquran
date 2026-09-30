# Update-All-Site-Pages-PS51.ps1
# Windows PowerShell 5.1 compatible
# Adds Google Analytics GA4 + legal footer links to every HTML file recursively.
# Run from the ROOT folder of the website project.

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path ".").Path.TrimEnd('\','/')
$MeasurementId = "G-44B0E6HXV6"

$GoogleTag = @"
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=$MeasurementId"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '$MeasurementId');
</script>
"@

$files = Get-ChildItem -Path $Root -Filter *.html -File -Recurse
$updated = 0
$unchanged = 0
$failed = 0
$analyticsAdded = 0
$footerAddedOrUpdated = 0

Write-Host "Project root: $Root" -ForegroundColor Cyan
Write-Host "HTML files found: $($files.Count)" -ForegroundColor Cyan
Write-Host "Analytics ID: $MeasurementId" -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    try {
        $html = [System.IO.File]::ReadAllText($file.FullName)
        $newHtml = $html
        $changed = $false
        $addedAnalyticsThisFile = $false
        $updatedFooterThisFile = $false

        # ---------- Google Analytics ----------
        if ($newHtml -notmatch [regex]::Escape($MeasurementId)) {
            if ($newHtml -match '(?i)<head\b[^>]*>') {
                $newHtml = [regex]::Replace(
                    $newHtml,
                    '(?i)(<head\b[^>]*>)',
                    "`$1`r`n$GoogleTag",
                    1
                )
                $changed = $true
                $addedAnalyticsThisFile = $true
            }
            else {
                Write-Warning "No <head> found (Analytics skipped): $($file.FullName)"
            }
        }

        # ---------- Relative prefix (PowerShell 5.1 compatible) ----------
        $dir = $file.DirectoryName.TrimEnd('\','/')
        if ($dir.Length -le $Root.Length) {
            $depth = 0
        }
        else {
            $relativeDir = $dir.Substring($Root.Length).TrimStart('\','/')
            if ([string]::IsNullOrWhiteSpace($relativeDir)) {
                $depth = 0
            }
            else {
                $depth = ($relativeDir -split '[\\/]').Count
            }
        }

        $prefix = ""
        for ($i = 0; $i -lt $depth; $i++) {
            $prefix += "../"
        }

        $about   = $prefix + "about.html"
        $privacy = $prefix + "privacy-policy.html"
        $terms   = $prefix + "terms.html"
        $contact = $prefix + "contact.html"

        $legalBlock = @"
<div class="footer-legal-links">
  <a href="$about">من نحن</a>
  <span aria-hidden="true">|</span>
  <a href="$privacy">سياسة الخصوصية</a>
  <span aria-hidden="true">|</span>
  <a href="$terms">شروط الاستخدام</a>
  <span aria-hidden="true">|</span>
  <a href="$contact">اتصل بنا</a>
</div>
"@

        # Replace an existing legal-links block.
        if ($newHtml -match '(?is)<div\s+class=["'']footer-legal-links["''].*?</div>') {
            $before = $newHtml
            $newHtml = [regex]::Replace(
                $newHtml,
                '(?is)<div\s+class=["'']footer-legal-links["''].*?</div>',
                [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $legalBlock },
                1
            )
            if ($newHtml -ne $before) {
                $changed = $true
                $updatedFooterThisFile = $true
            }
        }
        # Otherwise insert it immediately before </footer>.
        elseif ($newHtml -match '(?is)</footer>') {
            $newHtml = [regex]::Replace(
                $newHtml,
                '(?is)</footer>',
                "$legalBlock`r`n</footer>",
                1
            )
            $changed = $true
            $updatedFooterThisFile = $true
        }
        else {
            Write-Warning "No <footer> found (legal links skipped): $($file.FullName)"
        }

        if ($changed -and $newHtml -ne $html) {
            $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
            [System.IO.File]::WriteAllText($file.FullName, $newHtml, $utf8NoBom)
            $updated++
            if ($addedAnalyticsThisFile) { $analyticsAdded++ }
            if ($updatedFooterThisFile) { $footerAddedOrUpdated++ }
        }
        else {
            $unchanged++
        }
    }
    catch {
        Write-Warning "Failed: $($file.FullName) | $($_.Exception.Message)"
        $failed++
    }
}

Write-Host ""
Write-Host "Finished." -ForegroundColor Green
Write-Host "Files updated        : $updated" -ForegroundColor Green
Write-Host "Files unchanged      : $unchanged" -ForegroundColor Yellow
Write-Host "Analytics added      : $analyticsAdded" -ForegroundColor Green
Write-Host "Footer added/updated : $footerAddedOrUpdated" -ForegroundColor Green
Write-Host "Failed               : $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })

Write-Host ""
Write-Host "Test before GitHub commit/push:" -ForegroundColor Cyan
Write-Host "  index.html"
Write-Host "  surah\1.html"
Write-Host "  quran-mp3\sds\1.html"
