# Recorta o dente da logo azul original, preservando os pixels e o alfa.
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$source = [System.Drawing.Bitmap]::new((Join-Path $projectRoot 'assets/logo1.png'))
$output = Join-Path $projectRoot 'assets/icons'
New-Item -ItemType Directory -Force -Path $output | Out-Null
# Este ponto pertence ao dente na logo de 232×105. As letras estão em outros componentes alfa.
$seed = [System.Drawing.Point]::new(70,4)
if ($source.GetPixel($seed.X,$seed.Y).A -eq 0) {
    $source.Dispose()
    throw 'O ponto de recorte não pertence ao símbolo na imagem de origem.'
}
$isolated = [System.Drawing.Bitmap]::new($source.Width,$source.Height)
$queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()
$seen = [System.Collections.Generic.HashSet[int]]::new()
$minX = $maxX = $seed.X
$minY = $maxY = $seed.Y
$queue.Enqueue($seed)
while ($queue.Count -gt 0) {
    $point = $queue.Dequeue(); $x=$point.X; $y=$point.Y
    if ($x -lt 0 -or $y -lt 0 -or $x -ge $source.Width -or $y -ge $source.Height) { continue }
    if (-not $seen.Add($y*$source.Width+$x)) { continue }
    $pixel = $source.GetPixel($x,$y)
    if ($pixel.A -eq 0) { continue }
    $isolated.SetPixel($x,$y,$pixel)
    $minX = [Math]::Min($minX, $x); $maxX = [Math]::Max($maxX, $x)
    $minY = [Math]::Min($minY, $y); $maxY = [Math]::Max($maxY, $y)
    foreach ($dx in @(-1,0,1)) { foreach ($dy in @(-1,0,1)) { if ($dx -ne 0 -or $dy -ne 0) { $queue.Enqueue([System.Drawing.Point]::new($x+$dx,$y+$dy)) } } }
}
$source.Dispose()
$crop = [System.Drawing.Rectangle]::new($minX, $minY, $maxX-$minX+1, $maxY-$minY+1)
foreach ($size in @(16,32,48,512)) {
    $bitmap = [System.Drawing.Bitmap]::new($size,$size,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $margin = [Math]::Max(1, [int][Math]::Round($size * 0.04))
    $scale = ($size - 2 * $margin) / [Math]::Max($crop.Width,$crop.Height)
    $width = [int][Math]::Round($crop.Width*$scale); $height = [int][Math]::Round($crop.Height*$scale)
    $destination = [System.Drawing.Rectangle]::new([int](($size-$width)/2),[int](($size-$height)/2),$width,$height)
    $graphics.DrawImage($isolated,$destination,$crop,[System.Drawing.GraphicsUnit]::Pixel)
    $bitmap.Save((Join-Path $output "favicon-$size.png"),[System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose(); $bitmap.Dispose()
}
$isolated.Dispose()
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
