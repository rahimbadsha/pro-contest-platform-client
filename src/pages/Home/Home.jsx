import Banner from './Banner';
import PopularContests from './PopularContests';
import WinnerSection from './WinnerSection';
import { FaLightbulb, FaUpload, FaTrophy } from 'react-icons/fa';

const steps = [
  { icon: <FaLightbulb className="text-primary text-3xl" />, title: 'Browse Contests', desc: 'Explore contests across design, writing, marketing, and more.' },
  { icon: <FaUpload className="text-secondary text-3xl" />, title: 'Register & Submit', desc: 'Pay entry fee, submit your work before the deadline.' },
  { icon: <FaTrophy className="text-warning text-3xl" />, title: 'Win Prizes', desc: 'Creator picks the best submission and you win!' },
];

const Home = () => (
  <div>
    <Banner />
    <PopularContests />
    <section className="py-16 bg-base-200">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-base-content/60 mt-2">Simple steps to start winning</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="flex justify-center mb-3">{icon}</div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-base-content/60 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <WinnerSection />
  </div>
);

export default Home;
