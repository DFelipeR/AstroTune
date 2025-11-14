# Create a WAV file with actual audio (440 Hz sine wave tone)
$audioDir = 'C:\Users\USER\OneDrive\Escritorio\Projects\Jamming\Jammming\public\audio'
$wavPath = Join-Path $audioDir 'sample.wav'

# WAV parameters
$sampleRate = 44100
$duration = 30
$channels = 1
$bitsPerSample = 16
$frequency = 440  # A4 note (Hz)
$amplitude = 32760  # Max for 16-bit signed

$totalSamples = $sampleRate * $duration
$dataSize = $totalSamples * 2

# Create WAV header (44 bytes)
$header = New-Object byte[] 44

# RIFF chunk
$header[0] = 0x52  # R
$header[1] = 0x49  # I
$header[2] = 0x46  # F
$header[3] = 0x46  # F

# ChunkSize (total file size - 8)
$chunkSize = $dataSize + 36
[BitConverter]::GetBytes($chunkSize) | ForEach-Object -Begin { $idx = 4 } { $header[$idx] = $_; $idx++ }

# WAVE format
$header[8] = 0x57   # W
$header[9] = 0x41   # A
$header[10] = 0x56  # V
$header[11] = 0x45  # E

# fmt subchunk
$header[12] = 0x66  # f
$header[13] = 0x6D  # m
$header[14] = 0x74  # t
$header[15] = 0x20  # (space)

# Subchunk1Size (16 for PCM)
$header[16] = 0x10
$header[17] = 0x00
$header[18] = 0x00
$header[19] = 0x00

# AudioFormat (1 = PCM)
$header[20] = 0x01
$header[21] = 0x00

# NumChannels (1 = mono)
$header[22] = 0x01
$header[23] = 0x00

# SampleRate (44100)
[BitConverter]::GetBytes($sampleRate) | ForEach-Object -Begin { $idx = 24 } { $header[$idx] = $_; $idx++ }

# ByteRate (SampleRate * NumChannels * BitsPerSample/8)
$byteRate = $sampleRate * $channels * 2
[BitConverter]::GetBytes($byteRate) | ForEach-Object -Begin { $idx = 28 } { $header[$idx] = $_; $idx++ }

# BlockAlign (NumChannels * BitsPerSample/8)
$header[32] = 0x02
$header[33] = 0x00

# BitsPerSample (16)
$header[34] = 0x10
$header[35] = 0x00

# data subchunk
$header[36] = 0x64  # d
$header[37] = 0x61  # a
$header[38] = 0x74  # t
$header[39] = 0x61  # a

# Subchunk2Size (data size)
[BitConverter]::GetBytes($dataSize) | ForEach-Object -Begin { $idx = 40 } { $header[$idx] = $_; $idx++ }

# Write WAV file with audio
$stream = [IO.File]::Create($wavPath)
$stream.Write($header, 0, $header.Length)

# Generate sine wave samples
$twoPi = [Math]::PI * 2
$samplesPerCycle = $sampleRate / $frequency

Write-Host "Generating $totalSamples samples at $frequency Hz..."

# Generate in chunks for efficiency
$chunkSize = 4410  # 0.1 second chunks
$sample = 0

while ($sample -lt $totalSamples) {
    $chunk = New-Object byte[] ([Math]::Min($chunkSize * 2, ($totalSamples - $sample) * 2))
    $byteIdx = 0
    
    for ($i = 0; $i -lt [Math]::Min($chunkSize, $totalSamples - $sample); $i++) {
        # Calculate sine wave value
        $angle = ($twoPi * ($sample + $i)) / $samplesPerCycle
        $value = [Math]::Sin($angle) * $amplitude
        
        # Convert to 16-bit signed integer (little-endian)
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

$size = (Get-Item $wavPath).Length
Write-Host "✅ WAV with 440 Hz tone created: $wavPath"
Write-Host "   Size: $size bytes (30 seconds)"
