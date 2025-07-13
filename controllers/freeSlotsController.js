const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.receiveSlotUpdate = catchAsync(async (req, res, next) => {
  const { parkingId, freeSlots } = req.body;
  if (!parkingId || freeSlots === undefined || freeSlots === null) {
    return next(new AppError('Missing parkingId or freeSlots', 400));
  }
  if (typeof freeSlots !== 'number' || freeSlots < 0) {
    return next(new AppError('freeSlots must be a non-negative number', 400));
  }
  const io = req.app.get('socketio');
  if (!io) {
    return next(new AppError('Socket.io not initialized', 500));
  }
  io.emit(`freeSlotsUpdate-${parkingId}`, {
    parkingId,
    freeSlots,
    timestamp: new Date().toISOString()
  });
  
  res.status(200).json({ 
    status: 'success',
    data: {
      parkingId,
      freeSlots,
      updated: true
    }
  });
});