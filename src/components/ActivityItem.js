// src/components/ActivityItem.js
import React from 'react';
import styles from '../styles/ActivityItem.module.css';
import { 
  FiUserPlus, 
  FiEdit, 
  FiTrash2, 
  FiFileText, 
  FiPlusCircle 
} from 'react-icons/fi';

const eventIcons = {
  "User Account Created": <FiUserPlus />,
  "User Account Updated": <FiEdit />,
  "User Account Deleted": <FiTrash2 />,
  "Report Generated": <FiFileText />,
  "Course Created": <FiPlusCircle />,
};

const getEventMessage = (event) => {
    // This function can be expanded to create more descriptive messages
    switch (event.event_type) {
        case "User Account Created":
            return `${event.actor.first_name} ${event.actor.last_name} created a new user account: ${event.details.username}.`;
        case "User Account Updated":
            return `${event.actor.first_name} ${event.actor.last_name} updated the account for ${event.details.username}.`;
        case "User Account Deleted":
             return `${event.actor.first_name} ${event.actor.last_name} deleted the user account: ${event.details.username}.`;
        case "Report Generated":
            return `${event.actor.first_name} ${event.actor.last_name} generated a new report.`;
        case "Course Created":
            return `${event.actor.first_name} ${event.actor.last_name} created a new course.`;
        default:
            return "An unknown event occurred.";
    }
};

const ActivityItem = ({ event }) => {
  const avatarInitials = `${event.actor.first_name.charAt(0)}${event.actor.last_name.charAt(0)}`;
  const eventIcon = eventIcons[event.event_type] || <FiFileText />;

  return (
    <div className={styles.itemContainer}>
      <div className={styles.avatar}>
        {avatarInitials}
      </div>
      <div className={styles.itemContent}>
        <p className={styles.message}>{getEventMessage(event)}</p>
        <span className={styles.timestamp}>{new Date(event.timestamp).toLocaleString()}</span>
      </div>
      <div className={styles.icon}>
        {eventIcon}
      </div>
    </div>
  );
};

export default ActivityItem;