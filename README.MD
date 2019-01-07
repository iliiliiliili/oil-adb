# Oil adb
- async
- simple
- don't need to encapsulate strings to print

### Install
``npm install oil-adb``

### Sample code

```js
const adb = require('oil-adb');

const main = async () => {
    
    const devices = (await adb.devices ());
    console.log ({devices});
    
    for (let i in devices) {
        
        adb.use (devices [i]);
        await adb.text ('Hello, is it me you\'re looking for?');
        await adb.home ();
        await adb.power ();
    }
}

main ();
````

### Methods

* ``async call (code)``
* ``async rawDevices ()``
* ``async devices ()``
* ``async touch (x, y)``
* ``async swipe (x1, y1, x2, y2, ms)``
* ``async key (keycode)``
* ``async endl ()``
* ``async back ()``
* ``async home ()``
* ``async menu ()``
* ``async power ()``
* ``async rawText (value)``
* ``async text (value)``
* ``async mediaMounted (location = 'file:///sdcard')``
* ``async mediaScanFile (location)``
* ``async push (from, to = '/sdcard/')``
* ``async pull (from, to = '')``
* ``async ls (location = '/')``
* ``async rm (location)``
* ``async rmrf (location)``
* ``async install (location)``
* ``async start (packageName)``
* ``async close (packageName)``
* ``async killServer ()``
* ``async startServer ()``
* ``async restartServer ()``
* ``async tcpip (port = 5555)``
* ``async connect (address)``
* ``async disconnect (address)``
* ``async screenshot (fileName = 's.png', localSavePath = '', androidSavePath = '/sdcard/')``
* ``use (device)``
* ``verbose (isVerbose)``
    
