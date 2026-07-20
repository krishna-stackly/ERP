// // import React, { useEffect, useState } from "react";
// // import "./dashboard.css";
// // import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   ResponsiveContainer,
// // } from "recharts";

// // export default function Dashboard() {
// //   const [taskData, setTaskData] = useState(null);
// //   const [attendanceData, setAttendanceData] = useState(null);
// //   const [pieData, setPieData] = useState([
// //     { name: "Not Started", value: 0 },
// //     { name: "In Progress", value: 0 },
// //     { name: "Completed", value: 0 },
// //     {
// //       name: "Awaiting Feedback",
// //       value: 0,
// //     },
// //   ]);
// //   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// //   useEffect(() => {
// //     if (Object.keys(taskDataFromAPI).length > 0) {
// //       setTaskData(taskDataFromAPI);
// //     }
// //     if (Object.keys(attendanceDataFromApi).length > 0) {
// //       setAttendanceData(attendanceDataFromApi);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (taskData) {
// //       setPieData([
// //         { name: "Not Started", value: taskData.taskSummary.not_started },
// //         { name: "In Progress", value: taskData.taskSummary.in_progress },
// //         { name: "Completed", value: taskData.taskSummary.completed },
// //         {
// //           name: "Awaiting Feedback",
// //           value: taskData.taskSummary.awaiting_feedback,
// //         },
// //       ]);
// //     }
// //     if (attendanceData) {
// //       setAttendanceData(attendanceData.dateData);
// //     }
// //   }, [taskData]);

// //   const taskDataFromAPI = {
// //     taskData: [
// //       {
// //         taskId: 0,
// //         name: "ERC",
// //         status: "In Progress",
// //         start_date: "Sat Feb 01 2025 09:00:00 GMT+0530 (India Standard Time)",
// //         due_date: "Sat Feb 01 2025 09:00:00 GMT+0530 (India Standard Time)",
// //         assigned_to: "kamal",
// //         priority: "high",
// //       },
// //       {
// //         taskId: 1,
// //         name: "ESC",
// //         status: "In Progress",
// //         start_date: "Sat Feb 01 2025 09:00:00 GMT+0530 (India Standard Time)",
// //         due_date: "Sat Feb 01 2025 09:00:00 GMT+0530 (India Standard Time)",
// //         assigned_to: "kamal",
// //         priority: "high",
// //       },
// //     ],
// //     taskSummary: {
// //       not_started: 2,
// //       in_progress: 2,
// //       completed: 1,
// //       awaiting_feedback: 3,
// //     },
// //   };

// //   const attendanceDataFromApi = {
// //     dateData: [
// //       { name: "Jan", present: 12, absent: 8 },
// //       { name: "Feb", present: 20, absent: 2 },
// //       { name: "Mar", present: 6, absent: 1 },
// //       { name: "Apr", present: 12, absent: 8 },
// //       { name: "May", present: 20, absent: 2 },
// //       { name: "Jun", present: 6, absent: 1 },
// //       { name: "Jul", present: 12, absent: 8 },
// //       { name: "Aug", present: 20, absent: 2 },
// //       { name: "Sep", present: 6, absent: 1 },
// //       { name: "Oct", present: 12, absent: 8 },
// //       { name: "Nov", present: 20, absent: 2 },
// //       { name: "Dec", present: 6, absent: 1 },
// //     ],
// //   };

// //   return (
// //     <div className="dashboard">
// //       <h2>Dashboard</h2>

// //       <div className="charts-container">
// //         {/* Pie Chart */}
// //         <div className="chart">
// //           <h2>Task</h2>
// //           <ResponsiveContainer width="100%" height={350}>
// //             <PieChart>
// //               <Pie
// //                 data={pieData}
// //                 cx="50%"
// //                 cy="50%"
// //                 outerRadius="80%"
// //                 fill="#8884d8"
// //                 dataKey="value"
// //                 label
// //               >
// //                 {pieData.map((entry, index) => (
// //                   <Cell
// //                     key={`cell-${index}`}
// //                     fill={COLORS[index % COLORS.length]}
// //                   />
// //                 ))}
// //               </Pie>
// //               <Tooltip />
// //               <Legend />
// //             </PieChart>
// //           </ResponsiveContainer>
// //         </div>

// //         {/* Bar Chart */}
// //         <div className="chart">
// //           <h2>Attendance</h2>
// //           <ResponsiveContainer height={350}>
// //             <BarChart
// //               data={attendanceData}
// //               margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
// //             >
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="name" />
// //               <YAxis />
// //               <Tooltip />
// //               <Legend />
// //               <Bar dataKey="present" fill="#8884d8" />
// //               <Bar dataKey="absent" fill="#82ca9d" />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import "./dashboard.css";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import useDashboardStore from "./dashboardStore"; // ✅ Adjust path as needed
// import ProtectedRoute from "../../utills/Protected";

// export default function Dashboard() {
//   const { dashboardData, loading, fetchDashboard } = useDashboardStore();
//   const [pieData, setPieData] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//   // ✅ Fetch dashboard data on component mount
//   useEffect(() => {
//     fetchDashboard();
//   }, [fetchDashboard]);

//   // ✅ Prepare chart data after dashboardData updates
//   useEffect(() => {
//     if (dashboardData?.tasks?.taskSummary) {
//       const summary = dashboardData.tasks.taskSummary;
//       setPieData([
//         { name: "Not Started", value: summary.not_started },
//         { name: "In Progress", value: summary.in_progress },
//         { name: "Completed", value: summary.completed },
//         { name: "Awaiting Feedback", value: summary.awaiting_feedback },
//       ]);
//     }

