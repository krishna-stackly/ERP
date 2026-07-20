// import { Select } from "@mantine/core";
// import { ClassValue, clsx } from "clsx";
// import * as ExcelJS from "exceljs";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { default as Moment, default as moment } from "moment";
// import { twMerge } from "tailwind-merge";

export const API_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = import.meta.env.VITE_BASE_URL;


// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// export function allowOnlyText(
//   event: React.KeyboardEvent<HTMLInputElement>
// ): void {
//   const pattern = /^[A-Za-z\s]+$/;
//   if (!pattern.test(event.key)) {
//     event.preventDefault();
//   }
// }

// export function dateFormatter(date: string | null) {
//   if (date === null || date?.length <= 0) {
//     return "None";
//   } else {
//     return Moment(date).format("DD MMMM YYYY, h:mm a");
//   }
// }

// export function pickInitials(fullName: string) {
//   // Split the full name into an array of words
//   const nameArray = fullName.split(" ");

//   // Check if the name is empty or null
//   if (nameArray.length === 0 || fullName.trim() === "") {
//     return "";
//   }

//   // Initialize an empty string to store initials
//   let initials = "";

//   // Loop through each part of the name to pick the first letter
//   for (let i = 0; i < nameArray.length; i++) {
//     if (nameArray[i]) {
//       // Check if the part is not an empty string
//       initials += nameArray[i][0];
//     }
//   }

//   return initials;
// }

// /**
//  * Function to allow only numeric input and prevent '.' and 'e' characters.
//  * @param {Event} event - The keyboard event object.
//  * @returns {void}
//  */
// export function allowOnlyNumbers(event: any): void {
//   if (
//     event.key === "." ||
//     event.key === "e" ||
//     event.key === "E" ||
//     event.key === "+" ||
//     event.key === "-"
//   ) {
//     event.preventDefault();
//   }
// }

// export function isWithin48Hours(
//   fromDate: string,
//   toDate: string,
//   fromTime: string,
//   toTime: string
// ): [boolean, string?] {
//   const formatedFromDate = moment(fromDate).format("YYYY-MM-DD");
//   const formatedToDate = moment(toDate).format("YYYY-MM-DD");
//   const startStr = `${formatedFromDate} ${fromTime}`;
//   const endStr = `${formatedToDate} ${toTime}`;
//   try {
//     const startTime = moment(startStr, "YYYY-MM-DD hh:mm A");
//     const endTime = moment(endStr, "YYYY-MM-DD hh:mm A");
//     if (!startTime.isValid() || !endTime.isValid()) {
//       return [false, "Invalid date or time"];
//     }
//     const duration = endTime.diff(startTime, "hours");
//     if (duration <= 48) {
//       return [true];
//     } else {
//       const errorMessage = "Offline access validity must be within 48 hours";
//       return [false, errorMessage];
//     }
//   } catch (error) {
//     const errorMessage = "An unexpected error occurred";
//     return [false, errorMessage];
//   }
// }

// const TimeInputWithInterval: React.FC<any> = ({
//   form,
//   fieldName,
//   ...selectProps
// }) => {
//   // Generate time options in 30-minute intervals with 12-hour format and AM/PM
//   const generateTimeOptions = (): { value: string; label: string }[] => {
//     const times = [];
//     const intervalGap = 30;
//     for (let hour = 0; hour < 24; hour++) {
//       for (let minute = 0; minute < 60; minute += intervalGap) {
//         const period = hour < 12 ? "AM" : "PM";
//         const hour12 = hour % 12 === 0 ? 12 : hour % 12;
//         const timeString = `${String(hour12).padStart(2, "0")}:${String(
//           minute
//         ).padStart(2, "0")} ${period}`;
//         times.push({ value: timeString, label: timeString });
//       }
//     }
//     return times;
//   };

//   const timeOptions = generateTimeOptions();

//   return (
//     <Select
//       {...form.getInputProps(fieldName)}
//       data={timeOptions}
//       placeholder="Select Time"
//       searchable
//       comboboxProps={{
//         position: "bottom",
//         middlewares: { flip: false, shift: false },
//       }}
//       {...selectProps}
//     />
//   );
// };

// export default TimeInputWithInterval;

// export function convertTo24Hour(time: string): string {
//   let [hours, minutesPart] = time.split(":");
//   let minutes = minutesPart.slice(0, 2);
//   const period = minutesPart.slice(2).trim().toUpperCase();

//   if (period === "AM" && hours === "12") {
//     hours = "00";
//   } else if (period === "PM" && hours !== "12") {
//     hours = (parseInt(hours, 10) + 12).toString();
//   }

//   if (hours.length < 2) {
//     hours = "0" + hours;
//   }

//   return `${hours}:${minutes}`;
// }

// const convertToFilenameFormat = (name: string) => {
//   return name.toLowerCase().replace(/\s+/g, "-");
// };

// export const generatePdf = (
//   doc: jsPDF,
//   title: string,
//   header: string[],
//   content: any
// ) => {
//   const pageWidth = doc.internal.pageSize.width;
//   doc.setLineWidth(1.5);
//   doc.line(40, 90, pageWidth - 40, 90);
//   doc.setFontSize(22);
//   doc.setFont("helvetica", "bold");
//   doc.text(title, pageWidth / 2, 50, { align: "center" });
//   autoTable(doc, {
//     margin: {
//       top: 115,
//     },
//     head: [header],
//     body: content,
//     headStyles: {
//       fillColor: [103, 214, 254],
//       textColor: [255, 255, 255],
//       lineWidth: 0.75,
//       lineColor: [213, 213, 213],
//     },
//     bodyStyles: {
//       lineWidth: 0.75,
//       lineColor: [213, 213, 213],
//       fillColor: [255, 255, 255],
//     },
//   });
//   doc.save(`${convertToFilenameFormat(title)}.pdf`);
// };

// export const generateExcel = async (
//   title: string,
//   head: string[],
//   content: any
// ) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet(title);
//   // Add header row with styles
//   const headerRow = worksheet.addRow(head);
//   head.forEach((header, index) => {
//     const column = worksheet.getColumn(index + 1);
//     const cell = headerRow.getCell(index + 1);
//     if (header) {
//       cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Bold and white text
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "67D6FE" }, // Background color
//       };
//     }
//     // Setting column width based on header content
//     const minWidth = 10; // Minimum width for readability
//     const headerLength = header.length || 0; // Fallback to 0 if header is empty
//     column.width = header ? Math.max(minWidth, headerLength + 3) : minWidth; // Adjust for padding
//   });
//   // Add data to the worksheet
//   worksheet.addRows(content);
//   // Create a buffer for the workbook
//   const buffer = await workbook.xlsx.writeBuffer();
//   // Create a Blob from the buffer
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   // Create a download link and trigger the download
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `${convertToFilenameFormat(title)}.xlsx`;
//   a.click();
//   window.URL.revokeObjectURL(url);
// };
