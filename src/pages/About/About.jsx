import { FaTrophy, FaUsers, FaGlobe } from 'react-icons/fa';

const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <FaTrophy className="text-primary text-5xl mx-auto mb-4" />
      <h1 className="text-4xl font-bold">About ContestHub</h1>
      <p className="text-base-content/60 mt-3 text-lg max-w-2xl mx-auto">
        ContestHub is the premier platform connecting talented creators with exciting contest opportunities across multiple creative domains.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {[
        { icon: <FaTrophy className="text-warning text-3xl" />, title: 'Our Mission', desc: 'To empower creators by providing a fair, transparent platform where talent wins.' },
        { icon: <FaUsers className="text-primary text-3xl" />, title: 'Our Community', desc: 'Thousands of creators and contest organizers from around the world.' },
        { icon: <FaGlobe className="text-success text-3xl" />, title: 'Global Reach', desc: 'Contests spanning design, writing, marketing, gaming, and more.' },
      ].map(({ icon, title, desc }) => (
        <div key={title} className="card bg-base-100 shadow text-center">
          <div className="card-body items-center">
            {icon}
            <h3 className="font-bold text-lg mt-2">{title}</h3>
            <p className="text-base-content/60 text-sm">{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="prose max-w-none">
      <h2 className="text-2xl font-bold mb-4">Why ContestHub?</h2>
      <ul className="space-y-2 text-base-content/70">
        <li>✅ Secure payment processing via Stripe</li>
        <li>✅ Transparent winner selection by contest creators</li>
        <li>✅ Multiple contest categories to match your skills</li>
        <li>✅ Competitive prizes and recognition</li>
        <li>✅ Easy-to-use dashboard for creators and participants</li>
        <li>✅ Real-time countdown timers and live participant counts</li>
      </ul>
    </div>
  </div>
);

export default About;
