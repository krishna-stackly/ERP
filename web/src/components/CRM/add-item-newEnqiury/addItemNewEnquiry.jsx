// import React, { useState, useEffect } from "react";
// import "./addItemNewEnquiry.css";

// export default function addItemNewEnquiry({
//   setshowAddItem,
//   editAddItem,
//   editItem,
//   seteditItem,
// }) {
//   const [addItems, setaddItems] = useState({
//     item_code: "",
//     product_description: "",
//     cost_price: "",
//     salling_price: "",
//     quantity: "",
//     total_amount: "",
//   });
//   useEffect(() => {
//     setaddItems((prev) => {
//       return { ...prev, ...editItem };
//     });
//   }, [editItem]);

//   const handlAddItemChanges = (e) => {
//     setaddItems((perv) => {
//       return { ...perv, [e.target.id]: e.target.value };
//     });
//   };

//   console.log(addItems);

//   function handleAddItemSubmit(e) {
//     e.preventDefault();
//     setaddItems({
//       item_code: "",
//       product_description: "",
//       cost_price: "",
//       salling_price: "",
//       quantity: "",
//       total_amount: "",
//     });
//     setshowAddItem(false);
//   }

//   return (
//     <div className="additem-newEnquiry-container">
//       <p>{editAddItem ? "Edit" : "Add New"} Product</p>
//       <div className="additem-form-container">
//         <form onSubmit={handleAddItemSubmit}>
//           <div className="additem-box">
//             <label htmlFor="item_code">
//               Item Code<sup>*</sup>
//             </label>
//             <input
//               id="item_code"
//               value={addItems.item_code}
//               onChange={handlAddItemChanges}
//               type="text"
//               placeholder="Enter Code"
//               required
//             />
//           </div>
//           <div className="additem-box">
//             <label htmlFor="product_description">
//               Product Description<sup>*</sup>
//             </label>
//             <input
//               id="product_description"
//               value={addItems.product_description}
//               onChange={handlAddItemChanges}
//               type="text"
//               placeholder="Text Area"
//               required
//             />
//           </div>
//           <div className="additem-colom-box">
//             <div className="additem-box2">
//               <label htmlFor="cost_price">
//                 Cost Price<sup>*</sup>
//               </label>
//               <input
//                 id="cost_price"
//                 value={addItems.cost_price}
//                 onChange={handlAddItemChanges}
//                 type="number"
//                 placeholder="Enter Cost Price"
//                 required
//               />
//             </div>
//             <div className="additem-box2">
//               <label htmlFor="salling_price">
//                 Salling Price<sup>*</sup>
//               </label>
//               <input
//                 id="salling_price"
//                 value={addItems.salling_price}
//                 onChange={handlAddItemChanges}
//                 type="number"
//                 placeholder="Enter Salling Price"
//                 required
//               />
//             </div>
//           </div>
//           <div className="additem-box">
//             <label htmlFor="quantity">
//               Quantity<sup>*</sup>
//             </label>
//             <input
//               id="quantity"
//               value={addItems.quantity}
//               onChange={handlAddItemChanges}
//               type="number"
//               placeholder="0"
//               required
//             />
//           </div>
//           <div className="additem-box">
//             <label htmlFor="total_amount">
//               Total<sup>*</sup>
//             </label>
//             <input
//               id="total_amount"
//               value={addItems.total_amount}
//               onChange={handlAddItemChanges}
//               type="text"
//               placeholder="Total Amount"
//               required
//             />
//           </div>
//           <div className="additem-submit-container">
//             <nav onClick={() => setshowAddItem(false)}>Cancel</nav>
//             <button type="submit">Add Item</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import "./addItemNewEnquiry.css";

