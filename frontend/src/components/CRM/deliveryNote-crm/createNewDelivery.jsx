// import React, { useState, useEffect } from "react";
// import "./createNewDelivery.css";
// import DeliveryListItems from "./deliveryListItems";
// import CreateNewDeliveryProofAttachment from "./createNewDeliveryProofAttachment";
// import CreateNewDeliverySerialNum from "./createNewDeliverySerialNum";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export default function createNewDelivery() {
//   const [deliveryStatus, setDeliveryStatus] = useState("");
//   const prevpg = useNavigate();
//   //serial num in delivery list page
//   const [showSerial, setShowSerial] = useState(false);

//   const [numOfDeliveryList, setnumOfDeliveryList] = useState(1);
//   const [DeliveryList_data, setDeliveryList_data] = useState([
//     { unique_key: 0 },
//   ]);

//   const [ApiDelivery, setApiDelivery] = useState({});
//   const [deliveryData, setDeliveryData] = useState([]);

//   const deliveryFromApi = {
//     deliveryData: [
//       {
//         sales_module_status: "Partially Delivered",
//         dn_id: "DN-001",
//         delivery_date: "2025-07-15",
//         sales_order_ref: "SD-001",
//         customer_name: "Jon",
//         destination_address: "Abc colony, X city,Y..",
//         delivery_table_data: [
//           {
//             product_name: "E-shirt",
//             product_id: "PRO001",
//             Quantity: "10",
//             umo: "PSC",
//             serial_num: "Completed",
//           },
//           {
//             product_name: "chock",
//             product_id: "PRO005",
//             Quantity: "15",
//             umo: "PSC",
//             serial_num: "Incompleted",
//           },
//         ],
//       },
//       {
//         sales_module_status: "Delivered",
//         dn_id: "DN-002",
//         delivery_date: "2025-06-15",
//         sales_order_ref: "SD-002",
//         customer_name: "Jon",
//         destination_address: "Abc colony, X city,Y..",
//         delivery_table_data: [
//           {
//             product_name: "E-shirt",
//             product_id: "PRO001",
//             Quantity: "10",
//             umo: "PSC",
//             serial_num: "Incompleted",
//           },
//           {
//             product_name: "Pen",
//             product_id: "PRO005",
//             Quantity: "10",
//             umo: "PSC",
//             serial_num: "",
//           },
//         ],
//       },
//       {
//         sales_module_status: "Partially Delivered",
//         dn_id: "DN-003",
//         delivery_date: "2025-06-15",
//         sales_order_ref: "SD-003",
//         customer_name: "Jon",
//         destination_address: "Abc colony, X city,Y..",
//         delivery_table_data: [
//           {
//             product_name: "E-shirt",
//             product_id: "PRO001",
//             Quantity: "10",
//             umo: "PSC",
//             serial_num: "",
//           },
//         ],
//       },
//     ],
//   };
//   const [deliveryInput, setDeliveryInput] = useState({
//     dn_id: "",
//     delivery_date: "",
//     sales_order_ref: "",
//     customer_name: "",
//     delivery_type: "",
//     destination_address: "",
//     delivery_by: "",
//     vehicle_no: "",
//     tracking_id: "",
//     delivery_notes: "",
//     received_by: "",
//     contact_number: "",
//   });

//   useEffect(() => {
//     setApiDelivery(deliveryFromApi);
//   }, []);
//   useEffect(() => {
//     if (Object.keys(ApiDelivery).length > 0) {
//       setDeliveryData(ApiDelivery.deliveryData);
//     }
//   }, [ApiDelivery]);

//   useEffect(() => {
//     const selected = deliveryInput.sales_order_ref;

//     if (!selected) {
//       setDeliveryInput({
//         delivery_date: "",
//         sales_order_ref: "",
//         customer_name: "",
//         destination_address: "",
//       });
//       setnumOfDeliveryList(0);
//       return;
//     }

//     const refID = deliveryData.find((ele) => ele.sales_order_ref === selected);

//     if (refID) {
//       setDeliveryInput((prev) => ({
//         ...prev,
//         delivery_date: refID.delivery_date,
//         sales_order_ref: refID.sales_order_ref,
//         customer_name: refID.customer_name,
//         destination_address: refID.destination_address,
//       }));
//       setnumOfDeliveryList(refID.delivery_table_data.length);
//     }
//   }, [deliveryInput.sales_order_ref, deliveryData]);

//   const handleDeliveryInpChange = (e) => {
//     setDeliveryInput((prev) => {
//       return { ...prev, [e.target.id]: e.target.value };
//     });
//   };

//   //status
//   const [deliveryBtn, setDeliveryBtn] = useState({
//     BtnAccess: false,
//     delivery_return: true,
//     customerACK: true,
//     cancel_dn: true,
//     save_draft: false,
//     submit_dn: false,
//     pdf: true,
//     email: true,
//   });
//   useEffect(() => {
//     if (deliveryStatus === "") {
//       setDeliveryBtn((prev) => ({ ...prev, BtnAccess: false }));
//       return;
//     }

//     switch (deliveryStatus) {
//       case "Draft":
//         setDeliveryBtn((prev) => ({
//           ...prev,
//           BtnAccess: false,
//           customerACK: true,
//           cancel_dn: true,
//           save_draft: false,
//           submit_dn: false,
//           pdf: false,
//           email: false,
//         }));
//         break;

//       case "Partially Delivered":
//         setDeliveryBtn((prev) => ({
//           ...prev,
//           delivery_return: false,
//           BtnAccess: true,
//           customerACK: false,
//           cancel_dn: false,
//           save_draft: true,
//           submit_dn: true,
//           pdf: false,
//           email: false,
//         }));
//         break;

//       case "Delivered":
//         setDeliveryBtn((prev) => ({
//           ...prev,
//           delivery_return: false,
//           BtnAccess: true,
//           customerACK: false,
//           cancel_dn: false,
//           save_draft: true,
//           submit_dn: true,
//           pdf: false,
//           email: false,
//         }));
//         break;

