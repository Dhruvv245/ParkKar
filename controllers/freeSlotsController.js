const { spawn } = require('child_process');

exports.updateFreeSlots = (req, res, next) => {
  const parkingScripts = {
    '5c88fa8cf4afda39709c2974': '/parking-python/cb.py',
    '5c88fa8cf4afda39709c2970': '/parking-python/chemcounter.py',
    '661661e96104b67c07d092ec': '/parking-python/workshopcounter.py',
    '66166ae48406964c3e58c871': '/parking-python/kbhcounter.py',
  };

  const parking = req.params.id;
  const pythonScriptPath = __dirname + parkingScripts[parking];
  const pythonProcess = spawn('python', ['-u',pythonScriptPath]);
  const io = req.app.get('socketio');

  pythonProcess.stdout.on('data', (data) => {
    const freeSlots = parseInt(data, 10);
    if (!isNaN(freeSlots)) {
      io.emit('freeSlotsUpdate', freeSlots);
    } else {
      console.log(`Invalid data from python script`);
    }
  });
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });
  next();
};
