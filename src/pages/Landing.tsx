import React, { useEffect, useMemo, useRef } from 'react'; // RefObject removed from named imports
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react'; // Component imports
import type { LucideProps } from 'lucide-react'; // Type import for LucideProps
import { useAuth } from '../hooks/useAuth';

// Define feature type
interface Feature {
  title: string;
  desc: string;
  icon: React.ComponentType<LucideProps>; // Type for Lucide icon components
}

const featuresData: Feature[] = [
  { title: "Fast Ticket Creation", desc: "Create tickets in seconds with intuitive UI.", icon: CheckCircle },
  { title: "Real-Time Tracking", desc: "Monitor progress with live updates and notifications.", icon: Clock },
  { title: "Secure Platform", desc: "Your data is encrypted and fully protected.", icon: ShieldCheck },
];

const Landing: React.FC = () => {
  const { user, loadUser } = useAuth();
   // Ref for Intersection Observer - Specify element type
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    loadUser(); // Load user on mount
  }, [loadUser]);

  const buttonData = useMemo(() => {
    if (user) {
      return {
        text: 'Go to My Tickets',
        route: '/tickets',
        subtitle: `Welcome back, ${user?.name || 'User'}!`
      };
    }
    return {
      text: 'Get Started',
      route: '/login',
      subtitle: 'The Future of Ticketing'
    };
  }, [user]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) { // Type guard
             entry.target.classList.add('opacity-100', 'translate-y-0');
             entry.target.classList.remove('opacity-0', 'translate-y-6');
             observerRef.current?.unobserve(entry.target); // Use optional chaining
          }
        });
      },
      { threshold: 0.2 }
    );

    // Filter out null refs before observing
    const validRefs = featureRefs.current.filter(el => el !== null) as HTMLElement[];

    validRefs.forEach((el) => {
        observerRef.current?.observe(el);
    });

    // Cleanup
    return () => {
       if (observerRef.current) {
            validRefs.forEach((el) => {
                observerRef.current?.unobserve(el);
            });
       }
    };
  }, []); // Run once

  // JSX is largely the same, just ensure icon components are used correctly
  return (
    <div className="overflow-x-hidden bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
        <section className="relative flex flex-col justify-center items-center text-center min-h-[90vh] px-6 pt-16 md:pt-0">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 rounded-full blur-2xl opacity-70 animate-bounce-rotate"></div>
        <div className="absolute bottom-20 right-12 w-24 h-24 bg-pink-200 rounded-full blur-xl opacity-60 animate-bounce-scale"></div>

        <div className="max-w-5xl z-10 grid md:grid-cols-2 gap-16 items-center text-left animate-fade-in-up">
           {/* Text Content */}
            <div className="order-2 md:order-1 text-center md:text-left">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-pink-700 bg-pink-100 rounded-full mb-3 shadow-md">
                {buttonData.subtitle}
                </span>
                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-snug mb-4">
                <span className="block">Effortless</span>
                <span className="block text-indigo-600">Ticket Management</span>
                </h1>
                <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto md:mx-0">
                Streamline event organization and customer support seamlessly.
                </p>
                <Link
                    to={buttonData.route}
                    className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-xl hover:bg-indigo-700 hover:scale-[1.02] transition transform duration-300 ease-in-out font-bold text-center group"
                >
                    {buttonData.text}
                    <ArrowRight size={20} className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
          </div>

          {/* Illustration */}
            <div className="hidden md:flex md:order-2 relative items-center justify-center min-h-[300px] w-full p-4">
                 {/* Bubbles */}
                <div className="absolute w-6 h-6 bg-indigo-200 rounded-full opacity-60 animate-bubble-1 z-0 top-[10%] left-[15%]"></div>
                <div className="absolute w-4 h-4 bg-pink-200 rounded-full opacity-70 animate-bubble-2 z-0 top-[70%] right-[10%]"></div>
                <div className="absolute w-8 h-8 bg-blue-200 rounded-full opacity-50 animate-bubble-3 z-0 bottom-[5%] left-[40%]"></div>
                {/* SVG Illustration */}
                 <div className="relative w-48 h-48 flex items-center justify-center animate-wiggle-float z-10">
                    <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                        <linearGradient id="ticketGradient" x1="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#818CF8"/>
                            <stop offset="100%" stopColor="#F472B6"/>
                        </linearGradient>
                        </defs>
                        <circle cx="100" cy="110" r="50" fill="#E0F2FE"/>
                        <circle cx="100" cy="50" r="30" fill="#FFE0B2"/>
                        <circle cx="90" cy="45" r="3" fill="#333"/>
                        <circle cx="110" cy="45" r="3" fill="#333"/>
                        <path d="M90 60 Q100 65 110 60" stroke="#333" strokeWidth="2" fill="none"/>
                        <path d="M70 110 L50 130" stroke="#FFE0B2" strokeWidth="10" strokeLinecap="round"/>
                        <path d="M130 110 L150 130" stroke="#FFE0B2" strokeWidth="10" strokeLinecap="round"/>
                        <rect x="115" y="100" width="50" height="30" rx="5" fill="url(#ticketGradient)"/>
                        <text x="125" y="120" fontFamily="Arial" fontSize="10" fill="white">Ticket</text>
                    </svg>
                 </div>
            </div>
        </div>

        {/* Wave SVG */}
        <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#6366f1" fillOpacity="0.25" d="M0,160L48,165.3C96,171,192,181,288,197.3C384,213,480,235,576,218.7C672,203,768,149,864,144C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128V320H0Z"></path>
        </svg>
      </section>

       <section id="features" className="max-w-[1440px] mx-auto py-20 px-6 grid gap-10 md:grid-cols-3">
            {featuresData.map((feature, i) => {
                 const IconComponent = feature.icon; // Get icon component
                 return (
                    <div
                        key={i}
                     ref={(el) => { featureRefs.current[i] = el; }}
                        className="p-8 rounded-2xl shadow-md bg-white opacity-0 transform translate-y-6 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-2 cursor-default"
                    >
                        <div className="text-indigo-600 mb-4">
                            <IconComponent className="w-10 h-10" /> {/* Render icon */}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                    </div>
                 );
            })}
       </section>
        {/* Keyframes can be in index.css or tailwind.config.js */}
    </div>
  );
};

export default Landing;