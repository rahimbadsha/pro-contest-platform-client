import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { axiosSecure } from '../../hooks/useAxios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Spinner from '../../components/Spinner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const sessionId = searchParams.get('session_id');
  const contestId = searchParams.get('contestId');

  useEffect(() => {
    if (!sessionId || !contestId) return setStatus('error');
    axiosSecure
      .post('/payment-success', { sessionId, contestId })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [sessionId, contestId]);

  if (status === 'loading') return <Spinner />;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'success' ? (
          <>
            <FaCheckCircle className="text-success text-6xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-base-content/60 mb-6">You're now registered for the contest. Submit your entry from your dashboard.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard/user/participated" className="btn btn-primary">My Contests</Link>
              <Link to="/contests" className="btn btn-ghost">Browse More</Link>
            </div>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-error text-6xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
            <p className="text-base-content/60 mb-6">Payment verification failed. Contact support if amount was charged.</p>
            <Link to="/contests" className="btn btn-primary">Back to Contests</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
