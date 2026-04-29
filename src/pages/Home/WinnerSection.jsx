import { useQuery } from '@tanstack/react-query';
import { axiosPublic } from '../../hooks/useAxios';
import Spinner from '../../components/Spinner';
import { FaMedal } from 'react-icons/fa';

const WinnerSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['contestWinners'],
    queryFn: () => axiosPublic.get('/contests/winners').then((r) => r.data.contests),
  });

  if (isLoading) return <Spinner />;
  if (!data?.length) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <FaMedal className="text-warning text-4xl mx-auto mb-2" />
          <h2 className="text-3xl font-bold">Contest Winners</h2>
          <p className="text-base-content/60 mt-2">Celebrating our talented winners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((contest) => (
            <div key={contest._id} className="card bg-base-100 shadow-lg border border-warning/20">
              <div className="card-body text-center">
                <div className="avatar mx-auto mb-3">
                  <div className="w-16 rounded-full ring ring-warning ring-offset-base-100 ring-offset-2">
                    <img
                      src={contest.winner?.photoUrl || `https://ui-avatars.com/api/?name=${contest.winner?.name || 'W'}&background=f59e0b&color=fff`}
                      alt={contest.winner?.name}
                    />
                  </div>
                </div>
                <FaMedal className="text-warning text-2xl mx-auto mb-1" />
                <h3 className="font-bold">{contest.winner?.name}</h3>
                <p className="text-sm text-base-content/60">Won: <span className="font-medium text-base-content">{contest.name}</span></p>
                <div className="badge badge-warning badge-outline mt-1">${contest.prize} Prize</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WinnerSection;
