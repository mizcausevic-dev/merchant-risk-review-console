$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $altAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $graphics.DrawString("Merchant Risk Review Console", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.FillEllipse($altAccentBrush, 114, $y + 12, 10, 10)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof-v2.png") `
    -Title "Overview proof" `
    -Subtitle "Chargeback pressure, reserve coverage, KYB drift, and payout review in one merchant-risk operator surface." `
    -Bullets @(
        "Chargeback pressure and review-queue overload surface before approval posture drifts.",
        "Reserve coverage, payout throttles, and fraud-rule gaps stay visible together.",
        "Every lane stays tied to an operator-safe review packet."
    )

New-ProofImage -Path (Join-Path $screenshots "02-merchant-lane-proof-v2.png") `
    -Title "Merchant lane" `
    -Subtitle "Each merchant lane keeps owner, focus, status, and next action visible." `
    -Bullets @(
        "Chargeback, KYB, reserve, and review lanes stay separated cleanly.",
        "Status remains readable at a glance.",
        "Next actions stay operator-safe and audit-readable."
    )

New-ProofImage -Path (Join-Path $screenshots "03-risk-findings-proof-v2.png") `
    -Title "Risk findings" `
    -Subtitle "Findings map severity, owner, control family, merchant path, and the exact control break." `
    -Bullets @(
        "High-severity merchant findings surface first.",
        "Operators can tie risk back to account path and control family quickly.",
        "The lane is grounded in real merchant-review primitives."
    )

New-ProofImage -Path (Join-Path $screenshots "04-review-posture-proof-v2.png") `
    -Title "Review posture" `
    -Subtitle "Packets tie completeness, blocker, owner, and settlement timing together." `
    -Bullets @(
        "Chargeback, KYB, reserve, and payout packets stay visible.",
        "Red and yellow posture remains easy to scan.",
        "The system is shaped for real merchant-risk and underwriting proof."
    )
