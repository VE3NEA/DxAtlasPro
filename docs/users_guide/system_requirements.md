# System Requirements

## Hardware

- **Computer**: 64-bit PC with an x64 processor;
- **Video Card**: on Windows, any video card with a Direct3D 11 driver; on Linux, OpenGL 3.3 or
  higher;
- **Disk Space**: about 200 MB;
- **Internet**: optional. Without it, the program works fully as an atlas; the connection is used
  to download the sunspot number and the Ap index for the ionospheric and propagation maps, and
  the auroral oval in real time.

## Software

- **Windows**: Windows 10 or Windows 11, 64-bit. The setup program installs the .NET 10 Runtime
  and the Microsoft Visual C++ Redistributable if they are not on the computer yet;
- **Linux**: 64-bit x64 Linux with an X11 desktop and an OpenGL driver. The program is
  self-contained and needs no .NET Runtime. Tested on Ubuntu 24.04 and Linux Mint 22.3. The
  OpenGL driver is normally installed with the desktop.

  To see which display system your desktop uses, type `echo $XDG_SESSION_TYPE` in a terminal: it
  prints `x11` or `wayland`. On a Wayland desktop the program runs through XWayland, which most
  distributions install with the desktop; this has not been tested yet, so if the program does not
  start, choose an X11 (often called "Xorg") session on the login screen.
