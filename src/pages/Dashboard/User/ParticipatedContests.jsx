import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import Spinner from '../../../components/Spinner';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 10;

const ParticipatedContests = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['participatedContests', page],
    queryFn: () => axiosSecure.get(`/user/participated-contests?page=${page}&limit=${PAGE_SIZE}`).then((r) => r.data),
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Participated Contests</h2>
      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Contest</th>
              <th>Type</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Winner</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.submissions?.map((sub, i) => (
              <tr key={sub._id}>
                <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="font-medium">{sub.contest?.name}</td>
                <td><span className="badge badge-sm capitalize">{sub.contest?.type?.replace(/-/g, ' ')}</span></td>
                <td>{new Date(sub.contest?.deadline).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-sm ${sub.contest?.status === 'ended' ? 'badge-error' : 'badge-success'}`}>
                    {sub.contest?.status}
                  </span>
                </td>
                <td>
                  {sub.contest?.winnerDeclared ? (
                    sub.isWinner ? <span className="badge badge-warning">You Won!</span> : <span className="badge badge-ghost">Other</span>
                  ) : '-'}
                </td>
                <td>
                  <Link to={`/contests/${sub.contest?.slug}`} className="btn btn-xs btn-ghost">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.submissions?.length && (
          <p className="text-center py-10 text-base-content/50">No participated contests yet</p>
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

export default ParticipatedContests;
