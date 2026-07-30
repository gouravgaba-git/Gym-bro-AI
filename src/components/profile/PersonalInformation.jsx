import React from "react";
import { User, Calendar, UserCheck, Ruler, Weight, FileText, Edit3 } from "lucide-react";

const PersonalInformation = ({ user, onEdit }) => {
  const items = [
    {
      label: "Age",
      value: user?.age ? `${user.age} Years` : "Not specified",
      icon: <Calendar className="kv-icon text-orange" size={18} />
    },
    {
      label: "Gender",
      value: user?.gender || "Not specified",
      icon: <UserCheck className="kv-icon text-blue" size={18} />
    },
    {
      label: "Height",
      value: user?.height ? `${user.height} cm` : "Not specified",
      icon: <Ruler className="kv-icon text-emerald" size={18} />
    },
    {
      label: "Weight",
      value: user?.weight ? `${user.weight} kg` : "Not specified",
      icon: <Weight className="kv-icon text-purple" size={18} />
    }
  ];

  return (
    <div className="card profile-info-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <User className="section-title-icon text-orange" size={20} />
          <h3 className="card-heading-title">Personal Metrics</h3>
        </div>
        {onEdit && (
          <button className="edit-icon-btn" onClick={onEdit} title="Edit metrics">
            <Edit3 size={15} />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="key-value-list">
        {items.map((item, idx) => (
          <div key={idx} className="kv-row">
            <div className="kv-label-group">
              {item.icon}
              <span className="kv-label-text">{item.label}</span>
            </div>
            <span className="kv-value-text">{item.value}</span>
          </div>
        ))}

        <div className="kv-row bio-row">
          <div className="kv-label-group">
            <FileText className="kv-icon text-muted" size={18} />
            <span className="kv-label-text">Bio</span>
          </div>
          <span className="kv-value-text bio-text">
            {user?.bio || "No bio added yet."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
