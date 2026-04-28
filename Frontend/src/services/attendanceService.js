import axiosClient from "../config/axios";

const attendanceService = {
  markAttendance: async (userId) => {
    try {
      console.log("Marking attendance for userId:", userId);
      const response = await axiosClient.post("/attendance/mark", { userId });
      console.log("Attendance marked response:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network Error" };
    }
  },
  fetchAttendance: async () => {
    try {
      const response = await axiosClient.get("/attendance/fetch");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network Error" };
    } 
  },
  fetchAttendanceForAllUsers: async (date) => {
    try {
      const response = await axiosClient.get("/attendance/fetch-all", {
        params: { date },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Network Error" };
    } 
  },  
};

export default attendanceService;