import React, { useState } from "react";
import { useNavigate } from "react-router";

const ConfirmTicketPage = ({ selectedTrain }) => {
  const navigate = useNavigate();

  // Adult passengers
  const [adults, setAdults] = useState([
    { name: "", age: "", gender: "", senior: false, pwd: false },
  ]);

  // Child passengers
  const [children, setChildren] = useState([]);

  const [mobile, setMobile] = useState("");

  const handleAddAdult = () => {
    if (adults.length < 6) {
      setAdults([
        ...adults,
        { name: "", age: "", gender: "", senior: false, pwd: false },
      ]);
    }
  };

  const handleRemoveAdult = (index) => {
    if (adults.length > 1) {
      const updated = [...adults];
      updated.splice(index, 1);
      setAdults(updated);
    }
  };

  const handleAddChild = () => {
    if (children.length < 6) {
      setChildren([...children, { name: "", age: "", gender: "" }]);
    }
  };

  const handleRemoveChild = (index) => {
    const updated = [...children];
    updated.splice(index, 1);
    setChildren(updated);
  };

  const validate = () => {
    // Adult validation
    if (adults.length < 1) {
      alert("At least 1 adult passenger is required.");
      return false;
    }

    for (let a of adults) {
      if (!a.name.trim()) return alert("Adult name is required.");
      if (!a.age || a.age < 6 || a.age > 120)
        return alert("Adult age must be between 6 - 120.");
      if (!a.gender) return alert("Adult gender is required.");
    }

    // Child validation
    for (let c of children) {
      if (!c.name.trim()) return alert("Child name is required.");
      if (!c.age || c.age < 1 || c.age > 5)
        return alert("Child age must be between 1 - 5.");
      if (!c.gender) return alert("Child gender is required.");
    }

    // At least one adult if child exists
    if (children.length > 0 && adults.length < 1) {
      return alert("A child passenger requires at least 1 adult.");
    }

    if (!mobile || mobile.length !== 10) {
      return alert("Valid 10-digit mobile number is required.");
    }

    return true;
  };

  const handleFakePayment = () => {
    if (!validate()) return;

    // Fake delay to simulate payment
    setTimeout(() => {
      navigate("/ticket-confirmation", {
        state: {
          train: selectedTrain,
          adults,
          children,
          mobile,
          pnr: "PNR" + Math.floor(Math.random() * 9000000000 + 1000000000),
        },
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Passenger Details
        </h2>

        {/* Adult Section */}
        <h3 className="text-lg font-semibold mb-2">Adult Passengers</h3>

        {adults.map((adult, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 mb-3 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <input
              type="text"
              placeholder="Name"
              value={adult.name}
              onChange={(e) => {
                const updated = [...adults];
                updated[idx].name = e.target.value;
                setAdults(updated);
              }}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Age (6-120)"
              value={adult.age}
              onChange={(e) => {
                const updated = [...adults];
                updated[idx].age = e.target.value;
                setAdults(updated);
              }}
              className="border p-2 rounded"
            />

            <select
              value={adult.gender}
              onChange={(e) => {
                const updated = [...adults];
                updated[idx].gender = e.target.value;
                setAdults(updated);
              }}
              className="border p-2 rounded"
            >
              <option value="">Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Others</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={adult.senior}
                onChange={(e) => {
                  const updated = [...adults];
                  updated[idx].senior = e.target.checked;
                  setAdults(updated);
                }}
              />
              Senior Citizen
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={adult.pwd}
                onChange={(e) => {
                  const updated = [...adults];
                  updated[idx].pwd = e.target.checked;
                  setAdults(updated);
                }}
              />
              PWD
            </label>

            {idx > 0 && (
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={() => handleRemoveAdult(idx)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {adults.length < 6 && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mb-6"
            onClick={handleAddAdult}
          >
            + Add Adult
          </button>
        )}

        {/* Child Section */}
        <h3 className="text-lg font-semibold mb-2">Child Passengers</h3>

        {children.map((child, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 mb-3 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <input
              type="text"
              placeholder="Name"
              value={child.name}
              onChange={(e) => {
                const updated = [...children];
                updated[idx].name = e.target.value;
                setChildren(updated);
              }}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Age (1-5)"
              value={child.age}
              onChange={(e) => {
                const updated = [...children];
                updated[idx].age = e.target.value;
                setChildren(updated);
              }}
              className="border p-2 rounded"
            />

            <select
              value={child.gender}
              onChange={(e) => {
                const updated = [...children];
                updated[idx].gender = e.target.value;
                setChildren(updated);
              }}
              className="border p-2 rounded"
            >
              <option value="">Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Others</option>
            </select>

            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={() => handleRemoveChild(idx)}
            >
              Remove
            </button>
          </div>
        ))}

        {children.length < 6 && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mb-6"
            onClick={handleAddChild}
          >
            + Add Child
          </button>
        )}

        {/* Mobile Number */}
        <h3 className="text-lg font-semibold mb-2">Mobile Number</h3>
        <input
          type="text"
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="border p-2 rounded w-full mb-6"
        />

        {/* Fake Payment */}
        <div className="text-center">
          <button
            onClick={handleFakePayment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow"
          >
            Proceed to Fake Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTicketPage;
