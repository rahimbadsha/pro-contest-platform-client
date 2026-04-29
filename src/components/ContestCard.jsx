import { Link } from 'react-router-dom';
import { FaUsers, FaTrophy, FaClock } from 'react-icons/fa';

const ContestCard = ({ contest }) => {
  const deadline = new Date(contest.deadline);
  const isExpired = deadline < new Date();

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-200">
      <figure className="h-48 overflow-hidden">
        <img
          src={contest.image || 'https://placehold.co/400x200?text=Contest'}
          alt={contest.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </figure>
      <div className="card-body">
        <div className="badge badge-primary badge-sm capitalize">{contest.type?.replace(/-/g, ' ')}</div>
        <h2 className="card-title text-lg line-clamp-2">{contest.name}</h2>
        <p className="text-sm text-base-content/70 line-clamp-2">{contest.description}</p>

        <div className="flex items-center gap-4 text-sm text-base-content/60 mt-2">
          <span className="flex items-center gap-1">
            <FaUsers /> {contest.participantsCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaTrophy /> ${contest.prize || 0}
          </span>
          <span className={`flex items-center gap-1 ${isExpired ? 'text-error' : 'text-success'}`}>
            <FaClock /> {isExpired ? 'Ended' : deadline.toLocaleDateString()}
          </span>
        </div>

        <div className="card-actions justify-between items-center mt-2">
          <span className="font-bold text-primary">${contest.price} entry</span>
          <Link to={`/contests/${contest.slug}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
