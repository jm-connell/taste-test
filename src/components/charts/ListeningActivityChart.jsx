import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useSpotifyToken } from '../../context/SpotifyTokenContext';
import { fetchRecentlyPlayedTracks } from '../../services/spotifyService';
import ChartWrapper from './ChartWrapper';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chart.js/auto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const ListeningActivityChart = () => {
  const spotifyToken = useSpotifyToken();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getListeningActivity = async () => {
      if (!spotifyToken) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching listening activity data...');
        // Fetch as much history as possible (similar to TopArtist)
        let allTracks = [];
        let url = null;

        for (let i = 0; i < 10; i++) {
          // Try to get up to 500 tracks (10 * 50)
          const data = await fetchRecentlyPlayedTracks(spotifyToken, url);
          if (!data || !data.items) {
            console.error('Invalid data returned from API:', data);
            throw new Error('Invalid data returned from Spotify API');
          }

          allTracks = allTracks.concat(data.items);
          url = data.next;
          if (!url) break;
        }

        console.log(
          `Retrieved ${allTracks.length} tracks for activity analysis`
        );

        if (allTracks.length === 0) {
          setError('No recently played tracks found');
          setLoading(false);
          return;
        }

        // Group tracks by day
        const tracksByDay = {};

        // Calculate date range (from earliest to today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find earliest date in data
        let earliestDate = new Date();
        allTracks.forEach((item) => {
          const playDate = new Date(item.played_at);
          if (playDate < earliestDate) {
            earliestDate = playDate;
          }
        });
        earliestDate.setHours(0, 0, 0, 0);

        // Initialize all days in range with zero plays
        for (
          let d = new Date(earliestDate);
          d <= today;
          d.setDate(d.getDate() + 1)
        ) {
          const dateString = d.toISOString().split('T')[0]; // YYYY-MM-DD
          tracksByDay[dateString] = 0;
        }

        // Count plays per day
        allTracks.forEach((item) => {
          const date = new Date(item.played_at);
          const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
          tracksByDay[dateString] += 1;
        });

        // Prepare data for chart
        const sortedDays = Object.keys(tracksByDay).sort();
        const labels = [];
        const data = [];

        sortedDays.forEach((day) => {
          const date = new Date(day);
          // Format as 'MM/DD'
          const label = date.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
          });

          labels.push(label);
          data.push(tracksByDay[day]);
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Songs Played',
              data,
              fill: false,
              backgroundColor: 'rgba(92, 207, 230, 0.2)', // --accent-color with transparency
              borderColor: '#5ccfe6', // --accent-color
              tension: 0.1,
              pointBackgroundColor: '#5ccfe6',
              pointBorderColor: '#121212', // --background-color
              pointHoverBackgroundColor: '#ffffff', // --text-color
              pointHoverBorderColor: '#5ccfe6', // --accent-color
              // Don't show points if there are too many data points
              pointRadius: sortedDays.length > 30 ? 0 : 3,
              pointHoverRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error('Error in ListeningActivityChart component:', error);
        setError(error.message || 'Failed to load listening activity data');
      } finally {
        setLoading(false);
      }
    };

    getListeningActivity();
  }, [spotifyToken]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff', // --text-color
          font: {
            family: 'Roboto, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: '#1e1e1e', // --card-background-color
        titleColor: '#ffffff', // --text-color
        bodyColor: '#b3b3b3', // --secondary-text-color
        borderColor: '#282828', // --border-color
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const date = new Date(Object.keys(chartData?.labels || {})[index]);
            return date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          },
          label: (context) => {
            return `${context.parsed.y} songs played`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#b3b3b3', // --secondary-text-color
          font: {
            family: 'Roboto, sans-serif',
          },
          // Only show some of the labels if there are many days
          maxTicksLimit: 15,
          callback: function (value, index, values) {
            const allLabels = this.chart.data.labels;
            // For many data points, only show every nth label
            const step = Math.ceil(allLabels.length / 15);
            if (index % step !== 0 && index !== allLabels.length - 1) {
              return '';
            }
            return allLabels[index];
          },
        },
        grid: {
          color: 'rgba(40, 40, 40, 0.5)', // --border-color with transparency
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#b3b3b3', // --secondary-text-color
          font: {
            family: 'Roboto, sans-serif',
          },
        },
        grid: {
          color: 'rgba(40, 40, 40, 0.5)', // --border-color with transparency
        },
      },
    },
  };

  return (
    <ChartWrapper
      title="Daily Listening Activity"
      loading={loading}
      error={error}
    >
      {chartData && (
        <div
          style={{
            height: '300px',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <Line data={chartData} options={options} />
        </div>
      )}
    </ChartWrapper>
  );
};

export default ListeningActivityChart;
