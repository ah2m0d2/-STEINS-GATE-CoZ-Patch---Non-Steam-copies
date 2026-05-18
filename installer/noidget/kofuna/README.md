# kofuna

*kofuna* is a flat white-on-black design for *Win9x*-style controls in *Qt5 Widgets*. It is **not** a formal QStyle, but rather a stylesheet and custom controls to be used with Qt's builtin (crossplatform) *Windows* style.

I wrote this for internal use but we don't object to others using it, just don't expect any stability or support. Controls are added as we need them.

# Usage

Include *kofuna* in your QMake project:
```
include(kofuna/kofuna.pri)
```

Apply it to your application globally:
```cpp
QApplication::setStyle("windows");
QApplication a(argc, argv);
QFile qssFile(":/kofuna/style.qss");
qssFile.open(QFile::ReadOnly | QFile::Text);
QTextStream ts(&qssFile);
a.setStyleSheet(ts.readAll());
```

### Notes

* Use `InvertProgressBar` in place of `QProgressBar` for a pure white-on-black progress bar that remains readable.
* Make a QFrame called `frame` filling the window to get a 1px dark border around `Qt::FramelessWindowHint` windows.
* When using `QPushButtons` with icons, you'll likely want to change padding. Add a `'hasIcon' = true` dynamic property to your button.