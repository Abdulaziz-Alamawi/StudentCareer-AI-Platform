# One-off helper: generates placeholder screenshot PNGs for README modules
# that do not yet have a real screenshot. Replace these with real captures.
Add-Type -AssemblyName System.Drawing

$root  = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$shots = Join-Path $root "docs\screenshots"
New-Item -ItemType Directory -Force -Path $shots | Out-Null

$items = @(
    @{ File = "resume-analyzer.png";     Title = "Resume Analyzer";     Sub = "ATS - Content - Formatting - Skills Coverage" },
    @{ File = "interview-simulator.png"; Title = "Interview Simulator"; Sub = "6 Tracks - Technical / Behavioral / Scenario" },
    @{ File = "roadmap-generator.png";   Title = "Roadmap Generator";   Sub = "Personalized Learning - Certs - Projects" }
)

$W = 1280; $H = 720

foreach ($it in $items) {
    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Gradient background (brand violet -> slate)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
    $c1 = [System.Drawing.Color]::FromArgb(99, 102, 241)
    $c2 = [System.Drawing.Color]::FromArgb(15, 23, 42)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 60)
    $g.FillRectangle($brush, $rect)

    # App name (top)
    $fontApp = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
    $white   = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString("StudentCareer AI", $fontApp, $white, 60, 50)

    # Title (centered)
    $fontTitle = New-Object System.Drawing.Font("Segoe UI", 58, [System.Drawing.FontStyle]::Bold)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment     = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $titleRect = New-Object System.Drawing.RectangleF(0, ($H/2 - 70), $W, 110)
    $g.DrawString($it.Title, $fontTitle, $white, $titleRect, $sf)

    # Subtitle
    $fontSub = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Regular)
    $light   = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(226, 232, 240))
    $subRect = New-Object System.Drawing.RectangleF(0, ($H/2 + 50), $W, 50)
    $g.DrawString($it.Sub, $fontSub, $light, $subRect, $sf)

    # Footer note
    $fontNote = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Italic)
    $note     = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(148, 163, 184))
    $noteRect = New-Object System.Drawing.RectangleF(0, ($H - 80), $W, 40)
    $g.DrawString("Preview placeholder - replace with a real screenshot", $fontNote, $note, $noteRect, $sf)

    $out = Join-Path $shots $it.File
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Output "created $($it.File)"
}
