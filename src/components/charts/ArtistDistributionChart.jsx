import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { useSpotifyToken } from '../../context/SpotifyTokenContext';
import { fetchTopArtists } from '../../services/spotifyService';
import ChartWrapper from './ChartWrapper';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';

// Register the datalabels plugin
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ArtistDistributionChart = () => {
  const spotifyToken = useSpotifyToken();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme colors with variations
  const themeColors = [
    '#5ccfe6', // --accent-color
    'rgba(92, 207, 230, 0.9)',
    'rgba(92, 207, 230, 0.8)',
    'rgba(92, 207, 230, 0.7)',
    'rgba(92, 207, 230, 0.6)',
    'rgba(92, 207, 230, 0.5)',
    'rgba(255, 255, 255, 0.7)', // --text-color with transparency
    'rgba(255, 255, 255, 0.5)',
    'rgba(255, 255, 255, 0.3)',
    'rgba(179, 179, 179, 0.8)', // --secondary-text-color with transparency
  ];

  useEffect(() => {
    const getArtistData = async () => {
      if (!spotifyToken) {
        setLoading(false);
        return;
      }

      try {
        const artistsData = await fetchTopArtists(
          spotifyToken,
          'short_term',
          10
        );
        if (
          !artistsData ||
          !artistsData.items ||
          artistsData.items.length === 0
        ) {
          setError('No top artists available');
          setLoading(false);
          return;
        }

        // Extract top 7 artists and combine the rest as "Others"
        const topArtists = artistsData.items.slice(0, 7);
        const labels = topArtists.map((artist) => artist.name);

        // Calculate relative weights based on rank (higher rank = more weight)
        const totalArtists = artistsData.items.length;
        const weights = topArtists.map((_, index) => totalArtists - index);
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

        // Data is based on the weight (to show relative importance)
        const data = weights;

        // Add "Others" if there are more than 7 artists
        if (artistsData.items.length > 7) {
          labels.push('Others');

          // Calculate weight for others (combined weight of remaining artists)
          const othersWeight = artistsData.items
            .slice(7)
            .reduce((sum, _, index) => sum + (totalArtists - (7 + index)), 0);

          data.push(othersWeight);
        }

        setChartData({
          labels,
          datasets: [
            {
              data,
              backgroundColor: themeColors.slice(0, labels.length),
              borderColor: '#121212', // --background-color
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        setError(error.message || 'Failed to load artist data');
      } finally {
        setLoading(false);
      }
    };

    getArtistData();
  }, [spotifyToken]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const total = ctx.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = Math.round((value * 100) / total);
          return percentage >= 5 ? `${percentage}%` : ''; // Only show labels for segments 5% or larger
        },
        color: '#121212', // Dark text for contrast
        font: {
          weight: 'bold',
          size: 12,
        },
        textStrokeColor: 'white',
        textStrokeWidth: 1,
        align: 'center',
        anchor: 'center',
      },
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff', // --text-color
          font: {
            family: 'Roboto, sans-serif',
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#1e1e1e', // --card-background-color
        titleColor: '#ffffff', // --text-color
        bodyColor: '#b3b3b3', // --secondary-text-color
        borderColor: '#282828', // --border-color
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce(
              (sum, value) => sum + value,
              0
            );
            const percentage = Math.round((context.parsed * 100) / total);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <ChartWrapper title="Top Artists" loading={loading} error={error}>
      {chartData && (
        <div
          style={{
            height: '300px',
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <Pie data={chartData} options={options} />
        </div>
      )}
    </ChartWrapper>
  );
};

export default ArtistDistributionChart;
