import { useQuery } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import { useAuth } from '../../../context/AuthContext';
import Spinner from '../../../components/Spinner';
import { FaList, FaUsers, FaTrophy } from 'react-icons/fa';

const CreatorOverview = () => {
  const { dbUser } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['creatorContests', 1],
    queryFn: () => axiosSecure.get('/creator/my-contests?limit=100').then((r) => r.data),
  });

  if (isLoading) return <Spinner />;

  const contests = data?.contests || [];
  const totalParticipants = contests.reduce((sum, c) => sum + (c.participantsCount || 0), 0);
  const approvedCount = contests.filter((c) => c.status === 'approved').length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Creator Dashboard — {dbUser?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-primary"><FaList /></div>
          <div className="stat-title">My Contests</div>
          <div className="stat-value text-primary">{contests.length}</div>
          <div className="stat-desc">{approvedCount} approved</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-success"><FaUsers /></div>
          <div className="stat-title">Total Participants</div>
          <div className="stat-value text-success">{totalParticipants}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-warning"><FaTrophy /></div>
          <div className="stat-title">Winners Declared</div>
          <div className="stat-value text-warning">{contests.filter((c) => c.winnerDeclared).length}</div>
        </div>
      </div>
    </div>
  );
};

export default CreatorOverview;