//       case "Cancelled":
//         setDeliveryBtn((prev) => ({
//           ...prev,
//           delivery_return: true,
//           BtnAccess: true,
//           customerACK: true,
//           cancel_dn: true,
//           save_draft: true,
//           submit_dn: true,
//           pdf: false,
//           email: false,
//         }));
//         break;

//       default:
//         setDeliveryBtn((prev) => ({
//           ...prev,
//           BtnAccess: false,
//           delivery_return: true,
//         }));
//     }
//   }, [deliveryStatus]);

//   const handleDraftState = (e) => {
//     e.preventDefault();
//     setDeliveryStatus("Draft");
//     toast.success("Delivery Item in Draft State");
//   };
//   const handleSubmitDNState = (e) => {
//     e.preventDefault();

//     const selectedRef = deliveryInput.sales_order_ref;

//     const matchedItem = deliveryData.find(
//       (item) => item.sales_order_ref === selectedRef
//     );

//     if (matchedItem) {
//       setDeliveryStatus(matchedItem.sales_module_status);
//       toast.success(
//         `Delivery Item in ${matchedItem.sales_module_status} State`
//       );
//     } else {
//       toast.error("Selected delivery reference not found.");
//     }
//   };

//   const handleCancelDNState = (e) => {
//     e.preventDefault();
//     const okCancel = window.confirm("Are you sure you want to Cancer Order ?");
//     if (okCancel) {
//       setDeliveryStatus("Cancelled");
//       toast.success("Delivery Item in Cancelled State");
//     }
//   };
//   const ACKformData = (e) => {
//     e.preventDefault();
//     // setDeliveryData();
//     toast.success("Customer Acknowledgement is Updated Successfully");
//   };
//   //delete salese product
//   function deleteDeliveryProduct(ind) {
//     const okDel = window.confirm(
//       "Are you sure you want to delete this Product?"
//     );
//     if (okDel) {
//       setDeliveryList_data((prev) => prev.filter((_, index) => index !== ind));
//       setnumOfDeliveryList((prev) => prev - 1);
//       toast.success("Product Item deleted!");
//     }
//   }
//   // console.log(DeliveryList_data);
//   console.log(deliveryInput);

