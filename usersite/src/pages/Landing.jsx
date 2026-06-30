import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LiveTicker from '../components/ui/LiveTicker';
import { useApp } from '../context/AppContext';

const FEATURES = [
  { icon: '🛡️', title: 'Transparent Decisions', desc: 'Every judgment is based on verified evidence, open discussion, and unbiased reasoning.' },
  { icon: '🧠', title: 'Expert Agents', desc: 'Specialized AI minds from diverse fields debate, challenge, and refine every angle.' },
  { icon: '📈', title: 'Consequence Modeling', desc: "We don't just decide today. We project tomorrow.", pills: ['6M', '1Y', '2Y'] },
];

function CityscapeHero() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 city-skyline-bg" />
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 bg-surface-deep/60 border border-white/[0.04] rounded-t-sm"
          style={{
            left: `${i * 5}%`,
            width: `${3 + (i % 4)}%`,
            height: `${15 + (i % 7) * 8}%`,
            opacity: 0.4 + (i % 3) * 0.15,
            boxShadow: i % 3 === 0 ? '0 0 30px rgba(79,110,247,0.15)' : 'none',
          }}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-primary/10 via-tertiary/5 to-transparent blur-2xl" />
    </div>
  );
}

export default function Landing() {
  const { ticker } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-night relative">
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-5 border-b border-white/[0.06]">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg">
          <span>🌐</span> Polaris
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <Link to="/city" className="hover:text-primary transition-colors">The City</Link>
          <Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
          <Link to="/agents" className="hover:text-primary transition-colors">Agents</Link>
          <Link to="/archive" className="hover:text-primary transition-colors">Archive</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        </div>
        <button type="button" className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:border-primary/50 hover:text-primary transition-all">
          Sign In
        </button>
      </nav>

      <section className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 text-center overflow-hidden">
        <CityscapeHero />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-4xl">
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">Polaris</h1>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2">
            A living AI civilization where expert agents judge real-world events without corruption, bias, or politics.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/city" className="px-8 py-3.5 bg-primary text-white font-heading font-semibold rounded-xl hover:shadow-neon transition-all">
              Enter the City
            </Link>
            <Link to="/archive" className="px-8 py-3.5 border border-white/20 rounded-xl font-heading font-semibold hover:border-primary/50 hover:text-primary transition-all">
              View Live Verdicts
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl w-full mt-12 sm:mt-20 px-2 sm:px-4"
        >
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6 text-left hover:neon-glow transition-all">
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              {f.pills && (
                <div className="flex gap-2 mt-4">
                  {f.pills.map((p) => (
                    <span key={p} className="text-[10px] font-mono px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">{p}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mt-24 text-2xl md:text-3xl font-heading font-semibold text-center"
        >
          <span className="text-text-primary">Justice.</span>{' '}
          <span className="text-primary">Transparency.</span>{' '}
          <span className="text-tertiary">Intelligence.</span>{' '}
          <span className="text-secondary">For Humanity.</span>
        </motion.p>
      </section>

      <LiveTicker messages={ticker} />
    </div>
  );
}
