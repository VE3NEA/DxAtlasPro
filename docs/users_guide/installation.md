# Installation

Download the setup program for Windows, or the archive for Linux, from the
[Download](https://ve3nea.github.io/DxAtlasPro/download.html) page. Check the [System Requirements](system_requirements.md) first.

## Windows

1. Run `DxAtlasProSetup-v.X.Y.exe`, where X.Y is the version number. The setup needs administrator
   rights, and Windows asks for them when it starts;
2. accept the Licence Agreement;
3. if the .NET 10 Runtime or the Microsoft Visual C++ Redistributable is not on the computer, the
   setup downloads and installs it;
4. optionally, tick **Create a desktop shortcut**;
5. when the setup finishes, leave **Launch DX Atlas Pro** ticked to start the program.

The program is installed in `C:\Program Files\Afreet\DxAtlasPro`, with a shortcut in the Start
menu. The setup also registers the COM interface that lets programs written for DX Atlas 2 work
with DX Atlas Pro; see the [Developer's Guide](https://ve3nea.github.io/DxAtlasPro/developers_guide/overview.html).

To install a new version, run its setup over the old one. Your settings are kept.

### Uninstalling

Uninstall DX Atlas Pro from **Settings > Apps > Installed apps** in Windows. Your settings are
not removed; they stay in `%APPDATA%\Afreet\Products\DxAtlasPro`, and you can delete that folder
by hand.

If DX Atlas is also installed on the computer, uninstalling DX Atlas Pro removes the COM
registration that the two programs share, so reinstall DX Atlas afterwards for the programs that
use its COM interface.

## Linux

The Linux version is a self-contained archive: it needs no installation and no .NET Runtime.

1. Unpack the archive to any folder, for example your home folder:

   ```bash
   mkdir -p ~/DxAtlasPro
   tar -xzf DxAtlasPro-v.X.Y-linux-x64.tar.gz -C ~/DxAtlasPro
   ```

2. Run the program:

   ```bash
   ~/DxAtlasPro/DxAtlasPro
   ```

To install a new version, unpack it over the old one. Your settings are kept in
`~/.config/Afreet/Products/DxAtlasPro`. To uninstall, delete the program folder and, if you
do not need your settings any more, that folder too.
