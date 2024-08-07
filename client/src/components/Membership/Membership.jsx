import React, { useState, useEffect } from "react";
import axios from "axios";
import ViewMembership from "../ViewMembership/ViewMembership";
import "./Membership.css";

function Membership() {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    name: "",
    duration: "",
    price: "",
  });

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6969/get-membership"
        );
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching membership data:", error);
      }
    };

    fetchMemberships();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:6969/register-membership",
        newPlan
      );
      console.log("Membership Plan Added");
      window.location.reload();
    } catch (error) {
      console.log("Failed to add Membership Plan", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan({ ...newPlan, [name]: value });
  };

  return (
    <div id="membership-section" className="display-area">
      <div className="content-title" data-aos="fade-right">
        DASHBOARD
      </div>
      <div className="hello py-3" data-aos="zoom-out-up">
        Comprehensive Membership List
      </div>
      <div
        className="add-membership my-2 mb-4"
        data-aos="fade-left"
        data-aos-delay="200"
      >
        <div className="form-holder ">
          <input
            type="text"
            name="name"
            placeholder="Membership Name"
            value={newPlan.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (months)"
            value={newPlan.duration}
            onChange={handleInputChange}
            min={1}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newPlan.price}
            onChange={handleInputChange}
            min={1}
            required
          />
          <button className="btn btn-success px-4 py-2" onClick={handleSubmit}>
            Add Plan
          </button>
        </div>
      </div>
      <div className="membership-table-holder mt-2 p-3" data-aos="zoom-in">
        <div className="table-wrappers">
          <table id="membership_table">
            <thead>
              <tr>
                <th style={{ width: "13%" }}>ID</th>
                <th style={{ width: "15%" }}>Membership Name</th>
                <th style={{ width: "15%" }}>Duration</th>
                <th style={{ width: "10%" }}>Price</th>
                <th style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 ? (
                plans.map((plan, index) => (
                  <tr key={plan._id}>
                    <td>{`RYC-MP${index + 1}`}</td>
                    <td>{plan.name}</td>
                    <td>
                      {plan.duration} {plan.duration == 1 ? "Month" : "Months"}
                    </td>
                    <td>&#8377; {plan.price}</td>
                    <td>
                      <div className="btn btn-primary">View Members</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center fa-fade"
                    style={{ padding: "150px 10px", fontSize: "20px" }}
                  >
                    No plans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Membership;
