import { useQuery } from '@tanstack/react-query';
import { axiosPublic } from '../../hooks/useAxios';
import ContestCard from '../../components/ContestCard';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';

const PopularContests = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['popularContests'],
    queryFn: () => axiosPublic.get('/contests/popular').then((r) => r.data.contests),
  });

  if (isLoading) return <Spinner />;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Popular Contests</h2>
        <p className="text-base-content/60 mt-2">Most participated contests right now</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((contest) => (
          <ContestCard key={contest._id} contest={contest} />
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/contests" className="btn btn-primary btn-wide">View All Contests</Link>
      </div>
    </section>
  );
};

export default PopularContests;
