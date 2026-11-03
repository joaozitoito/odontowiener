# Recorta o símbolo da logo branca original; sem redesenhar ou alterar suas cores.
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$source = [System.Drawing.Bitmap]::new((Join-Path $projectRoot 'assets/logoodomto1.png'))
$output = Join-Path $projectRoot 'assets/icons'
New-Item -ItemType Directory -Force -Path $output | Out-Null
# A primeira componente alfa é o dente; letras próximas ao recorte são separadas.
$seed = $null
for ($y=0; $y -lt 59 -and $null -eq $seed; $y++) {
    for ($x=0; $x -lt 60; $x++) {
        if ($source.GetPixel($x,$y).A -gt 0) { $seed = [System.Drawing.Point]::new($x,$y); break }
    }
}
$isolated = [System.Drawing.Bitmap]::new($source.Width,$source.Height)
$queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()
$seen = [System.Collections.Generic.HashSet[int]]::new()
$queue.Enqueue($seed)
while ($queue.Count -gt 0) {
    $point = $queue.Dequeue(); $x=$point.X; $y=$point.Y
    if ($x -lt 0 -or $y -lt 0 -or $x -ge $source.Width -or $y -ge $source.Height) { continue }
    if (-not $seen.Add($y*$source.Width+$x) -or $source.GetPixel($x,$y).A -eq 0) { continue }
    $isolated.SetPixel($x,$y,$source.GetPixel($x,$y))
    foreach ($dx in @(-1,0,1)) { foreach ($dy in @(-1,0,1)) { if ($dx -ne 0 -or $dy -ne 0) { $queue.Enqueue([System.Drawing.Point]::new($x+$dx,$y+$dy)) } } }
}
$source.Dispose(); $source=$isolated
# O texto começa à direita e abaixo deste retângulo na fonte 179x87.
$minX = 60; $minY = 59; $maxX = 0; $maxY = 0
for ($y = 0; $y -lt 59; $y++) {
    for ($x = 0; $x -lt 60; $x++) {
        if ($source.GetPixel($x, $y).A -gt 0) {
            $minX = [Math]::Min($minX, $x); $maxX = [Math]::Max($maxX, $x)
            $minY = [Math]::Min($minY, $y); $maxY = [Math]::Max($maxY, $y)
        }
    }
}
$crop = [System.Drawing.Rectangle]::new($minX, $minY, $maxX-$minX+1, $maxY-$minY+1)
foreach ($size in @(16,32,48,512)) {
    $bitmap = [System.Drawing.Bitmap]::new($size,$size,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $scale = ($size * 0.90) / [Math]::Max($crop.Width,$crop.Height)
    $width = [int][Math]::Round($crop.Width*$scale); $height = [int][Math]::Round($crop.Height*$scale)
    $destination = [System.Drawing.Rectangle]::new([int](($size-$width)/2),[int](($size-$height)/2),$width,$height)
    $graphics.DrawImage($source,$destination,$crop,[System.Drawing.GraphicsUnit]::Pixel)
    $bitmap.Save((Join-Path $output "favicon-$size.png"),[System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose(); $bitmap.Dispose()
}
$source.Dispose()
$sizes = @(16,32,48)
$stream = [System.IO.File]::Create((Join-Path $output 'favicon.ico'))
$writer = [System.IO.BinaryWriter]::new($stream)
$writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]3)
$offset = 6+16*3
foreach ($size in $sizes) {
    $data = [System.IO.File]::ReadAllBytes((Join-Path $output "favicon-$size.png"))
    $writer.Write([byte]$size); $writer.Write([byte]$size); $writer.Write([byte]0); $writer.Write([byte]0)
    $writer.Write([uint16]1); $writer.Write([uint16]32); $writer.Write([uint32]$data.Length); $writer.Write([uint32]$offset)
    $offset += $data.Length
}
foreach ($size in $sizes) { $writer.Write([System.IO.File]::ReadAllBytes((Join-Path $output "favicon-$size.png"))) }
$writer.Dispose()
Write-Output "Símbolo original recortado em $crop; PNGs transparentes e ICO gerados."
