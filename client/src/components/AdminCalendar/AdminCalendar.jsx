import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./AdminCalendar.css";
import MemberCalendar from "../MemberCalendar/MemberCalendar";

const AdminCalendar = () => {
  const [searchUsername, setSearchUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allUsernames, setAllUsernames] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    const fetchAllUsernames = async () => {
      try {
        const response = await fetch("http://localhost:6969/get_all_usernames");
        if (!response.ok) {
          throw new Error("Error fetching usernames");
        }
        const data = await response.json();
        const options = data.usernames.map((username) => ({
          value: username,
          label: username,
        }));
        setAllUsernames(options);
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
    };
    fetchAllUsernames();
  }, []);

  useEffect(() => {
    if (searchUsername) {
      const filtered = allUsernames.filter((option) =>
        option.label.toLowerCase().includes(searchUsername.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(allUsernames);
    }
  }, [searchUsername, allUsernames]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:6969/profile/${searchUsername}`
      );
      if (!response.ok) {
        throw new Error("User not found or error fetching data.");
      }
      const data = await response.json();
      setUser(data);
      setFilteredOptions([]);
    } catch (err) {
      setUser(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (selectedOption) => {
    setSearchUsername(selectedOption ? selectedOption.label : "");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div id="admincalendar" className="display-area ">
      <div
        className="search-bard py-3 text-center "
        style={{ backgroundColor: "white" }}
      >
        <Select
          options={filteredOptions}
          onChange={handleInputChange}
          onInputChange={(inputValue) => setSearchUsername(inputValue)}
          placeholder="Search by Username"
          isClearable
          onKeyDown={handleKeyDown} // Add this line
        />
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Loading...</p>}
      {user && <MemberCalendar User_Data={{ ...user, id: user._id }} />}
    </div>
  );
};

export default AdminCalendar;
