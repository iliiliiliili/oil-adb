'use strict';

const adb = require('./NodeAdb.js');
const fs = require ('fs');
const text = fs.readFileSync ('text.txt', 'utf8');

const main = async () => {
    
    let s = '';
    for (let i = 0; i < 1000; i++) {
        
        s += i + (i % 200 == 0 ? '\n' : '_');
    }
    
    const devices = (await adb.devices ());
    
    console.log ({devices});
    
    for (let i in devices) {
        
        adb.use (devices [i]);
        await adb.text (i % 2 == 0 ? text : s);
        await adb.home ();
        await adb.power ();
    }
    
    
}

main ();