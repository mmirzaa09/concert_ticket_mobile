import {useState, useEffect} from 'react';
import {Concert} from '../types';

// Mock data for development
const mockConcerts: Concert[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    artist: 'Various Artists',
    date: '2024-08-15',
    venue: 'Central Park',
    price: 500000,
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'The biggest summer music festival featuring top artists',
    totalTickets: 10000,
    availableTickets: 2500,
    queueCount: 150,
  },
  {
    id: '2',
    title: 'Rock Night',
    artist: 'The Rockstars',
    date: '2024-09-20',
    venue: 'Stadium Arena',
    price: 750000,
    image:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    description: 'An electrifying rock concert experience',
    totalTickets: 5000,
    availableTickets: 800,
    queueCount: 75,
  },
];

interface UseConcertsResult {
  concerts: Concert[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useConcerts = (): UseConcertsResult => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConcerts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConcerts(mockConcerts);
    } catch (err) {
      setError('Failed to fetch concerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcerts();
  }, []);

  return {
    concerts,
    loading,
    error,
    refetch: fetchConcerts,
  };
};

interface UseConcertResult {
  concert: Concert | null;
  loading: boolean;
  error: string | null;
}

export const useConcert = (concertId: string): UseConcertResult => {
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcert = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundConcert = mockConcerts.find(c => c.id === concertId);
        if (foundConcert) {
          setConcert(foundConcert);
        } else {
          setError('Concert not found');
        }
      } catch (err) {
        setError('Failed to fetch concert details');
      } finally {
        setLoading(false);
      }
    };

    fetchConcert();
  }, [concertId]);

  return {
    concert,
    loading,
    error,
  };
};
