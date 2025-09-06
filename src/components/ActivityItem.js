// src/components/ActivityItem.js
import React from 'react';
import styles from '../styles/ActivityItem.module.css';
import { 
  FiUserPlus, 
  FiEdit, 
  FiTrash2, 
  FiFileText, 
  FiPlusCircle,
  FiMessageSquare,
  FiHelpCircle,
  FiUpload,
  FiCheckSquare,
  FiUsers,
  FiCalendar,
  FiMail
} from 'react-icons/fi';

// System event icons (existing)
const systemEventIcons = {
  "User Account Created": <FiUserPlus />,
  "User Account Updated": <FiEdit />,
  "User Account Deleted": <FiTrash2 />,
  "Report Generated": <FiFileText />,
  "Course Created": <FiPlusCircle />,
};

// Activity log type icons (new)
const activityLogIcons = {
  "MDB_REPLIES": <FiMessageSquare />,
  "TICKET_RESPONSES": <FiHelpCircle />,
  "ASSIGNMENT_UPLOAD": <FiUpload />,
  "ASSIGNMENT_MARKING": <FiCheckSquare />,
  "GDB_MARKING": <FiUsers />,
  "WEEKLY_SESSION": <FiCalendar />,
  "EMAIL_RESPONSES": <FiMail />,
};

// Activity type labels for display
const activityTypeLabels = {
  "MDB_REPLIES": "MDB Replies",
  "TICKET_RESPONSES": "Ticket Responses",
  "ASSIGNMENT_UPLOAD": "Assignment Upload",
  "ASSIGNMENT_MARKING": "Assignment Marking",
  "GDB_MARKING": "GDB Marking",
  "WEEKLY_SESSION": "Weekly Session",
  "EMAIL_RESPONSES": "Email Responses",
};

const getEventMessage = (event) => {
  // Handle instructor activity logs
  if (event.activity_type) {
    return getActivityLogMessage(event);
  }
  
  // Handle system events (existing logic)
  return getSystemEventMessage(event);
};

const getSystemEventMessage = (event) => {
  const actorName = event.actor && event.actor.first_name && event.actor.last_name
    ? `${event.actor.first_name} ${event.actor.last_name}`
    : 'Unknown User';

  switch (event.event_type) {
    case "User Account Created":
      return `${actorName} created a new user account: ${event.details?.username || 'Unknown User'}.`;
    case "User Account Updated":
      return `${actorName} updated the account for ${event.details?.username || 'Unknown User'}.`;
    case "User Account Deleted":
      return `${actorName} deleted the user account: ${event.details?.username || 'Unknown User'}.`;
    case "Report Generated":
      return `${actorName} generated a new report.`;
    case "Course Created":
      return `${actorName} created a new course.`;
    default:
      return "An unknown event occurred.";
  }
};