//   return (
//     <>
//       {showSerial && (
//         <div className="createNewDelivery-serialBtn">
//           <CreateNewDeliverySerialNum setShowSerial={setShowSerial} />
//         </div>
//       )}
//       <div
//         className={`createNewDelivery-container ${
//           showSerial && "createNewDelivery-blur"
//         }`}
//       >
//         <form onSubmit={handleSubmitDNState}>
//           <div className="createNewDelivery-head">
//             <nav>
//               <p>New Delivery Note</p>
//               {deliveryStatus && (
//                 <h3
//                   className={
//                     deliveryStatus === "Draft"
//                       ? "createNewDelivery-Status-draft"
//                       : deliveryStatus === "Returned"
//                       ? "createNewDelivery-Status-Returned"
//                       : deliveryStatus === "Delivered"
//                       ? "createNewDelivery-Status-Delivered"
//                       : deliveryStatus === "Cancelled"
//                       ? "createNewDelivery-Status-Cancelled"
//                       : deliveryStatus === "Partially Delivered"
//                       ? "createNewDelivery-Status-partiallyDelivered"
//                       : ""
//                   }
//                 >
//                   Status: {deliveryStatus}
//                 </h3>
//               )}
//             </nav>
//             <div>
//               <button
//                 className={
//                   deliveryStatus === "Partially Delivered" ||
//                   deliveryStatus === "Delivered"
//                     ? "createNewDelivery-active-btn"
//                     : "createNewDelivery-inactive-btn"
//                 }
//                 disabled={deliveryBtn.delivery_return}
//               >
//                 Delivery Return
//               </button>
//               <nav
//                 className="createNewDelivery-close"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   prevpg(-1);
//                 }}
//               >
//                 <svg
//                   className="createNewDelivery-circle-x-logo"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 512 512"
//                 >
//                   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//                 </svg>
//                 <p>Close</p>
//               </nav>
//             </div>
//           </div>
//           <div className="createNewDelivery-input-container">
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="dn_id">DN ID {`(Auto Generate)`}</label>
//               <input
//                 id="dn_id"
//                 type="text"
//                 value={deliveryInput.dn_id}
//                 onChange={handleDeliveryInpChange}
//                 placeholder="Auto Generate"
//                 disabled
//               />
//             </div>
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="delivery_date">
//                 Delivery Date<sup>*</sup>
//               </label>
//               <input
//                 id="delivery_date"
//                 value={deliveryInput.delivery_date}
//                 onChange={handleDeliveryInpChange}
//                 type="date"
//                 disabled={deliveryBtn.BtnAccess}
//                 required
//               />
//             </div>
//           </div>
//           <div className="createNewDelivery-input-container">
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="sales_order_ref">
//                 Sales Order Reference<sup>*</sup>
//               </label>
//               <select
//                 id="sales_order_ref"
//                 value={deliveryInput.sales_order_ref}
//                 onChange={handleDeliveryInpChange}
//                 disabled={deliveryBtn.BtnAccess}
//                 required
//               >
//                 <option value="">Select Order Reference</option>
//                 {deliveryData.map((ele, ind) => (
//                   <option key={ind} value={ele.sales_order_ref}>
//                     {ele.sales_order_ref}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="customer_name">
//                 Customer Name<sup>*</sup>
//               </label>
//               <input
//                 id="customer_name"
//                 value={deliveryInput.customer_name}
//                 onChange={handleDeliveryInpChange}
//                 type="text"
//                 placeholder="Enter Customer Name"
//                 disabled={deliveryBtn.BtnAccess}
//                 required
//               />
//             </div>
//           </div>
//           <div className="createNewDelivery-input-container">
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="delivery_type">
//                 Delivery Type<sup>*</sup>
//               </label>
//               <select
//                 id="delivery_type"
//                 value={deliveryInput.delivery_type}
//                 onChange={handleDeliveryInpChange}
//                 disabled={deliveryBtn.BtnAccess}
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="Regular">Regular</option>
//                 <option value="Urgent">Urgent</option>
//                 <option value="Return">Return</option>
//               </select>
//             </div>
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="destination_address">
//                 Destination Address<sup>*</sup>
//               </label>
//               <input
//                 type="text"
//                 value={deliveryInput.destination_address}
//                 onChange={handleDeliveryInpChange}
//                 id="destination_address"
//                 placeholder="Enter Destination Address"
//                 disabled={deliveryBtn.BtnAccess}
//                 required
//               />
//             </div>
//           </div>
//           <nav className="createNewDelivery-subtit">
//             Line Items<sup>*</sup>
//           </nav>
//           <div className="createNewDelivery-table-container">
//             <table>
//               <thead className="createNewDelivery-table-head">
//                 <tr>
//                   <th className="createNewDelivery-small-width">#</th>
//                   <th className="createNewDelivery-max-width">Product name</th>
//                   <th className="createNewDelivery-min-width">Product ID</th>
//                   <th>Quantity</th>
//                   <th>UOM</th>
//                   <th className="createNewDelivery-max-width">Serial No(s)</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="createNewDelivery-table-body">
//                 {[...Array(numOfDeliveryList)].map((ele, ind) => (
//                   <DeliveryListItems
//                     key={ind}
//                     unique_key={ind}
//                     setShowSerial={setShowSerial}
//                     deliveryInput={deliveryInput}
//                     //api data
//                     deliveryData={deliveryData}
//                     // functionality
//                     deleteDeliveryProduct={deleteDeliveryProduct}
//                     //button
//                     BtnAccess={deliveryBtn.BtnAccess}
//                   />
//                 ))}
//                 <tr>
//                   <td></td>
//                   <td>
//                     <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setDeliveryList_data((prev) => {
//                           return [...prev, { unique_key: numOfDeliveryList }];
//                         });
//                         setnumOfDeliveryList((prev) => ++prev);
//                       }}
//                       disabled={
//                         deliveryInput.sales_order_ref === ""
//                           ? true
//                           : deliveryBtn.BtnAccess
//                           ? true
//                           : false
//                       }
//                     >
//                       + Add Item
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//           <nav className="createNewDelivery-subtit">Delivery Logistics</nav>
//           <div className="createNewDelivery-input-container">
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="delivery_by">Delivered By</label>
//               <input
//                 id="delivery_by"
//                 value={deliveryInput.delivery_by}
//                 onChange={handleDeliveryInpChange}
//                 type="text"
//                 placeholder="Enter delivery agent/person’s name"
//                 disabled={deliveryBtn.BtnAccess}
//               />
//             </div>
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="delivery_status">Delivery Status</label>
//               <input
//                 id="delivery_status"
//                 value={deliveryStatus}
//                 type="text"
//                 placeholder="Delivery Status"
//                 disabled
//               />
//             </div>
//           </div>
//           <div className="createNewDelivery-input-container">
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="vehicle_no">Vehicle No</label>
//               <input
//                 id="vehicle_no"
//                 value={deliveryInput.vehicle_no}
//                 onChange={handleDeliveryInpChange}
//                 type="text"
//                 placeholder="Enter vehicle number"
//                 disabled={deliveryBtn.BtnAccess}
//               />
//             </div>
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="tracking_id">Tracking ID</label>
//               <input
//                 id="tracking_id"
//                 value={deliveryInput.tracking_id}
//                 onChange={handleDeliveryInpChange}
//                 type="text"
//                 placeholder="Enter Tracking ID"
//                 disabled={deliveryBtn.BtnAccess}
//               />
//             </div>
//           </div>
//           <div className="createNewDelivery-input-container">
//             <div className="createNewDelivery-input-box">
//               <label htmlFor="delivery_notes">Delivery Notes</label>
//               <input
//                 id="delivery_notes"
//                 value={deliveryInput.delivery_notes}
//                 onChange={handleDeliveryInpChange}
//                 type="text"
//                 placeholder="Enter Delivery notes"
//                 disabled={deliveryBtn.BtnAccess}
//               />
//             </div>
//           </div>
//           {(deliveryStatus === "Partially Delivered" ||
//             deliveryStatus === "Delivered") && (
//             <div className="createNewDelivery-ack-container">
//               <form onSubmit={ACKformData}>
//                 <div className="createNewDelivery-ack-head">
//                   <nav className="createNewDelivery-ack-subtit">
//                     Customer Acknowledgement
//                   </nav>
//                   <button
//                     className="createNewDelivery-active-btn"
//                     disabled={deliveryBtn.customerACK}
//                     onClick={(e) => e.preventDefault()}
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//                 <div className="createNewDelivery-input-container">
//                   <div className="createNewDelivery-input-box">
//                     <label htmlFor="received_by">Received By</label>
//                     <input
//                       id="received_by"
//                       value={deliveryInput.received_by}
//                       onChange={handleDeliveryInpChange}
//                       type="text"
//                       placeholder="Customer's name receiving goods"
//                       disabled={deliveryBtn.customerACK}
//                     />
//                   </div>
//                   <div className="createNewDelivery-input-box">
//                     <label htmlFor="contact_number">Contact Number</label>
//                     <input
//                       id="contact_number"
//                       value={deliveryInput.contact_number}
//                       onChange={handleDeliveryInpChange}
//                       type="text"
//                       placeholder="Enter Contact number"
//                       disabled={deliveryBtn.customerACK}
//                     />
//                   </div>
//                 </div>
//                 <div className="createNewDelivery-input-container">
//                   <div className="createNewDelivery-input-box">
//                     <label>Proof of Delivery (POD) </label>
//                     <div className="createNewDelivery-ack-proof-container">
//                       <CreateNewDeliveryProofAttachment
//                         BtnAccess={deliveryBtn.customerACK}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           )}

