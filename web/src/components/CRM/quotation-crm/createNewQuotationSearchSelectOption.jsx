// import React, { useEffect, useState } from "react";
// import Select from "react-select";

// export default function CreateNewQuotationSearchSelectOption({
//   setdescription,
//   description,
//   descriptions,
//   inputDisable,
//   editQuotationData,
// }) {
//   const [options, setOptions] = useState([]);
//   const [selectedOption, setSelectedOption] = useState(null);

//   // Populate options
//   useEffect(() => {
//     if (descriptions.length > 0) {
//       const opts = descriptions.map((desc) => ({
//         value: desc,
//         label: desc,
//       }));
//       setOptions(opts);
//     }
//   }, [descriptions]);

//   // When editing existing row
//   useEffect(() => {
//     if (editQuotationData?.description) {
//       setSelectedOption({
//         value: editQuotationData.description,
//         label: editQuotationData.description,
//       });
//     }
//   }, [editQuotationData]);

//   // Update parent on selection change
//   useEffect(() => {
//     if (selectedOption) {
//       setdescription(selectedOption.value);
//     }
//   }, [selectedOption, setdescription]);

//   return (
//     <div>
//       <Select
//         value={selectedOption}
//         onChange={setSelectedOption}
//         options={options}
//         isDisabled={inputDisable}
//         required
//         placeholder="Select product"
//       />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import Select from "react-select";

export default function CreateNewQuotationSearchSelectOption({
  setdescription,
  description,
  descriptions,
  inputDisable,
  editQuotationData,
}) {
  const [options,        setOptions]        = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // build options list when descriptions change
  useEffect(() => {
    const opts = descriptions.map((desc) => ({ value: desc, label: desc }));
    setOptions(opts);
  }, [descriptions]);

  // pre-fill when editing
  useEffect(() => {
    if (editQuotationData?.description) {
      setSelectedOption({
        value: editQuotationData.description,
        label: editQuotationData.description,
      });
    }
  }, [editQuotationData]);

  // pre-fill when description prop is set externally
  useEffect(() => {
    if (description && (!selectedOption || selectedOption.value !== description)) {
      setSelectedOption({ value: description, label: description });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const handleChange = (option) => {
    setSelectedOption(option);
    setdescription(option ? option.value : "");
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      options={options}
      isDisabled={inputDisable}
      placeholder="Select product"
      isClearable
    />
  );
}