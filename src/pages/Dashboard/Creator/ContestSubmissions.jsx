import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosSecure } from '../../../hooks/useAxios';
import Spinner from '../../../components/Spinner';
import Swal from 'sweetalert2';
import { FaTrophy } from 'react-icons/fa';

const PAGE_SIZE = 10;

const ContestSubmissions = () => {
  const { contestId } = useParams();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['submissions', contestId, page],
    queryFn: () => axiosSecure.get(`/creator/contests/${contestId}/submissions?page=${page}&limit=${PAGE_SIZE}`).then((r) => r.data),
  });

  const winnerMutation = useMutation({
    mutationFn: (submissionId) => axiosSecure.post(`/creator/contests/${contestId}/declare-winner`, { submissionId }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', contestId] });
      Swal.fire({ icon: 'success', title: 'Winner declared!', text: `${res.data.winner?.name || 'Participant'} is the winner!`, timer: 2000 });
    },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message }),
  });

  const handleDeclareWinner = (submissionId, participantName) => {
    Swal.fire({
      title: `Declare ${participantName} as winner?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, declare winner!',
      confirmButtonColor: '#f59e0b',
    }).then((res) => { if (res.isConfirmed) winnerMutation.mutate(submissionId); });
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contest Submissions</h2>
      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Participant</th>
              <th>Submission Link</th>
              <th>Notes</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.submissions?.map((sub, i) => (
              <tr key={sub._id} className={sub.isWinner ? 'bg-warning/10' : ''}>
                <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img src={sub.participant?.photoUrl || `https://ui-avatars.com/api/?name=${sub.participant?.name}`} alt={sub.participant?.name} />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{sub.participant?.name}</p>
                      <p className="text-xs text-base-content/50">{sub.participant?.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  {sub.submissionLink ? (
                    <a href={sub.submissionLink} target="_blank" rel="noopener noreferrer" className="link link-primary text-sm">
                      View Submission
                    </a>
                  ) : (
                    <span className="text-base-content/40 text-sm">Not submitted yet</span>
                  )}
                </td>
                <td className="text-sm max-w-xs truncate">{sub.notes || '-'}</td>
                <td className="text-sm">{new Date(sub.createdAt).toLocaleDateString()}</td>
                <td>
                  {sub.isWinner ? (
                    <span className="badge badge-warning gap-1"><FaTrophy /> Winner</span>
                  ) : (
                    <button
                      onClick={() => handleDeclareWinner(sub._id, sub.participant?.name)}
                      className="btn btn-xs btn-warning"
                      disabled={winnerMutation.isPending}
                    >
                      Declare Winner
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.submissions?.length && (
          <p className="text-center py-10 text-base-content/50">No submissions yet</p>
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

export default ContestSubmissions;
