# Youth Creator Studio

Modulare Vite-Webanwendung (Fabric.js, jsPDF) für das Jugendteam. Projekte werden lokal im Browser (IndexedDB) gespeichert.

## Veröffentlichen (ohne Build, nur Upload)
1. ZIP entpacken. Neues Repository auf github.com anlegen.
2. Add file → Upload files: **alle Dateien und den Ordner `src` aus dem entpackten Ordner** hineinziehen (auch `.nojekyll`), dann Commit.
3. Settings → Pages → Source: **Deploy from a branch**, Branch **main**, Ordner **/ (root)**, Save.
4. Nach 1–2 Minuten den Link öffnen (bei Änderungen Strg+F5 drücken).

Die Seite braucht Internet (Fabric.js, jsPDF und Google Fonts kommen von CDNs). Ein Doppelklick auf `index.html` funktioniert nicht, weil der Browser Module von der Festplatte blockiert. Zum lokalen Testen im Ordner `python -m http.server` starten und `localhost:8000` öffnen.

## Logo
Das Jugendlogo liegt in `src/assets/` (`logo.png` als Maske, `logo-pink.png` in #EC4899).

## Noch nicht enthalten
Vorlagenbibliothek, Elementbibliothek, Medienbibliothek, Farbpaletten, Bild-Zuschnitt, Raster, geschützter Teamzugang.
