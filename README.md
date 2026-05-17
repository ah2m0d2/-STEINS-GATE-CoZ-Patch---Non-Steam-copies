# STEINS;GATE CoZ Patch for Non-Steam copies

## Credits
 
All credit goes to the **Committee of Zero** for their incredible work on the original patch. This is simply a modified build of their installer.
 
- Original patch: https://github.com/CommitteeOfZero/sghd-patch
- Committee of Zero website: https://sonome.dareno.me/
---
 
## What's Changed?
 
- Removed the MD5 check from `script.js` — the installer now only checks that the script file exists, not that it matches a specific version
- Compiled the installer from source with the edited script

The end result is that the installer accepts any version of the game's script archive instead of demanding a specific one, making the patch installable on non-Steam copies.
 
---
 
## Requirements
 
- A copy of STEINS;GATE containing `Game.exe` and a `USRDIR` folder
- [Microsoft Visual C++ Redistributable (x86)](https://aka.ms/vs/17/release/vc_redist.x86.exe) — install this first if you get DLL errors after installing the patch.

## Disclaimer
 
This project is not affiliated with or endorsed by Committee of Zero or MAGES. All patch content belongs to their respective owners. This modified installer is provided purely for preservation purposes.