//     if (dashboardData?.attendance) {
//       const formattedAttendance = dashboardData.attendance.map((item) => ({
//         name: item.month,
//         present: item.present,
//         absent: item.absent,
//       }));
//       setAttendanceData(formattedAttendance);
//     }
//   }, [dashboardData]);

//   return (
//     <ProtectedRoute>
//     <div className="dashboard">
//       <h2>Dashboard</h2>

//       {loading && <p>Loading data...</p>}

//       {!loading && dashboardData && (
//         <div className="charts-container">
//           {/* Task Status Pie Chart */}
//           <div className="chart">
//             <h2>Task Status</h2>
//             <ResponsiveContainer width="100%" height={350}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius="80%"
//                   fill="#8884d8"
//                   dataKey="value"
//                   label
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Attendance Overview Bar Chart */}
//           <div className="chart">
//             <h2>Attendance Overview</h2>
//             <ResponsiveContainer height={350}>
//               <BarChart
//                 data={attendanceData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="present" fill="#4CAF50" />
//                 <Bar dataKey="absent" fill="#F44336" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       )}
//     </div>
//     </ProtectedRoute>
//   );
// }

import React, { useEffect, useState } from "react";
import "./dashboard.css";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import useDashboardStore from "./dashboardStore";
import ProtectedRoute from "../../utills/Protected";
import { useLocation,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


// ── Dummy fallbacks ────────────────────────────────────────────────────────────
const DUMMY_PIE = [
  { name: "Not Started",      value: 4 },
  { name: "In Progress",      value: 6 },
  { name: "Completed",        value: 8 },
  { name: "Awaiting Feedback",value: 2 },
];

const DUMMY_ATTENDANCE = [
  { name: "Jan", present: 18, absent: 3 },
  { name: "Feb", present: 20, absent: 2 },
  { name: "Mar", present: 15, absent: 6 },
  { name: "Apr", present: 22, absent: 1 },
  { name: "May", present: 17, absent: 4 },
  { name: "Jun", present: 21, absent: 2 },
  { name: "Jul", present: 19, absent: 3 },
  { name: "Aug", present: 20, absent: 2 },
  { name: "Sep", present: 16, absent: 5 },
  { name: "Oct", present: 23, absent: 1 },
  { name: "Nov", present: 18, absent: 3 },
  { name: "Dec", present: 14, absent: 7 },
];
// ──────────────────────────────────────────────────────────────────────────────

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

/** Returns true when every value in the summary is 0 */
const isTaskSummaryEmpty = (summary) =>
  summary &&
  summary.not_started === 0 &&
  summary.in_progress === 0 &&
  summary.completed === 0 &&
  summary.awaiting_feedback === 0;

/** Returns true when every month has 0 present and 0 absent */
const isAttendanceEmpty = (attendance) =>
  attendance?.every((m) => m.present === 0 && m.absent === 0);

export default function Dashboard() {
  const { dashboardData, loading, fetchDashboard } = useDashboardStore();
  const [pieData, setPieData]             = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [usingDummyPie, setUsingDummyPie]             = useState(false);
  const [usingDummyAttendance, setUsingDummyAttendance] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

 

useEffect(() => {
  if (location.state?.justLoggedIn) {
    toast.success("Signed in successfully!");
    navigate("/dashboard", { replace: true, state: {} }); // ✅ clears via React Router
  }
}, []);

  useEffect(() => {
    if (!dashboardData) return;

    // ── Task / Pie ─────────────────────────────────────────────────────────
    const summary = dashboardData?.tasks?.taskSummary;

    if (isTaskSummaryEmpty(summary)) {
      setPieData(DUMMY_PIE);
      setUsingDummyPie(true);
    } else {
      setPieData([
        { name: "Not Started",       value: summary.not_started },
        { name: "In Progress",       value: summary.in_progress },
        { name: "Completed",         value: summary.completed },
        { name: "Awaiting Feedback", value: summary.awaiting_feedback },
      ]);
      setUsingDummyPie(false);
    }

    // ── Attendance / Bar ───────────────────────────────────────────────────
    const attendance = dashboardData?.attendance;

    if (isAttendanceEmpty(attendance)) {
      setAttendanceData(DUMMY_ATTENDANCE);
      setUsingDummyAttendance(true);
    } else {
      setAttendanceData(
        attendance.map((item) => ({
          name:    item.month,
          present: item.present,
          absent:  item.absent,
        }))
      );
      setUsingDummyAttendance(false);
    }
  }, [dashboardData]);

  return (
    <ProtectedRoute>
      <div className="dashboard">
        <h2>Dashboard</h2>

        {loading && <p>Loading data...</p>}

        {!loading && dashboardData && (
          <div className="charts-container">

            {/* ── Task Status Pie Chart ── */}
            <div className="chart">
              <h2>
                Task Status
                {usingDummyPie && (
                  <span className="dummy-badge"> (sample data)</span>
                )}
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ── Attendance Overview Bar Chart ── */}
            <div className="chart">
              <h2>
                Attendance Overview
                {usingDummyAttendance && (
                  <span className="dummy-badge"> (sample data)</span>
                )}
              </h2>
              <ResponsiveContainer height={350}>
                <BarChart
                  data={attendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#4CAF50" />
                  <Bar dataKey="absent"  fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}