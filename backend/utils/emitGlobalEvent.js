const emitGlobalEvent = (req, event, action, data) => {
  try {
    const io = req.app.get("io");

    if (!io) {
      console.warn("⚠️ Socket.IO not initialized");
      return;
    }

    io.emit(event, {
      action,        // create | update | delete | discharge | restore
      data,          // payload
      timestamp: Date.now()
    });

  } catch (error) {
    console.error("❌ Socket emit error:", error.message);
  }
};

module.exports = emitGlobalEvent;
