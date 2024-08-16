import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import {
  mdiPrinterOutline,
  mdiAccountPlus,
  mdiAccountEdit,
  mdiAccountEye,
  mdiAccountOff,
  mdiArrowLeft,
} from "@mdi/js";
import AddMemberForm from "../Forms/Member/AddMemberForm";
import { SnackbarProvider, useSnackbar } from "notistack";
import MemberProfile from "../ViewMember/ViewMember";
import EditMemberForm from "../Forms/Member/EditMemberForm";
import "./Members.scss";
import html2pdf from "html2pdf.js";

const Members = ({ user }) => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [editMemberId, setEditMemberId] = useState(null);
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
    if (user.role === "admin") {
      fetch("http://localhost:6969/get-members")
        .then((response) => response.json())
        .then((data) => {
          setMembers(data);
        })
        .catch((error) => console.error("Error fetching members data:", error));
    } else {
      fetch(`http://localhost:6969/get-members/trainer/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setMembers(data);
        })
        .catch((error) => console.error("Error fetching members data:", error));
    }
  }, []);

  const handleDelete = async (id) => {
    if (user.role !== "admin") {
      showNotification("Permission Denied: Unable to Delete Member", "warning");
      return;
    }
    setDeletingRow(id);
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:6969/del-member/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setMembers((prevMembers) =>
            prevMembers.filter((member) => member._id !== id)
          );
          showNotification("Member Removed Successfully", "success");
        } else {
          console.error("Failed to delete member");
          showNotification("Unable to remove Member", "warning");
        }
      } catch (error) {
        console.error("Error deleting member:", error);
        showNotification("Unable to remove Member", "warning");
      }
      setDeletingRow(null);
    }, 500);
  };

  const handleEdit = (id) => {
    if (user.role !== "admin") {
      showNotification("Permission Denied: Unable to Edit Member", "warning");
      return;
    }
    setEditMemberId(id);
  };

  const handleSaveEdit = () => {
    setEditMemberId(null);
  };

  const handleAddMember = () => {
    if (user.role !== "admin") {
      showNotification("Permission Denied: Unable to Add Member", "info");
      return;
    }

    setShowForm(true);
  };

  const fetchAndGeneratePDF = async () => {
    try {
      const data = members;

      const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px; margin: 0; position: relative; min-height: 1000px;">
    <div style="text-align: center; white-space: nowrap;">
      <h2 style="margin: 0;">Radiance Yoga Center</h2>
    </div>
    <div class="sub" style="text-align:center;">
    <div>Members List</div>
    </div>
    <hr style="border: 1px solid #ddd; margin: 20px 0;" />
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Phone</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Height</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Weight</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Gender</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Subscription</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (member) => `
          <tr>
           <td>${member.username}</td>
              <td>${member.name}</td>
              <td>${member.phone}</td>
              <td>${member.height} cm</td>
              <td>${member.weight} Kg</td>
              <td>${member.gender}</td>
              <td>${member.subscription.toUpperCase()}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <footer style="text-align: center; font-size: 10px; position: absolute; bottom: 0; width: 100%; border-top: 1px solid #ddd; padding: 10px 0; background-color: #fff;">
      © Radiance Yoga Center    |    12 Alpha Street, Coimbatore    |    +91 6383 580 965
    </footer>
  </div>
`;

      // Convert HTML content to PDF
      const opt = {
        margin: 0,
        filename: "Members_List (Radiance Yoga Center).pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(htmlContent).set(opt).save();
    } catch (error) {
      console.error("Error fetching or generating PDF:", error);
    }
  };

  return (
    <div id="members" className="display-area">
      <div className="content-title" data-aos="fade-right">
        DASHBOARD
      </div>
      <div className="content-title-holder py-2 my-flex-row">
        <div className="hello" data-aos="zoom-out-up">
          Comprehensive Members List
        </div>
        <div className="utility-holder my-flex-row">
          <div
            className="btn btn-outline-info utl-btn"
            data-aos="fade-left"
            onClick={fetchAndGeneratePDF}
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="500"
          >
            <Icon path={mdiPrinterOutline} size={1} /> Export
          </div>
          <div
            id="add_mbr_btn"
            className="btn utl-btn"
            onClick={handleAddMember}
            data-aos="zoom-in"
          >
            <Icon path={mdiAccountPlus} size={1} /> Add Member
          </div>
        </div>
      </div>
      <div className="member-table-holder mt-2 p-3" data-aos="zoom-in">
        <div className="table-wrapper">
          <table id="member_table">
            <thead>
              <tr>
                <th style={{ width: "13%" }}>ID</th>
                <th style={{ width: "15%" }}>Name</th>
                <th style={{ width: "15%" }}>Phone</th>
                <th style={{ width: "10%" }}>Height</th>
                <th style={{ width: "10%" }}>Weight</th>
                <th style={{ width: "10%" }}>Gender</th>
                <th style={{ width: "5%" }}>Subscription</th>
                <th style={{ width: "20%", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr
                    key={member._id}
                    className={`member-row ${
                      deletingRow === member._id ? "fade-slide-remove" : ""
                    }`}
                  >
                    <td>{member.username}</td>
                    <td>{member.name}</td>
                    <td>{member.phone}</td>
                    <td>{member.height} cm</td>
                    <td>{member.weight} Kg</td>
                    <td>{member.gender}</td>
                    <td>{member.subscription.toUpperCase()}</td>
                    <td>
                      {activeRow === member._id ? (
                        <div className="expanded-actions my-flex-row">
                          <button
                            className="btn btn-lg btn-danger px-4 me-2"
                            onClick={() => handleDelete(member._id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-lg btn-secondary ml-2 px-3"
                            onClick={() => setActiveRow(null)}
                          >
                            <Icon path={mdiArrowLeft} size={0.9} />
                          </button>
                        </div>
                      ) : (
                        <div className="default-actions">
                          <button
                            className="btn btn-sm btn-secondary me-3"
                            onClick={() => setViewProfileId(member._id)}
                          >
                            <Icon path={mdiAccountEye} size={1} />
                          </button>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEdit(member._id)}
                          >
                            <Icon path={mdiAccountEdit} size={1} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger ml-2"
                            onClick={() => setActiveRow(member._id)}
                          >
                            <Icon path={mdiAccountOff} size={1} />
                          </button>
                        </div>
                      )}
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
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && <AddMemberForm onClose={() => setShowForm(false)} />}
      {viewProfileId && (
        <MemberProfile
          memberId={viewProfileId}
          onClose={() => setViewProfileId(null)}
        />
      )}
      {editMemberId && (
        <EditMemberForm
          memberId={editMemberId}
          onClose={() => setEditMemberId(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Members;
