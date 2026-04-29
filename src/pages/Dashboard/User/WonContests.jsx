import { useQuery } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import Spinner from '../../../components/Spinner';
import { FaMedal } from 'react-icons/fa';

const WonContests = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['wonContests'],
    queryFn: () => axiosSecure.get('/user/won-contests').then((r) => r.data),
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Won Contests</h2>
      {data?.contests?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.contests.map((c) => (
            <div key={c._id} className="card bg-base-100 shadow border border-warning/30">
              <div className="card-body">
                <div className="flex items-center gap-2">
                  <FaMedal className="text-warning text-xl" />
                  <h3 className="font-bold">{c.name}</h3>
                </div>
                <span className="badge badge-sm capitalize">{c.type?.replace(/-/g, ' ')}</span>
                <p className="text-sm text-base-content/60">Prize: <span className="font-bold text-warning">${c.prize}</span></p>
                <p className="text-xs text-base-content/40">{new Date(c.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-base-content/50">
          <FaMedal className="text-4xl mx-auto mb-3 opacity-20" />
          <p>No wins yet. Keep competing!</p>
        </div>
      )}
    </div>
  );
};

export default WonContests;
