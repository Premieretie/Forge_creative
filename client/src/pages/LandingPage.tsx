import { Activity, Zap, Moon, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Activity className="h-6 w-6" />
            StreamPulse
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div className="flex gap-4">
             <button 
              onClick={() => navigate('/login')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 space-y-8 text-center px-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Stream smarter. <span className="text-primary">Don't burn out.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
              The first performance tool designed to help streamers avoid burnout while protecting viewership growth. 
              Track energy, consistency, and retention.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Start Tracking Free
            </button>
            <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 py-3 rounded-md text-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Activity className="h-8 w-8 text-blue-500" />,
                  title: "Stream Tracking",
                  desc: "Track stream length, game category, and platform automatically or manually."
                },
                {
                  icon: <Zap className="h-8 w-8 text-yellow-500" />,
                  title: "Load Calculation",
                  desc: "Calculate 'Stream Load' based on intensity (Chill vs Ranked) to measure true fatigue."
                },
                {
                  icon: <Moon className="h-8 w-8 text-purple-500" />,
                  title: "Sleep Estimates",
                  desc: "Non-invasive sleep tracking with smart alerts for low sleep or bad schedules."
                },
                {
                  icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
                  title: "Burnout Risk",
                  desc: "Weekly score predicting burnout risk based on load, rest, sleep, and mood."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-6 rounded-lg border border-border shadow-sm">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Prop */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why StreamPulse?</h2>
              <ul className="space-y-4">
                {[
                  "Streamers care about growth",
                  "Burnout is real but ignored",
                  "No competitors focus on performance + health",
                  "Easy MVP → expandable SaaS"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">✔</div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="font-bold">Weekly Report</div>
                  <div className="text-xs text-muted-foreground">Feb 12 - Feb 19</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Burnout Risk</span>
                    <span className="text-red-500 font-bold">High (68%)</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full w-[68%]" />
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    You streamed 5 days straight with declining mood. Prediction: 20-30% chance of viewer drop next week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 StreamPulse. Build for streamers, by streamers.</p>
        </div>
      </footer>
    </div>
  );
}
