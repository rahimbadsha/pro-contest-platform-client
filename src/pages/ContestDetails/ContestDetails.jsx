import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPublic, axiosSecure } from '../../hooks/useAxios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import Swal from 'sweetalert2';
import { FaUsers, FaTrophy, FaClock, FaTag } from 'react-icons/fa';

const useCountdown = (deadline) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return timeLeft;
};

const ContestDetails = () => {
  const { slug } = useParams();
  const { user, dbUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');
  const [notes, setNotes] = useState('');

  const { data: contest, isLoading, error } = useQuery({
    queryKey: ['contest', slug],
    queryFn: () => axiosPublic.get(`/contests/${slug}`).then((r) => r.data),
  });

  const { data: mySubmissionData } = useQuery({
    queryKey: ['mySubmission', contest?._id],
    queryFn: () => axiosSecure.get(`/user/submission/${contest._id}`).then((r) => r.data),
    enabled: !!user && !!contest?._id,
  });

  const mySubmission = mySubmissionData?.submission;
  const hasPaid = mySubmission?.paymentStatus === 'paid';
  const hasSubmitted = hasPaid && !!mySubmission?.submissionLink;

  const timeLeft = useCountdown(contest?.deadline);

  const submitMutation = useMutation({
    mutationFn: () => axiosSecure.post('/user/submit', { contestId: contest._id, submissionLink, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmission', contest._id] });
      setShowSubmitModal(false);
      Swal.fire({ icon: 'success', title: 'Entry submitted!', text: 'Your submission has been received.', timer: 2000, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Submission failed' }),
  });

  const handleRegister = async () => {
    if (!user) {
      Swal.fire({ icon: 'info', title: 'Login required', text: 'Please login to participate' });
      return navigate('/login');
    }

    try {
      const { data } = await axiosSecure.post('/payment/create-checkout-session', { contestId: contest._id });
      window.location.href = data.url;
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Something went wrong' });
    }
  };

  if (isLoading) return <Spinner />;
  if (error || !contest) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-error">Contest not found</h2>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <figure className="h-64">
          <img
            src={contest.image || 'https://placehold.co/800x300?text=Contest'}
            alt={contest.name}
            className="w-full h-full object-cover"
          />
        </figure>

        <div className="card-body">
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="badge badge-primary capitalize">{contest.type?.replace(/-/g, ' ')}</div>
            <div className={`badge ${contest.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
              {contest.status}
            </div>
          </div>

          <h1 className="text-3xl font-bold">{contest.name}</h1>
          <p className="text-base-content/70">{contest.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <div className="stat bg-base-200 rounded-box p-3">
              <div className="stat-figure text-primary"><FaUsers /></div>
              <div className="stat-title text-xs">Participants</div>
              <div className="stat-value text-lg">{contest.participantsCount}</div>
            </div>
            <div className="stat bg-base-200 rounded-box p-3">
              <div className="stat-figure text-warning"><FaTrophy /></div>
              <div className="stat-title text-xs">Prize</div>
              <div className="stat-value text-lg">${contest.prize}</div>
            </div>
            <div className="stat bg-base-200 rounded-box p-3">
              <div className="stat-figure text-success"><FaTag /></div>
              <div className="stat-title text-xs">Entry Fee</div>
              <div className="stat-value text-lg">${contest.price}</div>
            </div>
            <div className="stat bg-base-200 rounded-box p-3">
              <div className="stat-figure text-info"><FaClock /></div>
              <div className="stat-title text-xs">Deadline</div>
              <div className="stat-value text-sm">{new Date(contest.deadline).toLocaleDateString()}</div>
            </div>
          </div>

          {contest.task && (
            <div className="bg-base-200 rounded-box p-4 mb-4">
              <h3 className="font-bold mb-1">Task Description</h3>
              <p className="text-sm text-base-content/70">{contest.task}</p>
            </div>
          )}

          {/* Countdown */}
          {!timeLeft.expired ? (
            <div className="bg-primary/10 rounded-box p-4 mb-4">
              <h3 className="font-bold text-center mb-3 text-primary">Time Remaining</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[['days', 'Days'], ['hours', 'Hours'], ['minutes', 'Min'], ['seconds', 'Sec']].map(([key, label]) => (
                  <div key={key} className="bg-primary text-primary-content rounded-box p-2">
                    <span className="text-2xl font-bold">{timeLeft[key] ?? 0}</span>
                    <p className="text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="alert alert-error mb-4">Contest deadline has passed</div>
          )}

          {/* Creator info */}
          {contest.creator && (
            <div className="flex items-center gap-3 border-t border-base-200 pt-4 mb-4">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={contest.creator.photoUrl || `https://ui-avatars.com/api/?name=${contest.creator.name}`} alt={contest.creator.name} />
                </div>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Created by</p>
                <p className="font-semibold">{contest.creator.name}</p>
              </div>
            </div>
          )}

          {/* Winner badge */}
          {contest.winnerDeclared && contest.winner && (
            <div className="alert alert-warning mb-4">
              <FaTrophy /> Winner: <strong>{contest.winner.name}</strong>
            </div>
          )}

          {/* Action buttons */}
          {!contest.winnerDeclared && (
            <div className="flex flex-col gap-3">
              {hasPaid ? (
                hasSubmitted ? (
                  <div className="alert alert-success">
                    <FaTrophy /> Your entry has been submitted! Good luck.
                  </div>
                ) : (
                  <button onClick={() => setShowSubmitModal(true)} className="btn btn-success btn-lg w-full">
                    Submit Your Entry
                  </button>
                )
              ) : (
                !timeLeft.expired && (
                  <button onClick={handleRegister} className="btn btn-primary btn-lg w-full">
                    Register for ${contest.price}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submit Task Modal */}
      {showSubmitModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Submit Your Entry</h3>
            <div className="form-control mb-4">
              <label className="label"><span className="label-text">Submission Link *</span></label>
              <input
                type="url"
                placeholder="https://your-submission-link.com"
                className="input input-bordered"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
              />
            </div>
            <div className="form-control mb-6">
              <label className="label"><span className="label-text">Notes (optional)</span></label>
              <textarea
                rows={3}
                placeholder="Any additional notes about your submission..."
                className="textarea textarea-bordered"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                disabled={!submissionLink || submitMutation.isPending}
                onClick={() => submitMutation.mutate()}
              >
                {submitMutation.isPending ? <span className="loading loading-spinner" /> : 'Submit Entry'}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowSubmitModal(false)}>Cancel</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowSubmitModal(false)} />
        </div>
      )}
    </div>
  );
};

export default ContestDetails;