//           <div className="createNewDelivery-btn-container">
//             <button
//               className={
//                 deliveryStatus === "Partially Delivered" ||
//                 deliveryStatus === "Delivered"
//                   ? "createNewDelivery-order-active-btn"
//                   : "createNewDelivery-inactive-btn"
//               }
//               onClick={handleCancelDNState}
//               disabled={deliveryBtn.cancel_dn}
//             >
//               {deliveryStatus === "Cancelled" ? "Cancelled" : "Cancel DN"}
//             </button>
//             <nav>
//               <button
//                 className="createNewDelivery-cancel-btn"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   prevpg(-1);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className={
//                   deliveryStatus === "" || deliveryStatus === "Draft"
//                     ? "createNewDelivery-active-btn"
//                     : "createNewDelivery-completed-btn "
//                 }
//                 onClick={handleDraftState}
//                 disabled={deliveryBtn.save_draft}
//               >
//                 Save Draft
//               </button>
//               <button
//                 className={
//                   deliveryStatus === "" || deliveryStatus === "Draft"
//                     ? "createNewDelivery-active-btn"
//                     : "createNewDelivery-completed-btn "
//                 }
//                 disabled={deliveryBtn.submit_dn}
//               >
//                 {deliveryStatus === "Partially Delivered" ||
//                 deliveryStatus === "Delivered"
//                   ? "Submitted (DN)"
//                   : "Submit (DN)"}
//               </button>
//               <svg
//                 disabled={deliveryBtn.pdf}
//                 className={
//                   deliveryStatus === ""
//                     ? "createNewDelivery-pdf-mail-futurelogo"
//                     : "createNewDelivery-pdf-mail-activelogo"
//                 }
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 22 24"
//                 fill="none"
//               >
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z"
//                 />
//               </svg>
//               <svg
//                 disabled={deliveryBtn.email}
//                 className={
//                   deliveryStatus === ""
//                     ? "createNewDelivery-pdf-mail-futurelogo"
//                     : "createNewDelivery-pdf-mail-activelogo"
//                 }
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 16"
//                 fill="none"
//               >
//                 <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
//               </svg>
//             </nav>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import "./createNewDelivery.css";
import DeliveryListItems from "./deliveryListItems";
import CreateNewDeliveryProofAttachment from "./createNewDeliveryProofAttachment";
import CreateNewDeliverySerialNum from "./createNewDeliverySerialNum";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import deliveryNoteApiProvider from "../../../network/deliveryNote-api-provider";

// ─── map API delivery note → flat form ───────────────────────────────────────
function mapNoteToForm(note) {
  if (!note || !Object.keys(note).length) return null;
  const c = note.customer || {};
  return {
    dn_id:               note.dn_id               || "",
    delivery_date:       note.delivery_date        || "",
    sales_order_id:      note.sales_order_id       || note.sales_order || "",
    sales_order_ref:     note.sales_order          || "",
    customer_name:       c.first_name
      ? `${c.first_name} ${c.last_name || ""}`.trim()
      : "",
    delivery_type:       note.delivery_type        || "",
    destination_address: note.destination_address  || "",
    delivery_by:         note.delivered_by         || "",
    vehicle_no:          note.vehicle_no           || "",
    tracking_id:         note.tracking_id          || "",
    delivery_notes:      note.delivery_notes       || "",
    received_by:         note.acknowledgement?.received_by    || "",
    contact_number:      note.acknowledgement?.contact_number || "",
  };
}

// ─── map API items → table rows ───────────────────────────────────────────────
function mapItemsToRows(items = []) {
  return items.map((item, index) => ({
    unique_key:         index,
    item_id:            item.id,
    product_id_num:     item.product,
    product_id:         item.product_id   || "",
    product_name:       item.product_name || "",
    quantity:           item.quantity     || 0,
    uom:                item.uom          || "",
    serial_numbers:     item.serial_numbers    || [],
    available_serials:  item.available_serials || [],
    serial_status:      item.serial_numbers?.length > 0 ? "Completed" : "Incompleted",
  }));
}

const emptyForm = {
  dn_id:               "",
  delivery_date:       "",
  sales_order_id:      "",
  sales_order_ref:     "",
  customer_name:       "",
  delivery_type:       "",
  destination_address: "",
  delivery_by:         "",
  vehicle_no:          "",
  tracking_id:         "",
  delivery_notes:      "",
  received_by:         "",
  contact_number:      "",
};

export default function CreateNewDelivery({
  setCurrentPage,
  editDeliveryData = {},
  isEdit = false,
}) {
  const isEditMode = isEdit && Object.keys(editDeliveryData).length > 0;
  const prevpg     = useNavigate();

  const [pageLoading,   setPageLoading]   = useState(isEditMode);
  const [isSaving,      setIsSaving]      = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [dbNoteId,      setDbNoteId]      = useState(
    isEditMode ? editDeliveryData.id || null : null
  );

  const [showSerial,    setShowSerial]    = useState(false);
  const [serialItemIndex, setSerialItemIndex] = useState(null);

  const [deliveryInput, setDeliveryInput] = useState(emptyForm);

  // line items
  const [DeliveryList_data, setDeliveryList_data] = useState([{ unique_key: 0 }]);
  const [numOfDeliveryList, setnumOfDeliveryList]  = useState(1);

  // dropdown: submitted sales orders
  const [salesOrders, setSalesOrders] = useState([]);

  // comments / history / attachments
  const [comments,    setComments]    = useState([]);
  const [history,     setHistory]     = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment,  setNewComment]  = useState("");

  const [deliveryBtn, setDeliveryBtn] = useState({
    BtnAccess:       false,
    delivery_return: true,
    customerACK:     true,
    cancel_dn:       true,
    save_draft:      false,
    submit_dn:       false,
    pdf:             true,
    email:           true,
  });

  // ─── apply full note object to state ────────────────────────────────────────
  function applyNoteToState(note) {
    const mapped = mapNoteToForm(note);
    if (!mapped) return;
    setDeliveryInput(mapped);
    setDeliveryStatus(note.status || "");
    setDbNoteId(note.id || null);
    setComments(note.comments    || []);
    setHistory(note.history      || []);
    setAttachments(note.attachments || []);

    if (note.items?.length > 0) {
      const rows = mapItemsToRows(note.items);
      setDeliveryList_data(rows);
      setnumOfDeliveryList(rows.length);
    } else {
      setDeliveryList_data([{ unique_key: 0 }]);
      setnumOfDeliveryList(1);
    }
  }

  // ─── ON MOUNT ────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      // fetch submitted sales orders for dropdown
      const orders = await deliveryNoteApiProvider.fetchSubmittedSalesOrders();
      setSalesOrders(orders);

      if (isEditMode) {
        const id = editDeliveryData.id;
        const detail = id
          ? await deliveryNoteApiProvider.fetchSingleDeliveryNote(id)
          : null;
        applyNoteToState(detail || editDeliveryData);
      }
      setPageLoading(false);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── autofill customer + address when SO selected ────────────────────────────
