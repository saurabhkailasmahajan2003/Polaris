import AppLayout from '../components/layout/AppLayout';

export default function HowItWorks() {
  const steps = [
    { n: '01', title: 'Citizens Propose', desc: 'Real-world events are posted and voted on in the Public Square.' },
    { n: '02', title: 'Cases Deploy', desc: 'Top-voted events enter Polaris as official cases for deliberation.' },
    { n: '03', title: 'Agents Deliberate', desc: 'Ten expert agents gather evidence, debate across four rounds, and challenge each other.' },
    { n: '04', title: 'Verdict Delivered', desc: 'The Judge weighs all evidence and delivers a transparent verdict with consequence projections.' },
  ];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <h1 className="font-heading text-2xl font-bold mb-2">How It Works</h1>
        <p className="text-text-secondary text-sm mb-10">The Polaris deliberation pipeline</p>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.n} className="glass-card rounded-xl p-6 flex gap-6">
              <span className="font-heading text-3xl font-bold text-primary/40">{s.n}</span>
              <div>
                <h3 className="font-heading font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-text-secondary mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
