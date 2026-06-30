import AppLayout from '../components/layout/AppLayout';
import PageShell from '../components/layout/PageShell';

export default function HowItWorks() {
  const steps = [
    { n: '01', title: 'Citizens Propose', desc: 'Real-world events are posted and voted on in the Public Square.' },
    { n: '02', title: 'Cases Deploy', desc: 'Top-voted events enter Polaris as official cases for deliberation.' },
    { n: '03', title: 'Agents Deliberate', desc: 'Ten expert agents gather evidence, debate across four rounds, and challenge each other.' },
    { n: '04', title: 'Verdict Delivered', desc: 'The Judge weighs all evidence and delivers a transparent verdict with consequence projections.' },
  ];

  return (
    <AppLayout showWorldState={false} showTicker={false}>
      <PageShell title="How It Works" subtitle="The Polaris deliberation pipeline" maxWidth="max-w-3xl">
        <div className="space-y-4 sm:space-y-6">
          {steps.map((s) => (
            <div key={s.n} className="glass-card rounded-xl p-4 sm:p-6 flex gap-4 sm:gap-6">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-primary/40 shrink-0">{s.n}</span>
              <div className="min-w-0">
                <h3 className="font-heading font-semibold text-base sm:text-lg">{s.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    </AppLayout>
  );
}
