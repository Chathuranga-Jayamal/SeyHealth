import zoomService from "../services/zoomService.js";

class zoomController {
  async createMeeting(req, res) {
    try {
      const { topic, startTime, duration, agenda } = req.body;

      if (!topic || !startTime || !duration || !agenda) {
        console.log("Missing required fields in request body", req.body);
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields.",
        });
      }
      console.log("Request body:", req.body);

      const data = await zoomService.createZoomMeeting({
        topic,
        startTime,
        duration,
        agenda,
      });

      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async updateMeeting(req, res) {
    try {
      const { id, topic, startTime, duration, agenda } = req.body;

      if (!id || !topic || !startTime || !duration || !agenda) {
        console.log("Missing required fields in request body", req.body);
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields.",
        });
      }
      const data = await zoomService.updateZoomMeeting(id, req.body);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteMeeting(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        console.log("Missing required fields in request body", req.body);
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields.",
        });
      }
      const data = await zoomService.deleteZoomMeeting(id);
      res
        .status(200)
        .json({ success: true, message: "Meeting deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new zoomController();
