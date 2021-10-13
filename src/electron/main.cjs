const {app, BrowserWindow} = require('electron')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      // to-do: Is there a better way or at least something more granular? This
      // disable all security just for file image URL support.
      webSecurity: false
    },
    autoHideMenuBar: true,
    icon: `${__dirname}/linear-text.png`
  })

  const appURL = app.isPackaged
    ? `file://${__dirname}/../../build/web/index.html`
    : 'http://localhost:3000' // Must align to package.json
  win.loadURL(appURL)
})
