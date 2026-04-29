import { FaSearch, FaCreditCard, FaUpload, FaTrophy, FaUserCheck, FaList } from 'react-icons/fa';

const steps = [
  { icon: <FaUserCheck className="text-primary text-3xl" />, step: '01', title: 'Create Account', desc: 'Sign up with email or Google. Your profile tracks all your contest activity and wins.' },
  { icon: <FaSearch className="text-secondary text-3xl" />, step: '02', title: 'Browse Contests', desc: 'Explore contests by category. Filter by type, search by name, and find your perfect challenge.' },
  { icon: <FaCreditCard className="text-success text-3xl" />, step: '03', title: 'Register & Pay', desc: 'Pay the entry fee securely via Stripe. Your spot is confirmed immediately after payment.' },
  { icon: <FaUpload className="text-warning text-3xl" />, step: '04', title: 'Submit Your Work', desc: 'Upload your submission link before the deadline. You can add notes to explain your entry.' },
  { icon: <FaList className="text-info text-3xl" />, step: '05', title: 'Creator Reviews', desc: 'Contest creators review all submissions and pick the best one as the winner.' },
  { icon: <FaTrophy className="text-warning text-3xl" />, step: '06', title: 'Win & Get Recognized', desc: 'Winners receive prize money and appear on the public leaderboard. Build your reputation!' },
];

const HowItWorks = () => (
  <div className="max-w-5xl mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold">How It Works</h1>
      <p className="text-base-content/60 mt-3 text-lg">Your journey from signup to winning in 6 simple steps</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {steps.map(({ icon, step, title, desc }) => (
        <div key={step} className="flex gap-4 card bg-base-100 shadow p-6">
          <div className="flex-shrink-0">{icon}</div>
          <div>
            <div className="text-xs font-bold text-base-content/40 mb-1">STEP {step}</div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-base-content/60 text-sm">{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center mt-12">
      <a href="/contests" className="btn btn-primary btn-lg">Start Competing Now</a>
    </div>
  </div>
);

export default HowItWorks;