const getActivityLogMessage = (event) => {
  const instructorName = event.instructor && event.instructor.first_name && event.instructor.last_name
    ? `${event.instructor.first_name} ${event.instructor.last_name}`
    : (event.instructor?.username || 'Unknown Instructor');
  
  const courseName = event.course?.course_code || 'Unknown Course';
  const activityLabel = activityTypeLabels[event.activity_type] || event.activity_type;
  
  switch (event.activity_type) {
    case "MDB_REPLIES":
      const mdbTopic = event.details?.mdb_topic || 'Unknown Topic';
      const replyCount = event.details?.number_of_replies || 0;
      return `${instructorName} replied to MDB "${mdbTopic}" in ${courseName} (${replyCount} replies).`;
      
    case "TICKET_RESPONSES":
      const ticketId = event.details?.ticket_id || 'Unknown Ticket';
      const summary = event.details?.response_summary;
      return `${instructorName} responded to ticket ${ticketId} for ${courseName}${summary ? `: ${summary.substring(0, 50)}${summary.length > 50 ? '...' : ''}` : ''}.`;
      
    case "ASSIGNMENT_UPLOAD":
      const assignmentName = event.details?.assignment_name || 'Unknown Assignment';
      const materialType = event.details?.material_type || 'Material';
      return `${instructorName} uploaded ${materialType.toLowerCase()} "${assignmentName}" for ${courseName}.`;
      
    case "ASSIGNMENT_MARKING":
      const markedAssignment = event.details?.assignment_name || 'Unknown Assignment';
      const numberMarked = event.details?.number_marked || 0;
      return `${instructorName} marked ${numberMarked} submissions for "${markedAssignment}" in ${courseName}.`;
      
    case "GDB_MARKING":
      const gdbTopic = event.details?.gdb_topic || 'Unknown Topic';
      const gdbMarked = event.details?.number_marked || 0;
      return `${instructorName} marked ${gdbMarked} GDB submissions for "${gdbTopic}" in ${courseName}.`;
      
    case "WEEKLY_SESSION":
      const sessionDate = event.details?.session_date || 'Unknown Date';
      const hasNotes = event.details?.attendance_notes;
      return `${instructorName} conducted weekly session for ${courseName} on ${sessionDate}${hasNotes ? ' (with notes)' : ''}.`;
      
    case "EMAIL_RESPONSES":
      const emailSubject = event.details?.email_subject || 'Unknown Subject';
      return `${instructorName} responded to email "${emailSubject}" related to ${courseName}.`;
      
    default:
      return `${instructorName} logged ${activityLabel.toLowerCase()} activity for ${courseName}.`;
  }
};

const getEventIcon = (event) => {
  // Handle instructor activity logs
  if (event.activity_type) {
    return activityLogIcons[event.activity_type] || <FiFileText />;
  }
  
  // Handle system events
  return systemEventIcons[event.event_type] || <FiFileText />;
};

const getAvatarInitials = (event) => {
  // Handle instructor activity logs
  if (event.activity_type && event.instructor) {
    return event.instructor.first_name && event.instructor.last_name
      ? `${event.instructor.first_name.charAt(0)}${event.instructor.last_name.charAt(0)}`
      : (event.instructor.username ? event.instructor.username.charAt(0).toUpperCase() : 'I');
  }
  
  // Handle system events
  if (event.actor) {
    return event.actor.first_name && event.actor.last_name
      ? `${event.actor.first_name.charAt(0)}${event.actor.last_name.charAt(0)}`
      : (event.actor.username ? event.actor.username.charAt(0).toUpperCase() : 'U');
  }
  
  return 'N/A';
};

const getTimestamp = (event) => {
  // Handle instructor activity logs (uses log_date)
  if (event.activity_type) {
    return new Date(event.log_date).toLocaleString();
  }
  
  // Handle system events (uses timestamp)
  return new Date(event.timestamp).toLocaleString();
};

const getEventTypeClass = (event) => {
  if (event.activity_type) {
    return `activityLog ${event.activity_type.toLowerCase()}`;
  }
  
  return `systemEvent ${event.event_type?.replace(/\s+/g, '_').toLowerCase() || 'unknown'}`;
};

const ActivityItem = ({ event }) => {
  console.log("event", event);
  
  const avatarInitials = getAvatarInitials(event);
  const eventIcon = getEventIcon(event);
  const eventMessage = getEventMessage(event);
  const timestamp = getTimestamp(event);
  const eventTypeClass = getEventTypeClass(event);

  return (
    <div className={`${styles.itemContainer} ${styles[eventTypeClass]}`}>
      <div className={styles.avatar}>
        {avatarInitials}
      </div>
      <div className={styles.itemContent}>
        <p className={styles.message}>{eventMessage}</p>
        <div className={styles.metadata}>
          <span className={styles.timestamp}>{timestamp}</span>
          {event.activity_type && (
            <span className={styles.activityType}>
              {activityTypeLabels[event.activity_type]}
            </span>
          )}
          {event.course && (
            <span className={styles.courseTag}>
              {event.course.course_code}
            </span>
          )}
        </div>
      </div>
      <div className={styles.icon}>
        {eventIcon}
      </div>
    </div>
  );
};

export default ActivityItem;