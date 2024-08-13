import React, { useState, useEffect } from "react";
import axios from "axios";
import Icon from "@mdi/react";
import {
  mdiAccountGroup,
  mdiPencil,
  mdiDeleteOutline,
  mdiArrowLeft,
  mdiKeyboardBackspace,
  mdiCheckboxMarkedCircleOutline,
} from "@mdi/js";
import { SnackbarProvider, useSnackbar } from "notistack";
import ViewMembership from "../ViewMembership/ViewMembership";
import "./Membership.scss";

function Membership() {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    name: "",
    duration: "",
    price: "",
  });
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [deletingPlanId, setDeletingPlanId] = useState(null);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [confirmationQueue, setConfirmationQueue] = useState([]);
  const [editPlanDetails, setEditPlanDetails] = useState({
    name: "",
    duration: "",
    price: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = (message, type) => {
    enqueueSnackbar(message, {
      variant: type,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

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
    if (editingPlanId) {
      setEditPlanDetails({ ...editPlanDetails, [name]: value });
    } else {
      setNewPlan({ ...newPlan, [name]: value });
    }
  };

  const handleViewMembers = (planId) => {
    setSelectedPlanId(planId);
  };

  const handleCloseList = () => {
    setSelectedPlanId(null);
  };

  const handleEdit = (plan) => {
    setEditingPlanId(plan._id);
    setEditPlanDetails({
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:6969/update-membership/${editingPlanId}`,
        editPlanDetails
      );
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan._id === editingPlanId ? { ...plan, ...editPlanDetails } : plan
        )
      );
      showNotification("Membership Plan Updated Successfully", "success");
    } catch (error) {
      console.error("Failed to update Membership Plan", error);
      showNotification("Failed To Update Plan", "error");
    }
    setEditingPlanId(null);
  };

  const handleDelete = (id) => {
    setDeletingPlanId(id);
    setConfirmationQueue((prevQueue) => [...prevQueue, id]);
  };

  const handleConfirmDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:6969/del-membership/${id}`
      );
      if (response.status === 200) {
        setPlans((prevPlans) => prevPlans.filter((plan) => plan._id !== id));
        showNotification("Membership Plan Deleted Successfully", "success");
      } else {
        console.error("Failed to delete plan");
        showNotification(
          "Failed To Delete Plan with Active Members",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      showNotification("Failed To Delete Plan with Active Members", "warning");
    }
    setConfirmationQueue((prevQueue) =>
      prevQueue.filter((item) => item !== id)
    );
    setDeletingPlanId(null);
  };

  const handleCancelDelete = () => {
    setDeletingPlanId(null);
    setConfirmationQueue((prevQueue) =>
      prevQueue.filter((item) => item !== deletingPlanId)
    );
  };

  return (
    <div id="membership-section" className="display-area">
      <div className="content-title" data-aos="fade-right">
        DASHBOARD
      </div>
      <div className="hello py-3" data-aos="zoom-out-up">
        Comprehensive Membership List
      </div>
      <div className="form-containers">
        {editingPlanId ? (
          <div className=" my-2 mb-4 edit-membership-form">
            <input
              type="text"
              name="name"
              placeholder="Membership Name"
              value={editPlanDetails.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (months)"
              value={editPlanDetails.duration}
              onChange={handleInputChange}
              min={1}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={editPlanDetails.price}
              onChange={handleInputChange}
              min={1}
              required
            />
            <button
              className="btn btn-success px-3 py-2 me-2"
              onClick={handleSaveEdit}
            >
              <Icon path={mdiCheckboxMarkedCircleOutline} size={1} />
            </button>
            <button
              className="btn btn-secondary px-3 py-2"
              onClick={() => setEditingPlanId(null)}
            >
              <Icon path={mdiKeyboardBackspace} size={1} />
            </button>
          </div>
        ) : (
          <div className="add-membership my-2 mb-4">
            <div className="form-holder">
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
              <button
                className="btn btn-success px-4 py-2"
                onClick={handleSubmit}
              >
                Add Plan
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="membership-table-holder mt-2 p-3" data-aos="zoom-in">
        <div className="table-wrappers">
          <table id="membership_table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>ID</th>
                <th style={{ width: "15%" }}>Membership Name</th>
                <th style={{ width: "10%" }}>Duration</th>
                <th style={{ width: "10%" }}>Price</th>
                <th style={{ width: "11%" }}>Members Count</th>
                <th style={{ width: "5%", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 ? (
                plans.map((plan, index) => (
                  <tr
                    key={plan._id}
                    className={`membership-row ${
                      confirmationQueue.includes(plan._id)
                        ? "confirmation-queue"
                        : ""
                    } ${
                      deletingPlanId === plan._id &&
                      !confirmationQueue.includes(plan._id)
                        ? "fade-slide-remove"
                        : ""
                    }`}
                  >
                    <td>{`RYC-MP${index + 1}`}</td>
                    <td>{plan.name}</td>
                    <td>
                      {plan.duration} {plan.duration === 1 ? "Month" : "Months"}
                    </td>
                    <td>&#8377; {plan.price}</td>
                    <td>{plan.num_members} Members</td>
                    <td>
                      {confirmationQueue.includes(plan._id) ? (
                        <div className="action-buttons">
                          <button
                            className="btn btn-lg btn-danger me-4"
                            onClick={() => handleConfirmDelete(plan._id)}
                          >
                            Remove
                          </button>
                          <button
                            className="btn btn-lg btn-secondary"
                            onClick={handleCancelDelete}
                          >
                            <Icon path={mdiArrowLeft} size={1} />
                          </button>
                        </div>
                      ) : (
                        <div className="default-actions my-flex-row">
                          <button
                            className="btn btn-sm btn-secondary me-3"
                            onClick={() => handleViewMembers(plan._id)}
                          >
                            <Icon path={mdiAccountGroup} size={1} />
                          </button>
                          <button
                            className="btn btn-sm btn-primary me-3"
                            onClick={() => handleEdit(plan)}
                          >
                            <Icon path={mdiPencil} size={1} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(plan._id)}
                          >
                            <Icon path={mdiDeleteOutline} size={1} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
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
      {selectedPlanId && (
        <ViewMembership planId={selectedPlanId} onClose={handleCloseList} />
      )}
    </div>
  );
}

export default Membership;
