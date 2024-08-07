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
import AddMemberForm from "../Forms/AddMemberForm";
import MemberProfile from "../ViewMember/ViewMember";
import EditMemberForm from "../Forms/EditMemberForm";
import "./Members.css";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [viewProfileId, setViewProfileId] = useState(null);
  const [editMemberId, setEditMemberId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:6969/get-members")
      .then((response) => response.json())
      .then((data) => {
        setMembers(data);
      })
      .catch((error) => console.error("Error fetching members data:", error));
  }, []);

  const handleDelete = async (id) => {
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
        } else {
          console.error("Failed to delete member");
        }
      } catch (error) {
        console.error("Error deleting member:", error);
      }
      setDeletingRow(null);
    }, 500);
  };

  const handleEdit = (id) => {
    setEditMemberId(id);
  };

  const handleSaveEdit = () => {
    setEditMemberId(null);
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
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="500"
          >
            <Icon path={mdiPrinterOutline} size={1} /> Export
          </div>
          <div
            id="add_mbr_btn"
            className="btn utl-btn"
            onClick={() => setShowForm(true)}
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
                <th style={{ width: "20%" }}>Action</th>
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
