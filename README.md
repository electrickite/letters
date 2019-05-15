Letters and Numbers
===================

Educational letter and number identification game, built with Electron.

Run
---

    $ npm install
    $ sudo chown root node_modules/electron/dist/chrome-sandbox
    $ sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
    $ npm start

Usage
-----

    $ npm start [-- [mode] [quiet]]

Mode can be one of:

  * `letters` - display only letters
  * `numbers` - display only numbers
  * `both` - display both letters and numbers

`quiet` will print prompts instead of speaking them.
