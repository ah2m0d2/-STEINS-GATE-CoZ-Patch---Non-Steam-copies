# noidget

This is the ~~crossplatform~~ TODO crossplatform installer framework we've used to build the installer for the CHAOS;CHILD patch. Existing installer frameworks weren't meeting our weird and specific needs, but you'll probably want something else for your own projects.

Installer scripts are written in JavaScript (well, technically QtScript). `npm run docs` can be used to generate API documentation, after `npm install` to get the documentation generator.

Copy `conf.pri.sample` to `conf.pri` and put in paths to dependencies.

At the time of writing, for Windows, this should be built with MSVC 2015.

Example build (in a cmd.exe configured for Qt 5.x for MSVC 2015):
```
mkdir build
cd build
qmake ../
nmake
```

A `userdata.rcc` containing at least a `userdata/script.js` installation script must be provided for the resulting executable to do anything useful. See the C;C patch repository for a complete example.

This framework depends on the following software:

- [Qt](https://www.qt.io/) 5.9+
- [miniaudio](https://github.com/dr-soft/miniaudio) and [dr_mp3](https://github.com/mackron/dr_libs) (vendored)
- [kofuna](https://github.com/CommitteeOfZero/kofuna) (ours, submodule)