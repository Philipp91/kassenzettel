# Kassenzettel-Zusammenfasser

Du hast eine Cumulus-Karte und setzt sie auch immer brav ein? Dann hat die Migros haufenweise Daten über dich gesammelt.
Auf der Migros-Webseite kann man seine Kassenbons aus den letzten Monaten/Jahren als CSV-Datei herunterladen.
Diese Chrome-Erweiterung automatisiert diesen Prozess und aggregiert die Ausgaben dann pro gekauftem Produkt,
sodass man erfahren kann, für welche Produkte man am meisten ausgibt.

Alle Daten werden ausschliesslich lokal im Browser verarbeitet und gespeichert.
Insbesondere werden die von der Migros abgeholten Kassenbons nicht an irgendwelche Server im Internet gesendet.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Make sure to download at least one CSV file from Migros and put it into `./public/receipts-details.csv`.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the Chrome extension for production to the `dist` folder (via the `build` folder).\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run release`

Builds and then bundles the extension for deployment in the Chrome Web Store.
