import { useQuery } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import Spinner from '../../../components/Spinner';
import { FaUsers, FaList, FaCheckCircle } from 'react-icons/fa';

const AdminOverview = () => {
  const { data: usersData, isLoading: uLoading } = useQuery({
    queryKey: ['adminUsers', 1],
    queryFn: () => axiosSecure.get('/admin/users?limit=1').then((r) => r.data),
  });
  const { data: contestsData, isLoading: cLoading } = useQuery({
    queryKey: ['adminContests', 1],
    queryFn: () => axiosSecure.get('/admin/contests?limit=1').then((r) => r.data),
  });

  if (uLoading || cLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-primary"><FaUsers /></div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{usersData?.total || 0}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-secondary"><FaList /></div>
          <div className="stat-title">Total Contests</div>
          <div className="stat-value text-secondary">{contestsData?.total || 0}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-success"><FaCheckCircle /></div>
          <div className="stat-title">Platform</div>
          <div className="stat-value text-success">Live</div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
