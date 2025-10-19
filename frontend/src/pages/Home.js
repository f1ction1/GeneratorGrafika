import './Home.css';

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
            Inteligentne Generowanie
            <span className="highlight"> Harmonogramów</span>
          </h1>
          <p className="hero-subtitle">
            plcaholder
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Zacznij Teraz</button>
            <button className="btn btn-secondary">Dowiedz się więcej</button>
          </div>
        </header>

        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>1</h3>
            <p>test</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>2</h3>
            <p>test</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"></div>
            <h3>3</h3>
            <p>test</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
