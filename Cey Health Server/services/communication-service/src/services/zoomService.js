import axios from "axios";
import env from "dotenv";
env.config({ path: "../.env" });

class zoomService {
  constructor() {
    this.accessToken = process.env.ZOOM_ACCESS_TOKEN;
  }

  async createZoomMeeting({ topic, startTime, duration, agenda }) {
    try {
      const response = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        {
          topic,
          type: 2, // Scheduled meeting
          start_time: startTime,
          duration,
          agenda,
          settings: {
            join_before_host: true,
            approval_type: 0,
            registration_type: 1,
            mute_upon_entry: true,
            host_video: true,
            participant_video: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // contains join_url, meeting ID, etc.
    } catch (error) {
      console.error(
        "Error creating Zoom meeting:",
        error.response?.data || error
      );
      throw error;
    }
  }

  async updateZoomMeeting(meetingId, updatedData) {
    try {
      await axios.patch(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, updatedData };
    } catch (error) {
      console.error(
        "Error updating Zoom meeting:",
        error.response?.data || error
      );
      throw error;
    }
  }

  async deleteZoomMeeting(meetingId) {
    try {
      await axios.delete(`https://api.zoom.us/v2/meetings/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return { success: true };
    } catch (error) {
      console.error(
        "Error deleting Zoom meeting:",
        error.response?.data || error
      );
      throw error;
    }
  }
}
export default new zoomService();
