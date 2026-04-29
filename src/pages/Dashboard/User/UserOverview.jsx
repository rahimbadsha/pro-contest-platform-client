import { useQuery } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import { useAuth } from '../../../context/AuthContext';
import Spinner from '../../../components/Spinner';
import { FaTrophy, FaMedal, FaChartPie } from 'react-icons/fa';

const UserOverview = () => {
  const { dbUser } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => axiosSecure.get('/user/profile').then((r) => r.data),
  });

  if (isLoading) return <Spinner />;

  const { stats } = data || {};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {dbUser?.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-primary"><FaTrophy /></div>
          <div className="stat-title">Participated</div>
          <div className="stat-value text-primary">{stats?.participated || 0}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-warning"><FaMedal /></div>
          <div className="stat-title">Wins</div>
          <div className="stat-value text-warning">{stats?.wins || 0}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-success"><FaChartPie /></div>
          <div className="stat-title">Win Rate</div>
          <div className="stat-value text-success">{stats?.winPercentage || 0}%</div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
