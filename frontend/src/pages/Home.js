import './Home.css';
import { FaRocket, FaSliders, FaChartLine } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main className="home-page">
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="content-wrapper">
        <header className="hero-section">
          <h1 className="hero-title">
            Intelligent 
            <span className="highlight"> schedule </span>
            generation
          </h1>
          <p className="hero-subtitle">
            Generate optimal work schedules in seconds — save time, avoid conflicts, and maximize resource utilization.
          </p>
          <div className="cta-buttons">
            <Link to="/auth" className="btn btn-primary">Start now</Link>
            <button className="btn btn-secondary">Learn more</button>
          </div>
        </header>

        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <FaRocket size={40} />
            </div>
            <h3>Fast optimization</h3>
            <p>Generate schedules in seconds, taking into account availability, priorities, and competencies.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaSliders size={40} />
            </div>
            <h3>Flexible rules</h3>
            <p>Add vacations, time restrictions, skills, and preferences — the system will automatically take them into account.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine size={40} />
            </div>
            <h3>Insights and reports</h3>
            <p>Resource utilization analysis, conflict detection, and recommendations for schedule improvement.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
