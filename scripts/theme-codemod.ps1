# One-off codemod: replace hardcoded dark-theme utilities with theme tokens.
# Tokens are defined in src/app/globals.css (:root = admin dark, .theme-atelier = public light).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

$rules = [ordered]@{
  'text-white/40'                    = 'text-[var(--text-muted)]'
  'text-white(?![\w/-])'             = 'text-[var(--text-strong)]'
  'text-slate-(100|200|300)(?![\w/-])' = 'text-[var(--text-body)]'
  'text-slate-400(?![\w/-])'         = 'text-[var(--text-muted)]'
  'placeholder:text-slate-600'       = 'placeholder:text-[var(--text-muted)]/70'
  'border-white/(5|8|10)(?![\w-])'   = 'border-[var(--line)]'
  'border-white/(15|30)(?![\w-])'    = 'border-[var(--line-strong)]'
  'divide-white/10'                  = 'divide-[var(--line)]'
  'ring-white/10'                    = 'ring-[var(--line)]'
  'bg-white/5(?![\w-])'              = 'bg-[var(--line)]'
  'bg-white/(10|20)(?![\w-])'        = 'bg-[var(--line-strong)]'
  'bg-black/(15|20|30)(?![\w-])'     = 'bg-[var(--bg-secondary)]'
  '(?<![\w-])text-black(?![\w/-])'   = 'text-[var(--on-accent)]'
  'bg-\[#080c14\](/90)?'             = 'bg-[var(--field)]'
  'from-\[#080c14\]'                 = 'from-[var(--scrim)]'
  '(from|via|to)-\[#(050810|06080f)\]' = '$1-[var(--scrim)]'
  'bg-\[#06080f\]'                   = 'bg-[var(--scrim)]'
  'bg-\[#(0c1220|111827|070b14)\]'   = 'bg-[var(--bg-secondary)]'
  'bg-\[#070b12\]/95'                = 'bg-[var(--bg-primary)]/95'
  'bg-cyan-(300|400)/'               = 'bg-[var(--neon-cyan)]/'
  'text-red-(300|400)(?![\w/-])'     = 'text-[var(--danger)]'
  'text-green-300(?![\w/-])'         = 'text-[var(--neon-green)]'
  'text-amber-300(?![\w/-])'         = 'text-[var(--warning)]'
  'border-amber-300/40'              = 'border-[var(--warning)]/40'
  'bg-amber-300/5'                   = 'bg-[var(--warning)]/5'
}

$files = Get-ChildItem -Recurse (Join-Path $root "src") -Include *.tsx, *.ts |
  Where-Object { $_.Name -notin @("icon.tsx", "manifest.ts", "database.types.ts") }

$changed = 0
foreach ($file in $files) {
  $text = [IO.File]::ReadAllText($file.FullName)
  $next = $text
  foreach ($pattern in $rules.Keys) {
    $next = [regex]::Replace($next, $pattern, $rules[$pattern])
  }
  if ($next -ne $text) {
    [IO.File]::WriteAllText($file.FullName, $next)
    $changed++
  }
}
Write-Output "Updated $changed files"
