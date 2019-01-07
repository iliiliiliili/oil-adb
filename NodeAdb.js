'use strict';

const { exec } = require ('child_process');

let currentDeviceName = '';
let isVerbose = false;

const call = (code) => {
    
    return new Promise ((resolve, reject) => {
        
        const command = 'adb ' + (currentDeviceName == '' ? '' : '-s ' + currentDeviceName + ' ') + code;
        
        if (isVerbose) {
            
            console.log (command);
        }
        
        exec (command, (err, stdout, stderr) => {
           
            if (err) {
                
                reject (new Error (err));
            }
            
            resolve (stdout);
        });
    });
};

const replaceAll = (target, search, replacement) => target.replace(new RegExp('\\' + search, 'g'), replacement);
    
const prepareText = (value) => {

    return [
        ['\\', '\\\\'],
        ['%', '\\%'],
        ['"', '\\"'],
        ["'", "\\'"],
        ['(', '\\('],
        [')', '\\)'],
        ['&', '\\&'],
        ['<', '\\<'],
        ['>', '\\.'],
        [';', '\\;'],
        ['*', '\\*'],
        ['|', '\\|'],
        ['~', '\\~'],
        ['¬', '\\¬'],
        ['`', '\\`'],
        ['¦', '\\¦'],
        ['#', '\\#'],
        ['!', '\\!'],
        ['_', '\\_'],
        [' ', '\\%s'],
        ].reduce ((ac, val) => replaceAll (ac, ...val), value);
};

const rawDevices = () => call ('devices');
const devices = async () => {
  
    return (await rawDevices ()).split(/\r?\n/).map (l => l.split ('\t')).filter (t => t.length > 1).map (d => {
       
        return {name : d [0], status : d [1]};
    });
};

const verbose = (value) => {

    isVerbose = value;
};
    
const use = (device) => {
    
    currentDeviceName = (device.name || device);
};

const touch = (x, y) => call (`shell input touchscreen tap ${x} ${y}`);
const swipe = (x1, y1, x2, y2, ms) => call (`shell input swipe ${x1} ${y1} ${x2} ${y2} ${ms}`);
const key = (keycode) => call (`shell input keyevent "${keycode}"`);
const endl = () => key ('KEYCODE_ENTER');
const back = () => key ('KEYCODE_BACK');
const home = () => key ('KEYCODE_HOME');
const menu = () => key ('KEYCODE_MENU');
const power = () => key ('KEYCODE_POWER');
const rawText = (value) => call (`shell input text "${value}"`);
const text = async (value) => {
    
    const prepared = prepareText (value);
    const lines = prepared.split(/\r?\n/).map (l => l.match(/.{1,300}/g));
    
    for (let i = 0; i < lines.length; i++) {
        
        for (let q = 0; q < lines [i].length; q++) {
            
            await rawText (lines [i][q]);
        }
        
        if (i < lines.length - 1) {
            
            await endl ();
        }
    }
    
    return '';
};
const mediaMounted = (location = 'file:///sdcard') => 
    call (`shell am broadcast -a android.intent.action.MEDIA_MOUNTED -d ${location}`);
const mediaScanFile = (location) => 
    call (`shell am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d ${location}`);
const push = (from, to = '/sdcard/') => call (`push ${from} ${to}`)
const pull = (from, to = '') => call (`pull ${from} ${to}`);
const ls = (location = '/') => call (`shell ls ${location}`);
const rm = (location) => call (`shell rm ${location}`);
const rmrf = (location) => (location == '/' ? new Error ('forbidden to rm -rf /') : call (`shell rm -rf ${location}`));
const install = (location) => call (`install ${location}`);
const start = (packageName) => call (`shell monkey -p ${packageName} 1`);
const close = (packageName) => call (`shell am force-stop ${packageName}`);
const killServer = () => call (`kill-server`);
const startServer = () => call (`start-server`);
const restartServer = async () => {
    
    return await killServer () + '\n' + 
        await startServer ();
};
const tcpip = (port = 5555) => call (`tcpip ${port}`);
const connect = (address) => call (`connect ${address}`);
const disconnect = (address) => call (`disconnect ${address}`);
const screenshot = async (fileName = 's.png', localSavePath = '', androidSavePath = '/sdcard/') => {
    
    await call (`shell screencap -p ${androidSavePath}${fileName}`);
    await pull (`${androidSavePath}${fileName}`, `${localSavePath}${fileName}`);
    await rm (`${androidSavePath}${fileName}`);
    
    return fileName;
};

module.exports = {
    
    call,
    rawDevices,
    devices,
    touch,
    swipe,
    key,
    endl,
    back,
    home,
    menu,
    power,
    rawText,
    text,
    mediaMounted,
    mediaScanFile,
    push,
    pull,
    ls,
    rm,
    rmrf,
    install,
    start,
    close,
    killServer,
    startServer,
    restartServer,
    tcpip,
    connect,
    disconnect,
    screenshot,
    use,
    verbose,
};