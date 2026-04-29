import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosPublic } from '../../hooks/useAxios';
import Spinner from '../../components/Spinner';
import { FaMedal, FaTrophy, FaCrown } from 'react-icons/fa';

const PAGE_SIZE = 10;

const rankIcon = (rank) => {
  if (rank === 1) return <FaCrown className="text-yellow-400 text-xl" />;
  if (rank === 2) return <FaMedal className="text-gray-400 text-xl" />;
  if (rank === 3) return <FaMedal className="text-amber-600 text-xl" />;
  return <span className="font-bold text-base-content/60">#{rank}</span>;
};

const Leaderboard = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', page],
    queryFn: () => axiosPublic.get(`/leaderboard?page=${page}&limit=${PAGE_SIZE}`).then((r) => r.data),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <FaTrophy className="text-warning text-5xl mx-auto mb-3" />
        <h1 className="text-4xl font-bold">Leaderboard</h1>
        <p className="text-base-content/60 mt-2">Top performers ranked by contest wins</p>
      </div>

      <div className="bg-base-100 rounded-box shadow overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Wins</th>
              <th>Participated</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((u, i) => {
              const rank = (page - 1) * PAGE_SIZE + i + 1;
              const winRate = u.participated > 0 ? ((u.wins / u.participated) * 100).toFixed(1) : 0;
              return (
                <tr key={u._id} className={rank <= 3 ? 'bg-warning/5 font-semibold' : ''}>
                  <td className="w-16">{rankIcon(rank)}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className={`w-10 rounded-full ${rank === 1 ? 'ring ring-yellow-400 ring-offset-1' : rank === 2 ? 'ring ring-gray-400 ring-offset-1' : rank === 3 ? 'ring ring-amber-600 ring-offset-1' : ''}`}>
                          <img src={u.photoUrl || `https://ui-avatars.com/api/?name=${u.name}&background=random`} alt={u.name} />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-base-content/50">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-warning">{u.wins}</span></td>
                  <td>{u.participated}</td>
                  <td>{winRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!data?.users?.length && (
          <div className="text-center py-16 text-base-content/50">
            <FaTrophy className="text-4xl mx-auto mb-3 opacity-20" />
            <p>No winners yet. Be the first!</p>
          </div>
        )}
      </div>

      {data?.totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setPage(i + 1)} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
