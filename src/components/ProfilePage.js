import React, { useState } from "react";
import { useNavigate } from "react-router";

const ProfilePage = () => {
  const navigate = useNavigate();

  // Mock State for User Profile
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    fullName: "John Developer",
    email: "john.dev@enterprise.com",
    mobile: "9876543210",
    username: "dev_admin_01",
    location: "Bangalore, Karnataka",
  });

  // Mock State for Preferences
  const [preferences, setPreferences] = useState({
    defaultClass: "3A",
    defaultQuota: "General",
    language: "English",
  });

  // Mock Saved Passengers
  const [savedPassengers, setSavedPassengers] = useState([
    { id: 1, name: "Rahul Sharma", age: 34, gender: "Male" },
    { id: 2, name: "Priya Sharma", age: 31, gender: "Female" },
  ]);

  // Add Passenger State
  const [showAddPassenger, setShowAddPassenger] = useState(false);
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    age: "",
    gender: "Male",
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would make an API call here
  };

  const handleRemovePassenger = (id) => {
    setSavedPassengers(savedPassengers.filter((p) => p.id !== id));
  };

  const handleAddNewPassenger = () => {
    if (!newPassenger.name || !newPassenger.age) return; // Simple validation

    const newId =
      savedPassengers.length > 0
        ? Math.max(...savedPassengers.map((p) => p.id)) + 1
        : 1;
    const passengerToAdd = { ...newPassenger, id: newId };

    setSavedPassengers([...savedPassengers, passengerToAdd]);
    setNewPassenger({ name: "", age: "", gender: "Male" }); // Reset form
    setShowAddPassenger(false); // Close form
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100 selection:bg-indigo-500 selection:text-white font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center border border-indigo-500/20 shadow-lg">
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                User Profile
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Manage your personal details and travel preferences
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/user-home")}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-300 transition-colors border border-gray-700"
          >
            Back to Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 border-4 border-gray-600 flex items-center justify-center text-3xl">
                👨‍💻
              </div>
              <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
              <p className="text-indigo-400 text-sm font-mono mb-4">
                @{user.username}
              </p>

              <div className="flex justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-500/20">
                  Active User
                </span>
                <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full border border-blue-500/20">
                  Enterprise
                </span>
              </div>

              <div className="border-t border-gray-700 pt-6 text-left space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +91 {user.mobile}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                    Location
                  </label>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {user.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-2xl p-1 border border-gray-700 shadow-lg">
              <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-xl transition-colors flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Change Password
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-xl transition-colors flex items-center gap-3"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout Session
              </button>
            </div>
          </div>

          {/* Right Column: Edit Form & Preferences */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details Form */}
            <section className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">
                  Personal Details
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
                  >
                    Edit Details
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={user.fullName}
                    onChange={(e) =>
                      setUser({ ...user, fullName: e.target.value })
                    }
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white transition-all ${
                      isEditing
                        ? "border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
                        : "border-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    disabled={true} // Username usually not editable
                    value={user.username}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white transition-all ${
                      isEditing
                        ? "border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
                        : "border-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Mobile
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={user.mobile}
                    onChange={(e) =>
                      setUser({ ...user, mobile: e.target.value })
                    }
                    className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white transition-all ${
                      isEditing
                        ? "border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
                        : "border-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6">
                Travel Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Default Class
                  </label>
                  <select
                    value={preferences.defaultClass}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        defaultClass: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="SL">Sleeper (SL)</option>
                    <option value="3A">AC 3 Tier (3A)</option>
                    <option value="2A">AC 2 Tier (2A)</option>
                    <option value="1A">AC First Class (1A)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Preferred Quota
                  </label>
                  <select
                    value={preferences.defaultQuota}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        defaultQuota: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="General">General</option>
                    <option value="Tatkal">Tatkal</option>
                    <option value="Ladies">Ladies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        language: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Kannada">Kannada</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Saved Passengers */}
            <section className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">
                  Saved Passengers
                </h3>
                {!showAddPassenger && (
                  <button
                    onClick={() => setShowAddPassenger(true)}
                    className="text-indigo-400 text-sm font-medium hover:text-indigo-300 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New
                  </button>
                )}
              </div>

              {/* Add Passenger Form */}
              {showAddPassenger && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 mb-6 animate-fade-in-down">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
                    New Passenger Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newPassenger.name}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          name: e.target.value,
                        })
                      }
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={newPassenger.age}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          age: e.target.value,
                        })
                      }
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <select
                      value={newPassenger.gender}
                      onChange={(e) =>
                        setNewPassenger({
                          ...newPassenger,
                          gender: e.target.value,
                        })
                      }
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowAddPassenger(false)}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNewPassenger}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Add Passenger
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {savedPassengers.length === 0 && !showAddPassenger && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No saved passengers found. Add one to quick-fill booking
                    forms.
                  </div>
                )}

                {savedPassengers.map((passenger) => (
                  <div
                    key={passenger.id}
                    className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm border border-gray-700">
                        {passenger.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {passenger.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {passenger.age} Yrs • {passenger.gender}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePassenger(passenger.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
