// src/components/RecentActivityFeed.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import ActivityItem from './ActivityItem';
import styles from '../styles/Dashboard.module.css';

const RecentActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await apiClient.get('/dashboard/admin/activity-feed/');
        setActivities(response.data.data);
      } catch (err) {
        setError('Could not load recent activity.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) return <p>Loading activity...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div>
      {activities.length > 0 ? (
        activities.map(event => <ActivityItem key={event.id} event={event} />)
      ) : (
        <p>No recent system activity found.</p>
      )}
    </div>
  );
};

export default RecentActivityFeed;