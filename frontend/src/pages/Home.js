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
            Inteligentne generowanie
            <span className="highlight"> harmonogramów</span>
          </h1>
          <p className="hero-subtitle">
            Generuj optymalne plany pracy w kilka sekund — oszczędzaj czas, unikaj konfliktów i maksymalizuj wykorzystanie zasobów.
          </p>
          <div className="cta-buttons">
            <Link to="/auth" className="btn btn-primary">Zacznij Teraz</Link>
            <button className="btn btn-secondary">Dowiedz się więcej</button>
          </div>
        </header>

        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <FaRocket size={40} />
            </div>
            <h3>Szybka optymalizacja</h3>
            <p>Generuj harmonogramy w kilka sekund z uwzględnieniem dostępności, priorytetów i kompetencji.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaSliders size={40} />
            </div>
            <h3>Elastyczne reguły</h3>
            <p>Dodaj urlopy, ograniczenia godzinowe, umiejętności i preferencje — system uwzględni je automatycznie.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine size={40} />
            </div>
            <h3>Wgląd i raporty</h3>
            <p>Analizy wykorzystania zasobów, wykrywanie konfliktów i rekomendacje do poprawy grafiku.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
