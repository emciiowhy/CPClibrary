import { useState, useEffect } from 'react';
import axios from 'axios';

interface Member {
  id: number;
  name: string;
  studentId: string;
  email: string;
}

interface AddMemberData {
  name: string;
  studentId: string;
  email: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/members`);
      setMembers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData: AddMemberData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/members`, memberData);
      setError(null);
      // Refresh members list
      await fetchMembers();
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to add member';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const clearError = () => {
    setError(null);
  };

  return { members, loading, error, addMember, refetchMembers: fetchMembers, clearError };
};
