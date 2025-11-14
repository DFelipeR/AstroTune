$audioDir = 'C:\Users\USER\OneDrive\Escritorio\Projects\Jamming\Jammming\public\audio'
New-Item -ItemType Directory -Path $audioDir -Force | Out-Null

$notes = @{
    'C' = 262
    'D' = 294
    'E' = 330
    'F' = 349
    'G' = 392
    'A' = 440
    'B' = 494
}

$songNotes = @(
    'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A',
    'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'
)

$sampleRate = 44100
$duration = 10
$amplitude = 32760
$totalSamples = $sampleRate * $duration
$dataSize = $totalSamples * 2

function Create-WavFile {
    param([string]$OutputPath, [int]$Frequency)
    
    $header = New-Object byte[] 44
    $header[0] = 0x52; $header[1] = 0x49; $header[2] = 0x46; $header[3] = 0x46
    $chunkSize = $dataSize + 36
    [BitConverter]::GetBytes($chunkSize) | ForEach-Object -Begin { $idx = 4 } { $header[$idx] = $_; $idx++ }
    
    $header[8] = 0x57; $header[9] = 0x41; $header[10] = 0x56; $header[11] = 0x45
    $header[12] = 0x66; $header[13] = 0x6D; $header[14] = 0x74; $header[15] = 0x20
    $header[16] = 0x10; $header[17] = 0x00; $header[18] = 0x00; $header[19] = 0x00
    $header[20] = 0x01; $header[21] = 0x00
    $header[22] = 0x01; $header[23] = 0x00
    
    [BitConverter]::GetBytes($sampleRate) | ForEach-Object -Begin { $idx = 24 } { $header[$idx] = $_; $idx++ }
    $byteRate = $sampleRate * 2
    [BitConverter]::GetBytes($byteRate) | ForEach-Object -Begin { $idx = 28 } { $header[$idx] = $_; $idx++ }
    
    $header[32] = 0x02; $header[33] = 0x00
    $header[34] = 0x10; $header[35] = 0x00
    $header[36] = 0x64; $header[37] = 0x61; $header[38] = 0x74; $header[39] = 0x61
    [BitConverter]::GetBytes($dataSize) | ForEach-Object -Begin { $idx = 40 } { $header[$idx] = $_; $idx++ }
    
    $stream = [IO.File]::Create($OutputPath)
    $stream.Write($header, 0, $header.Length)
    
    $twoPi = [Math]::PI * 2
    $samplesPerCycle = $sampleRate / $Frequency
    $sample = 0
    $chunkSize = 4410
    
    while ($sample -lt $totalSamples) {
        $chunk = New-Object byte[] ([Math]::Min($chunkSize * 2, ($totalSamples - $sample) * 2))
        $byteIdx = 0
        
        for ($i = 0; $i -lt [Math]::Min($chunkSize, $totalSamples - $sample); $i++) {
            $angle = ($twoPi * ($sample + $i)) / $samplesPerCycle
            $value = [Math]::Sin($angle) * $amplitude
            $int16 = [Convert]::ToInt16($value)
            $bytes = [BitConverter]::GetBytes($int16)
            $chunk[$byteIdx] = $bytes[0]
            $chunk[$byteIdx + 1] = $bytes[1]
            $byteIdx += 2
        }
        
        $stream.Write($chunk, 0, $byteIdx)
        $sample += $chunkSize
    }
    
    $stream.Close()
}

Write-Host "Creating 50 WAV files with different notes..."
for ($i = 0; $i -lt 50; $i++) {
    $noteKey = $songNotes[$i]
    $frequency = $notes[$noteKey]
    $filename = "track_$($i + 1)_$($noteKey).wav"
    $filepath = Join-Path $audioDir $filename
    
    Create-WavFile -OutputPath $filepath -Frequency $frequency
    Write-Host "Created $filename"
}

Write-Host "All 50 WAV files created successfully!"
