<p align="center">
  <img src="icon.png" width="128" alt="RIS Syntax Highlighting Logo" />
</p>

<h1 align="center">RIS Syntax Highlighting</h1>

<p align="center">
  <b>Clean, robust syntax highlighting and reference folding for RIS (<code>.ris</code>) bibliography files.</b>
</p>

<p align="center">
  <a href="https://github.com/decobeto/RIS-Syntax-Highlighting-Extension/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/decobeto/RIS-Syntax-Highlighting-Extension"><img src="https://img.shields.io/badge/GitHub-Repository-black?logo=github" alt="GitHub Repository"></a>
</p>

---

## Overview

The **RIS Syntax Highlighting** extension adds first-class support for Research Information Systems (`.ris`) bibliographic citation files in **VS Code**, **Antigravity IDE**, and compatible editors.

RIS is a standardized tag format widely used by reference management tools such as **Mendeley**, **Zotero**, **EndNote**, **RefWorks**, and academic publishers (IEEE, ACM, Springer, Taylor & Francis, ScienceDirect). This extension makes large bibliographic exports readable, structured, and easy to navigate.

---

## Features

- 🎯 **Record Boundary Delimiters (`TY` / `ER`)**
  - Delimiters `TY` (record start) and `ER` (record end) are prominently highlighted using control keyword scopes, clearly framing each citation.
  - Publication type codes following `TY` (e.g., `JOUR`, `BOOK`, `CONF`, `THES`) are styled distinctly to identify the reference type at a glance.

- 🏷️ **Tag & Value Separation**
  - Metadata tags (`AU`, `TI`, `PY`, `JO`, `KW`, `SP`, `EP`, etc.) stand out visually from their associated values.
  - Separators (`  - `) use neutral punctuation styling to keep the layout clean and uncluttered.

- 🔗 **Smart Link & DOI Detection**
  - Direct link fields (`UR`, `DO`, `LK`, `L1`, `L2`, `L4`) are automatically recognized and styled with link underline formatting.
  - Embedded URLs (`https://...`) and DOIs (`10.xxxx/...`) appearing inside abstract paragraphs or notes are also detected and highlighted as links.

- 📝 **Multiline Continuation Handling**
  - Fields such as abstracts (`AB`) and notes (`N1`) frequently span multiple lines without repeating the tag prefix.
  - Subsequent lines are treated seamlessly as continuations of the active field without syntax errors or token breaks.

- 🛡️ **Graceful Fallback for Custom/Unknown Tags**
  - Any 2-character tag matching the standard format (`^[A-Z][A-Z0-9]  - `) is cleanly parsed, preventing proprietary or vendor-specific tags from disrupting the rest of the document.

- 📂 **Code Folding by Reference**
  - Easily fold (collapse) and expand each individual reference in the editor gutter, allowing you to quickly navigate files containing hundreds or thousands of citations.

- 🎨 **Universal Theme Compatibility**
  - Built strictly with standard TextMate scopes (`keyword.control`, `entity.name.tag`, `entity.name.type`, `markup.underline.link`, `string.unquoted`, `punctuation.separator`).
  - Works out of the box with default Dark, Dark Modern, Light, Light Modern, Monokai, and Solarized themes without requiring customized color rules.

---

## Example

```ris
TY  - JOUR
AU  - Silva, J.
AU  - Santos, M. A.
TI  - Machine Learning Architectures for Bibliographic Data
PY  - 2023
JO  - Journal of Artificial Intelligence Research
VL  - 12
IS  - 3
SP  - 100
EP  - 115
DO  - 10.1000/xyz123
UR  - https://doi.org/10.1000/xyz123
AB  - This abstract spans across multiple lines in the export file
without repeating the tag prefix on subsequent lines.
Additional details are available at https://example.org/project-info.
KW  - artificial intelligence
KW  - citations
KW  - machine learning
ER  - 
```

---

## Installation

### From Open VSX Registry / VS Code Marketplace
Search for **RIS Syntax Highlighting** (`decobeto.ris-syntax-highlighting`) in your editor's Extensions tab (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>) and click **Install**.

### Manual Installation via VSIX
Download the latest `ris-syntax-highlighting-0.1.0.vsix` from the [Releases](https://github.com/decobeto/RIS-Syntax-Highlighting-Extension/releases) page and run:

```bash
code --install-extension ris-syntax-highlighting-0.1.0.vsix
```

Or in Antigravity IDE:
```bash
antigravity-ide --install-extension ris-syntax-highlighting-0.1.0.vsix
```

---

## Contributing & Issues

Contributions, suggestions, and issue reports are welcome!
- **GitHub Repository**: [decobeto/RIS-Syntax-Highlighting-Extension](https://github.com/decobeto/RIS-Syntax-Highlighting-Extension)
- **Issue Tracker**: [GitHub Issues](https://github.com/decobeto/RIS-Syntax-Highlighting-Extension/issues)

---

## License

This project is licensed under the [MIT License](LICENSE).