useEffect(() => {
  if (!deliveryInput.sales_order_id || isEditMode) return;

  const so = salesOrders.find(
    (o) => String(o.id) === String(deliveryInput.sales_order_id)
  );

  if (!so) return;

  const c = so.customer || {};
  const customerName = c.first_name
    ? `${c.first_name} ${c.last_name || ""}`.trim()
    : "";

  setDeliveryInput((prev) => ({
    ...prev,
    sales_order_ref:     so.sales_order_id || "",
    customer_name:       customerName,
    destination_address: c.shipping_address || c.billing_address || "",
  }));

  // ✅ populate rows from SO items
  if (so.items?.length > 0) {
    const rows = so.items.map((item, index) => ({
      unique_key:        index,
      item_id:           null,              // new item, no existing DN item id
      product_id_num:    item.product,      // numeric PK sent to API
      product_id:        item.product_id_display || "",
      product_name:      item.product_name  || "",
      quantity:          item.quantity      || 0,
      uom:               item.uom           || "—",
      serial_numbers:    [],
      available_serials: [],
      serial_status:     "",
    }));
    setDeliveryList_data(rows);
    setnumOfDeliveryList(rows.length);
  } else {
    // SO has no items — give one blank row
    setDeliveryList_data([{ unique_key: 0 }]);
    setnumOfDeliveryList(1);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [deliveryInput.sales_order_id]);

  // ─── button state ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (deliveryStatus === "") {
      setDeliveryBtn({
        BtnAccess: false, delivery_return: true, customerACK: true,
        cancel_dn: true, save_draft: false, submit_dn: false, pdf: true, email: true,
      });
      return;
    }
    switch (deliveryStatus) {
      case "Draft":
        setDeliveryBtn({
          BtnAccess: false, delivery_return: true, customerACK: true,
          cancel_dn: true, save_draft: false, submit_dn: false, pdf: false, email: false,
        });
        break;
      case "Submitted":
        setDeliveryBtn({
          BtnAccess: true, delivery_return: true, customerACK: false,
          cancel_dn: false, save_draft: true, submit_dn: true, pdf: false, email: false,
        });
        break;
      case "Partially Delivered":
        setDeliveryBtn({
          BtnAccess: true, delivery_return: false, customerACK: false,
          cancel_dn: false, save_draft: true, submit_dn: true, pdf: false, email: false,
        });
        break;
      case "Delivered":
        setDeliveryBtn({
          BtnAccess: true, delivery_return: false, customerACK: false,
          cancel_dn: false, save_draft: true, submit_dn: true, pdf: false, email: false,
        });
        break;
      case "Cancelled":
        setDeliveryBtn({
          BtnAccess: true, delivery_return: true, customerACK: true,
          cancel_dn: true, save_draft: true, submit_dn: true, pdf: false, email: false,
        });
        break;
      default:
        setDeliveryBtn((prev) => ({ ...prev, BtnAccess: false }));
    }
  }, [deliveryStatus]);

  const handleDeliveryInpChange = (e) => {
    setDeliveryInput((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // ─── build payload ────────────────────────────────────────────────────────────
  function buildPayload(status) {
    return {
      sales_order:         parseInt(deliveryInput.sales_order_id) || undefined,
      delivery_date:       deliveryInput.delivery_date       || null,
      delivery_type:       deliveryInput.delivery_type,
      destination_address: deliveryInput.destination_address,
      delivered_by:        deliveryInput.delivery_by,
      vehicle_no:          deliveryInput.vehicle_no,
      tracking_id:         deliveryInput.tracking_id,
      delivery_notes:      deliveryInput.delivery_notes,
      status:              status || undefined,
      items: DeliveryList_data
        .filter((r) => r.product_id_num || r.product)
        .map((row) => ({
          ...(row.item_id ? { id: parseInt(row.item_id) } : {}),
          product:        parseInt(row.product_id_num || row.product),
          quantity:       parseInt(row.quantity) || 0,
          serial_numbers: (row.serial_numbers || []).map((s) =>
            typeof s === "object" ? s : { serial_no: s }
          ),
        })),
    };
  }

  // ─── save draft ───────────────────────────────────────────────────────────────
  const handleDraftState = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = buildPayload("Draft");
      let result;
      if (dbNoteId) {
        result = await deliveryNoteApiProvider.updateDeliveryNote(dbNoteId, payload);
      } else {
        result = await deliveryNoteApiProvider.createDeliveryNote(payload);
        if (result?.id) setDbNoteId(result.id);
        if (result?.dn_id) setDeliveryInput((prev) => ({ ...prev, dn_id: result.dn_id }));
      }
      if (result) setDeliveryStatus("Draft");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── submit ───────────────────────────────────────────────────────────────────
  const handleSubmitDNState = async (e) => {
    e.preventDefault();
    if (!deliveryInput.sales_order_id && !isEditMode) {
      toast.error("Please select a Sales Order");
      return;
    }
    setIsSaving(true);
    try {
      let savedNote;
      if (dbNoteId) {
        savedNote = await deliveryNoteApiProvider.updateDeliveryNote(dbNoteId, buildPayload());
      } else {
        savedNote = await deliveryNoteApiProvider.createDeliveryNote(buildPayload());
        if (savedNote?.id) {
          setDbNoteId(savedNote.id);
          if (savedNote?.dn_id) setDeliveryInput((prev) => ({ ...prev, dn_id: savedNote.dn_id }));
        }
      }
      if (!savedNote) return;

      const actionRes = await deliveryNoteApiProvider.performAction(
        savedNote.id || dbNoteId, "submit"
      );
      if (actionRes) {
        const freshNote = await deliveryNoteApiProvider.fetchSingleDeliveryNote(
          savedNote.id || dbNoteId
        );
        if (freshNote) applyNoteToState(freshNote);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ─── cancel ───────────────────────────────────────────────────────────────────
  const handleCancelDNState = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to Cancel this Delivery Note?")) return;
    setIsSaving(true);
    try {
      if (dbNoteId) {
        const res = await deliveryNoteApiProvider.performAction(dbNoteId, "cancel_dn");
        if (res) setDeliveryStatus("Cancelled");
      } else {
        setDeliveryStatus("Cancelled");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ─── save acknowledgement ─────────────────────────────────────────────────────
  const handleSaveACK = async (e) => {
    e.preventDefault();
    if (!dbNoteId) { toast.error("Save the note first"); return; }
    setIsSaving(true);
    try {
      await deliveryNoteApiProvider.updateAcknowledgement(dbNoteId, {
        received_by:    deliveryInput.received_by,
        contact_number: deliveryInput.contact_number,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── add comment ──────────────────────────────────────────────────────────────
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!dbNoteId) { toast.error("Save the note first"); return; }
    const res = await deliveryNoteApiProvider.addComment(dbNoteId, newComment.trim());
    if (res) {
      setComments((prev) => [...prev, res]);
      setNewComment("");
    }
  };

  // ─── pdf & email ──────────────────────────────────────────────────────────────
  const handlePdf = async (e) => {
    e.preventDefault();
    if (!dbNoteId) return;
    await deliveryNoteApiProvider.downloadPDF(dbNoteId, deliveryInput.dn_id);
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!dbNoteId) return;
    await deliveryNoteApiProvider.sendEmail(dbNoteId);
  };

  // ─── delete product row ───────────────────────────────────────────────────────
  function deleteDeliveryProduct(ind) {
    if (!window.confirm("Are you sure you want to delete this Product?")) return;
    setDeliveryList_data((prev) => prev.filter((_, index) => index !== ind));
    setnumOfDeliveryList((prev) => prev - 1);
    toast.success("Product Item deleted!");
  }

  // ─── loading screen ───────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <p style={{ fontSize: "15px", color: "#888" }}>Loading delivery note…</p>
      </div>
    );
  }

  return (
    <>
      {showSerial && (
        <div className="createNewDelivery-serialBtn">
          <CreateNewDeliverySerialNum
            setShowSerial={setShowSerial}
            itemIndex={serialItemIndex}
            itemData={DeliveryList_data[serialItemIndex]}
            onConfirm={(index, selectedSerials) => {
              setDeliveryList_data((prev) =>
                prev.map((row, i) =>
                  i === index
                    ? { ...row, serial_numbers: selectedSerials, serial_status: "Completed" }
                    : row
                )
              );
              setShowSerial(false);
            }}
          />
        </div>
      )}

      <div className={`createNewDelivery-container ${showSerial ? "createNewDelivery-blur" : ""}`}>
        <form onSubmit={handleSubmitDNState}>

          {/* ── HEAD ─────────────────────────────────────────────────────── */}
          <div className="createNewDelivery-head">
            <nav>
              <p>{isEditMode ? (deliveryStatus === "Draft" ? "Edit Delivery Note" : "View Delivery Note") : "New Delivery Note"}</p>
              {deliveryStatus && (
                <h3 className={
                  deliveryStatus === "Draft"               ? "createNewDelivery-Status-draft"              :
                  deliveryStatus === "Submitted"           ? "createNewDelivery-Status-submitted"          :
                  deliveryStatus === "Delivered"           ? "createNewDelivery-Status-Delivered"          :
                  deliveryStatus === "Cancelled"           ? "createNewDelivery-Status-Cancelled"          :
                  deliveryStatus === "Partially Delivered" ? "createNewDelivery-Status-partiallyDelivered" :
                  deliveryStatus === "Returned"            ? "createNewDelivery-Status-Returned"           : ""
                }>
                  Status: {deliveryStatus}
                </h3>
              )}
            </nav>
            <div>
              <button
                className={
                  ["Partially Delivered", "Delivered"].includes(deliveryStatus)
                    ? "createNewDelivery-active-btn"
                    : "createNewDelivery-inactive-btn"
                }
                disabled={deliveryBtn.delivery_return}
                onClick={(e) => { e.preventDefault(); setCurrentPage("createNewDeliveryReturn"); }}
              >
                Delivery Return
              </button>
              <nav
                className="createNewDelivery-close"
                onClick={(e) => { e.preventDefault(); prevpg(-1); }}
              >
                <svg className="createNewDelivery-circle-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
                <p>Close</p>
              </nav>
            </div>
          </div>

          {/* ── BASIC INFO ───────────────────────────────────────────────── */}
          <div className="createNewDelivery-input-container">
            <div className="createNewDelivery-input-box">
              <label>DN ID (Auto Generate)</label>
              <input type="text" value={deliveryInput.dn_id} placeholder="Auto Generate" disabled />
            </div>
            <div className="createNewDelivery-input-box">
              <label htmlFor="delivery_date">Delivery Date<sup>*</sup></label>
              <input
                id="delivery_date"
                value={deliveryInput.delivery_date}
                onChange={handleDeliveryInpChange}
                type="date"
                disabled={deliveryBtn.BtnAccess}
                required
              />
            </div>
          </div>

          <div className="createNewDelivery-input-container">
            <div className="createNewDelivery-input-box">
              <label htmlFor="sales_order_id">Sales Order Reference<sup>*</sup></label>
              {isEditMode ? (
                <input
                  type="text"
                  value={deliveryInput.sales_order_ref}
                  disabled
                />
              ) : (
                <select
                  id="sales_order_id"
                  value={deliveryInput.sales_order_id}
                  onChange={handleDeliveryInpChange}
                  disabled={deliveryBtn.BtnAccess}
                  required
                >
                  <option value="">Select Sales Order</option>
                  {salesOrders.map((so) => (
                    <option key={so.id} value={so.id}>
                      {so.sales_order_id}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="createNewDelivery-input-box">
              <label htmlFor="customer_name">Customer Name<sup>*</sup></label>
              <input
                id="customer_name"
                value={deliveryInput.customer_name}
                onChange={handleDeliveryInpChange}
                type="text"
                placeholder="Auto-filled from Sales Order"
                disabled
              />
            </div>
          </div>

          <div className="createNewDelivery-input-container">
            <div className="createNewDelivery-input-box">
              <label htmlFor="delivery_type">Delivery Type<sup>*</sup></label>
              <select
                id="delivery_type"
                value={deliveryInput.delivery_type}
                onChange={handleDeliveryInpChange}
                disabled={deliveryBtn.BtnAccess}
                required
              >
                <option value="">Select Type</option>
                <option value="Regular">Regular</option>
                <option value="Urgent">Urgent</option>
                <option value="Return">Return</option>
              </select>
            </div>
            <div className="createNewDelivery-input-box">
              <label htmlFor="destination_address">Destination Address<sup>*</sup></label>
              <input
                id="destination_address"
                type="text"
                value={deliveryInput.destination_address}
                onChange={handleDeliveryInpChange}
                placeholder="Enter Destination Address"
                disabled={deliveryBtn.BtnAccess}
                required
              />
            </div>
          </div>

          {/* ── LINE ITEMS ───────────────────────────────────────────────── */}
          <nav className="createNewDelivery-subtit">Line Items<sup>*</sup></nav>
          <div className="createNewDelivery-table-container">
            <table>
              <thead className="createNewDelivery-table-head">
                <tr>
                  <th className="createNewDelivery-small-width">#</th>
                  <th className="createNewDelivery-max-width">Product Name</th>
                  <th className="createNewDelivery-min-width">Product ID</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th className="createNewDelivery-max-width">Serial No(s)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="createNewDelivery-table-body">
                {[...Array(numOfDeliveryList)].map((_, ind) => (
  <DeliveryListItems
    key={DeliveryList_data[ind]?.unique_key ?? ind}
    unique_key={ind}
    rowData={DeliveryList_data[ind] || { unique_key: ind }}  
    setDeliveryList_data={setDeliveryList_data}
    setShowSerial={setShowSerial}
    setSerialItemIndex={setSerialItemIndex}
    deleteDeliveryProduct={deleteDeliveryProduct}
    BtnAccess={deliveryBtn.BtnAccess}
  />
))}
                <tr>
                  <td></td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDeliveryList_data((prev) => [
                          ...prev,
                          { unique_key: numOfDeliveryList },
                        ]);
                        setnumOfDeliveryList((prev) => prev + 1);
                      }}
                      disabled={deliveryBtn.BtnAccess}
                    >
                      + Add Item
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── DELIVERY LOGISTICS ───────────────────────────────────────── */}
          <nav className="createNewDelivery-subtit">Delivery Logistics</nav>
          <div className="createNewDelivery-input-container">
            <div className="createNewDelivery-input-box">
              <label htmlFor="delivery_by">Delivered By</label>
              <input
                id="delivery_by"
                value={deliveryInput.delivery_by}
                onChange={handleDeliveryInpChange}
                type="text"
                placeholder="Enter delivery agent/person's name"
                disabled={deliveryBtn.BtnAccess}
              />
            </div>
            <div className="createNewDelivery-input-box">
              <label>Delivery Status</label>
              <input type="text" value={deliveryStatus} disabled />
            </div>
          </div>
          <div className="createNewDelivery-input-container">
            <div className="createNewDelivery-input-box">
              <label htmlFor="vehicle_no">Vehicle No</label>
              <input
                id="vehicle_no"
                value={deliveryInput.vehicle_no}
                onChange={handleDeliveryInpChange}
                type="text"
                placeholder="Enter vehicle number"
                disabled={deliveryBtn.BtnAccess}
              />
            </div>
            <div className="createNewDelivery-input-box">
              <label htmlFor="tracking_id">Tracking ID</label>
              <input
                id="tracking_id"
                value={deliveryInput.tracking_id}
                onChange={handleDeliveryInpChange}
                type="text"
                placeholder="Enter Tracking ID"
                disabled={deliveryBtn.BtnAccess}
              />
            </div>
          </div>
          <div className="createNewDelivery-input-container">
            <div className="createNewDelivery-input-box">
              <label htmlFor="delivery_notes">Delivery Notes</label>
              <input
                id="delivery_notes"
                value={deliveryInput.delivery_notes}
                onChange={handleDeliveryInpChange}
                type="text"
                placeholder="Enter Delivery notes"
                disabled={deliveryBtn.BtnAccess}
              />
            </div>
          </div>

          {/* ── CUSTOMER ACKNOWLEDGEMENT ─────────────────────────────────── */}
          {["Submitted", "Partially Delivered", "Delivered"].includes(deliveryStatus) && (
            <div className="createNewDelivery-ack-container">
              <div className="createNewDelivery-ack-head">
                <nav className="createNewDelivery-ack-subtit">Customer Acknowledgement</nav>
                <button
                  className="createNewDelivery-active-btn"
                  disabled={deliveryBtn.customerACK || isSaving}
                  onClick={handleSaveACK}
                >
                  Save Changes
                </button>
              </div>
              <div className="createNewDelivery-input-container">
                <div className="createNewDelivery-input-box">
                  <label htmlFor="received_by">Received By</label>
                  <input
                    id="received_by"
                    value={deliveryInput.received_by}
                    onChange={handleDeliveryInpChange}
                    type="text"
                    placeholder="Customer's name receiving goods"
                    disabled={deliveryBtn.customerACK}
                  />
                </div>
                <div className="createNewDelivery-input-box">
                  <label htmlFor="contact_number">Contact Number</label>
                  <input
                    id="contact_number"
                    value={deliveryInput.contact_number}
                    onChange={handleDeliveryInpChange}
                    type="text"
                    placeholder="Enter Contact number"
                    disabled={deliveryBtn.customerACK}
                  />
                </div>
              </div>
              <div className="createNewDelivery-input-container">
                <div className="createNewDelivery-input-box">
                  <label>Proof of Delivery (POD)</label>
                  <div className="createNewDelivery-ack-proof-container">
                    <CreateNewDeliveryProofAttachment
                      BtnAccess={deliveryBtn.customerACK}
                      noteId={dbNoteId}
                      existingAttachments={attachments}
                      onUpload={(file, desc) =>
                        deliveryNoteApiProvider.uploadAttachment(dbNoteId, file, desc)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── COMMENTS ─────────────────────────────────────────────────── */}
          {dbNoteId && (
            <div className="createNewDelivery-hub-container">
              <nav className="createNewDelivery-subtit">Comments</nav>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment…"
                  style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
                />
                <button
                  onClick={handleAddComment}
                  className="createNewDelivery-active-btn"
                  style={{ padding: "8px 16px" }}
                >
                  Add
                </button>
              </div>
              {comments.map((c, i) => (
                <div key={i} style={{ padding: "8px 12px", background: "#f9f9f9", borderRadius: "6px", marginBottom: "6px" }}>
                  <p style={{ fontSize: "13px", margin: 0 }}>{c.comment}</p>
                  <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0" }}>
                    {c.created_by} · {new Date(c.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}

              {/* History */}
              <nav className="createNewDelivery-subtit" style={{ marginTop: "16px" }}>History</nav>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "8px 12px", background: "#f9f9f9", borderRadius: "6px", marginBottom: "6px" }}>
                  <p style={{ fontSize: "13px", margin: 0 }}>{h.event_type}: {h.details}</p>
                  <p style={{ fontSize: "11px", color: "#888", margin: "4px 0 0" }}>
                    {h.action_by} · {new Date(h.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── ACTION BUTTONS ───────────────────────────────────────────── */}
          <div className="createNewDelivery-btn-container">
            <button
              className={
                ["Submitted", "Partially Delivered", "Delivered"].includes(deliveryStatus)
                  ? "createNewDelivery-order-active-btn"
                  : "createNewDelivery-inactive-btn"
              }
              onClick={handleCancelDNState}
              disabled={deliveryBtn.cancel_dn || isSaving}
            >
              {deliveryStatus === "Cancelled" ? "Cancelled" : "Cancel DN"}
            </button>

            <nav>
              <button
                className="createNewDelivery-cancel-btn"
                onClick={(e) => { e.preventDefault(); prevpg(-1); }}
              >
                Cancel
              </button>
              <button
                className={["Draft", ""].includes(deliveryStatus) ? "createNewDelivery-active-btn" : "createNewDelivery-completed-btn"}
                onClick={handleDraftState}
                disabled={deliveryBtn.save_draft || isSaving}
              >
                {isSaving ? "Saving…" : "Save Draft"}
              </button>
              <button
                className={["Draft", ""].includes(deliveryStatus) ? "createNewDelivery-active-btn" : "createNewDelivery-completed-btn"}
                disabled={deliveryBtn.submit_dn || isSaving}
              >
                {["Partially Delivered", "Delivered"].includes(deliveryStatus)
                  ? "Submitted (DN)"
                  : isSaving ? "Submitting…" : "Submit (DN)"}
              </button>

              <svg
                className={!deliveryBtn.pdf ? "createNewDelivery-pdf-mail-activelogo" : "createNewDelivery-pdf-mail-futurelogo"}
                style={{ cursor: !deliveryBtn.pdf ? "pointer" : "not-allowed", opacity: deliveryBtn.pdf ? 0.4 : 1 }}
                onClick={!deliveryBtn.pdf ? handlePdf : undefined}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24" fill="none"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M0.600098 2.4C0.600098 1.76348 0.852954 1.15303 1.30304 0.702944C1.75313 0.252856 2.36358 0 3.0001 0L16.1313 0L21.4001 5.2688V21.6C21.4001 22.2365 21.1472 22.847 20.6972 23.2971C20.2471 23.7471 19.6366 24 19.0001 24H3.0001C2.36358 24 1.75313 23.7471 1.30304 23.2971C0.852954 22.847 0.600098 22.2365 0.600098 21.6V2.4ZM4.6001 9.6H2.2001V17.6H3.8001V14.4H4.6001C5.23662 14.4 5.84707 14.1471 6.29715 13.6971C6.74724 13.247 7.0001 12.6365 7.0001 12C7.0001 11.3635 6.74724 10.753 6.29715 10.3029C5.84707 9.85286 5.23662 9.6 4.6001 9.6ZM11.0001 9.6H8.6001V17.6H11.0001C11.6366 17.6 12.2471 17.3471 12.6972 16.8971C13.1472 16.447 13.4001 15.8365 13.4001 15.2V12C13.4001 11.3635 13.1472 10.753 12.6972 10.3029C12.2471 9.85286 11.6366 9.6 11.0001 9.6ZM15.0001 17.6V9.6H19.8001V11.2H16.6001V12.8H18.2001V14.4H16.6001V17.6H15.0001Z" />
              </svg>

              <svg
                className={!deliveryBtn.email ? "createNewDelivery-pdf-mail-activelogo" : "createNewDelivery-pdf-mail-futurelogo"}
                style={{ cursor: !deliveryBtn.email ? "pointer" : "not-allowed", opacity: deliveryBtn.email ? 0.4 : 1 }}
                onClick={!deliveryBtn.email ? handleEmail : undefined}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" fill="none"
              >
                <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 8.825C10.0833 8.825 10.171 8.81233 10.263 8.787C10.355 8.76167 10.4423 8.72433 10.525 8.675L17.6 4.25C17.7333 4.16667 17.8333 4.06267 17.9 3.938C17.9667 3.81333 18 3.67567 18 3.525C18 3.19167 17.8583 2.94167 17.575 2.775C17.2917 2.60833 17 2.61667 16.7 2.8L10 7L3.3 2.8C3 2.61667 2.70833 2.61267 2.425 2.788C2.14167 2.96333 2 3.209 2 3.525C2 3.69167 2.03333 3.83767 2.1 3.963C2.16667 4.08833 2.26667 4.184 2.4 4.25L9.475 8.675C9.55833 8.725 9.646 8.76267 9.738 8.788C9.83 8.81333 9.91733 8.82567 10 8.825Z" />
              </svg>
            </nav>
          </div>

        </form>
      </div>
    </>
  );
}