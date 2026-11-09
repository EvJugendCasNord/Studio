# Youth Creator Studio

Modulare Vite-Webanwendung (Fabric.js, jsPDF) für das Jugendteam. Projekte werden lokal im Browser (IndexedDB) gespeichert.

## Lokal starten (Windows)
1. Node.js LTS von nodejs.org installieren.
2. Ordner entpacken, dort ein Terminal öffnen.
3. `npm install`, danach `npm run dev` (Vorschau) oder `npm run build` (Ordner `dist`).

## Auf GitHub Pages veröffentlichen
1. Neues Repository auf github.com anlegen.
2. Alle Dateien des entpackten Ordners hochladen (Add file → Upload files). Der versteckte Ordner `.github` muss mit. Nicht `node_modules` und `dist` hochladen.
3. Settings → Pages → Source: **GitHub Actions**.
4. Unter **Actions** den Lauf „Deploy“ abwarten. Der Link steht danach unter Settings → Pages.

## Logo
Das Jugendlogo liegt in `src/assets/` (`logo.png` als Maske, `logo-pink.png` in #EC4899). Es wird im Dashboard, im Editor und über den Button „Jugendlogo einfügen“ in Designs verwendet. Zum Austauschen beide Dateien ersetzen (transparenter Hintergrund).

## Wichtig
Die Seite funktioniert nicht per Doppelklick auf `index.html` (dann bleibt sie leer). Sie läuft über `npm run dev` oder nach dem Deploy auf GitHub Pages.

## Stand / Noch nicht enthalten
Vorlagenbibliothek, Elementbibliothek (Sticker, Pfeile, Rahmen, Social-Icons), eigene Medienbibliothek, Farbpaletten und Favoritenfarben, Bild-Zuschnitt, Raster, geschützter Teamzugang (z. B. Supabase). Schriftstärken: Normal und Fett. Der Build wurde noch nicht ausgeführt.
