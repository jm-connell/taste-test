import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function StatsDisplay() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('spotify_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching stats:', error);
      } else {
        setStats(data);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <p>Loading stats...</p>;
  }

  return (
    <div>
      <p>{stats.new_artists} new artists listened to this month</p>
      <p>{stats.rap_increase}% more rap in the past 3 months</p>
    </div>
  );
}

export default StatsDisplay;
