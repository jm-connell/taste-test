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

const GenreDistributionChart = () => {
  const spotifyToken = useSpotifyToken();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme colors with transparency variations
  const themeColors = [
    'rgba(92, 207, 230, 1)', // --accent-color
    'rgba(92, 207, 230, 0.8)',
    'rgba(92, 207, 230, 0.6)',
    'rgba(92, 207, 230, 0.4)',
    'rgba(92, 207, 230, 0.9)',
    'rgba(92, 207, 230, 0.7)',
    'rgba(92, 207, 230, 0.5)',
    'rgba(255, 255, 255, 0.8)', // --text-color with transparency
    'rgba(255, 255, 255, 0.6)',
    'rgba(255, 255, 255, 0.4)',
  ];

  useEffect(() => {
    const getGenreData = async () => {
      if (!spotifyToken) {
        setLoading(false);
        return;
      }

      try {
        const artists = await fetchTopArtists(spotifyToken, 'medium_term', 30);
        if (!artists || !artists.items || artists.items.length === 0) {
          setError('No top artists available');
          setLoading(false);
          return;
        }

        // Count genres
        const genreCounts = {};
        artists.items.forEach((artist) => {
          if (artist.genres && artist.genres.length > 0) {
            artist.genres.forEach((genre) => {
              if (!genreCounts[genre]) {
                genreCounts[genre] = 0;
              }
              // We weight by position in the top artists list
              // Higher ranked artists contribute more to the genre count
              genreCounts[genre] += (30 - artists.items.indexOf(artist)) / 10;
            });
          }
        });

        // Sort genres by count and take top 8, combine others
        const sortedGenres = Object.keys(genreCounts).sort(
          (a, b) => genreCounts[b] - genreCounts[a]
        );

        const topGenres = sortedGenres.slice(0, 7);
        const labels = [...topGenres];
        const data = topGenres.map((genre) => genreCounts[genre]);

        // Add "Other" category if there are more genres
        if (sortedGenres.length > 7) {
          labels.push('Other');
          const otherSum = sortedGenres
            .slice(7)
            .reduce((sum, genre) => sum + genreCounts[genre], 0);
          data.push(otherSum);
        }

        // Capitalize genre names for display
        const formattedLabels = labels.map((label) =>
          label
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );

        setChartData({
          labels: formattedLabels,
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
        setError(error.message || 'Failed to load genre data');
      } finally {
        setLoading(false);
      }
    };

    getGenreData();
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
    <ChartWrapper title="Genre Distribution" loading={loading} error={error}>
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

export default GenreDistributionChart;
