import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Banner = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/contests?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="hero min-h-[70vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
      <div className="hero-content text-center flex-col max-w-3xl">
        <div className="badge badge-primary badge-outline mb-4">The #1 Contest Platform</div>
        <h1 className="text-5xl font-extrabold leading-tight">
          Compete. Create. <span className="text-primary">Win.</span>
        </h1>
        <p className="py-4 text-xl text-base-content/70 max-w-xl">
          Join thousands of creators competing in design, writing, marketing, and more.
          Show your talent and win amazing prizes.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-lg">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search contests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="flex gap-4 flex-wrap justify-center mt-6">
          {['Image Design', 'Article Writing', 'Marketing', 'Gaming', 'Book Review'].map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/contests?type=${tag.toLowerCase().replace(' ', '-')}`)}
              className="badge badge-outline badge-primary cursor-pointer hover:badge-primary transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