export default function AddItemNewEnquiry({
  setshowAddItem,
  editAddItem,
  editItem,
  seteditItem,
  setenquiryData,
  setenquiryGrandTotal,
}) {
  const emptyForm = {
    item_code: "",
    product_description: "",
    cost_price: "",
    salling_price: "",
    quantity: "",
    total_amount: "",
  };

  const [addItems, setaddItems] = useState(emptyForm);

  // ✅ Prefill form when editing
  useEffect(() => {
    if (editAddItem && editItem && Object.keys(editItem).length > 0) {
      setaddItems((prev) => ({ ...prev, ...editItem }));
    }
  }, [editItem, editAddItem]);

  // ✅ Auto-calculate total_amount when qty or selling price changes
  useEffect(() => {
    const qty   = parseFloat(addItems.quantity)      || 0;
    const price = parseFloat(addItems.salling_price) || 0;
    setaddItems((prev) => ({
      ...prev,
      total_amount: qty > 0 && price > 0 ? (qty * price).toFixed(2) : prev.total_amount,
    }));
  }, [addItems.quantity, addItems.salling_price]);

  const handlAddItemChanges = (e) => {
    setaddItems((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  function handleAddItemSubmit(e) {
    e.preventDefault();

    const newItem = {
      ...addItems,
      id: editAddItem && editItem?.id ? editItem.id : Date.now(), // ✅ preserve id on edit
    };

    setenquiryData((prev) => {
      // ✅ Update existing item OR append new item
      const updated = editAddItem && editItem?.id
        ? prev.map((item) => (item.id === editItem.id ? newItem : item))
        : [...prev, newItem];

      // ✅ Recalculate grand total from all items
      const grand = updated.reduce(
        (sum, item) => sum + (parseFloat(item.total_amount) || 0),
        0
      );
      setenquiryGrandTotal(grand.toFixed(2));

      return updated;
    });

    // ✅ Reset state and close modal
    seteditItem({});
    setaddItems(emptyForm);
    setshowAddItem(false);
  }

  return (
    <div className="additem-newEnquiry-container">
      <p>{editAddItem ? "Edit" : "Add New"} Product</p>
      <div className="additem-form-container">
        <form onSubmit={handleAddItemSubmit}>
          <div className="additem-box">
            <label htmlFor="item_code">
              Item Code<sup>*</sup>
            </label>
            <input
              id="item_code"
              value={addItems.item_code}
              onChange={handlAddItemChanges}
              type="text"
              placeholder="Enter Code"
              required
            />
          </div>

          <div className="additem-box">
            <label htmlFor="product_description">
              Product Description<sup>*</sup>
            </label>
            <input
              id="product_description"
              value={addItems.product_description}
              onChange={handlAddItemChanges}
              type="text"
              placeholder="Text Area"
              required
            />
          </div>

          <div className="additem-colom-box">
            <div className="additem-box2">
              <label htmlFor="cost_price">
                Cost Price<sup>*</sup>
              </label>
              <input
                id="cost_price"
                value={addItems.cost_price}
                onChange={handlAddItemChanges}
                type="number"
                placeholder="Enter Cost Price"
                required
              />
            </div>
            <div className="additem-box2">
              <label htmlFor="salling_price">
                Selling Price<sup>*</sup>
              </label>
              <input
                id="salling_price"
                value={addItems.salling_price}
                onChange={handlAddItemChanges}
                type="number"
                placeholder="Enter Selling Price"
                required
              />
            </div>
          </div>

          <div className="additem-box">
            <label htmlFor="quantity">
              Quantity<sup>*</sup>
            </label>
            <input
              id="quantity"
              value={addItems.quantity}
              onChange={handlAddItemChanges}
              type="number"
              placeholder="0"
              required
            />
          </div>

          <div className="additem-box">
            <label htmlFor="total_amount">Total</label>
            <input
              id="total_amount"
              value={addItems.total_amount}
              type="text"
              placeholder="Auto-calculated"
              disabled // ✅ read-only, auto-calculated
            />
          </div>

          <div className="additem-submit-container">
            <nav
              onClick={() => {
                seteditItem({});
                setshowAddItem(false);
              }}
            >
              Cancel
            </nav>
            <button type="submit">
              {editAddItem ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}