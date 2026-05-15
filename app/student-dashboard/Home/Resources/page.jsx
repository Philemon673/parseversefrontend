"use client";

import { useState, useMemo } from "react";
import {
  SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight,
  Users, BookOpen, Star, BadgeCheck,
} from "lucide-react";

const ALL_MENTORS = [
  { name: "Arjun Patel",      role: "Mentor", spec: "Python & Backend Development",      icon: "💻", bio: "Software engineer with 10+ years building scalable web applications.",              followers: "24.6K", courses: 18, rating: 4.8, reviews: "1.2K" },
  { name: "Neha Sharma",      role: "Mentor", spec: "UI/UX Design",                       icon: "🎨", bio: "Product designer passionate about intuitive and beautiful user experiences.",        followers: "18.3K", courses: 14, rating: 4.9, reviews: "892"  },
  { name: "Rohit Verma",      role: "Mentor", spec: "Stock Market & Finance",              icon: "📈", bio: "Trader and investor with 8+ years in stock market and financial analysis.",         followers: "31.2K", courses: 16, rating: 4.6, reviews: "1.9K" },
  { name: "Ankit Singh",      role: "Tutor",  spec: "Frontend Development",                icon: "🖥️", bio: "Frontend developer specialising in React.js, JavaScript and modern web tech.",      followers: "15.7K", courses: 11, rating: 4.8, reviews: "764"  },
  { name: "Priya Mehta",      role: "Tutor",  spec: "Data Analysis & Excel",               icon: "📊", bio: "Data analyst helping businesses make sense of data and drive better decisions.",    followers: "20.1K", courses: 13, rating: 4.8, reviews: "1.1K" },
  { name: "Karan Malhotra",   role: "Mentor", spec: "Cybersecurity & Ethical Hacking",     icon: "🛡️", bio: "Cybersecurity professional focused on ethical hacking and security awareness.",     followers: "27.4K", courses: 20, rating: 4.9, reviews: "1.3K" },
  { name: "Vikram Bhat",      role: "Tutor",  spec: "Photography & Visual Storytelling",   icon: "📷", bio: "Photographer & storyteller teaching the art of capturing moments beautifully.",    followers: "12.8K", courses:  9, rating: 4.7, reviews: "634"  },
  { name: "Siddharth Roy",    role: "Mentor", spec: "3D Modelling & Animation",            icon: "🎬", bio: "3D artist and animator with experience in games and animated films.",               followers: "14.2K", courses: 12, rating: 4.8, reviews: "822"  },
  { name: "Isha Kapoor",      role: "Tutor",  spec: "Digital Marketing & Growth",          icon: "📣", bio: "Digital marketer helping brands grow through effective online strategies.",         followers: "22.5K", courses: 15, rating: 4.7, reviews: "1.0K" },
  { name: "Sameer Khan",      role: "Mentor", spec: "Mobile App Development",              icon: "📱", bio: "Mobile app developer with expertise in Flutter and React Native.",                 followers: "19.6K", courses: 17, rating: 4.8, reviews: "925"  },
  { name: "Aditi Desai",      role: "Tutor",  spec: "Content Writing & Copywriting",       icon: "✍️", bio: "Content strategist and writer helping brands tell their stories that convert.",    followers: "11.3K", courses:  8, rating: 4.6, reviews: "512"  },
  { name: "Manish Jain",      role: "Mentor", spec: "DevOps & Cloud Engineering",          icon: "☁️", bio: "DevOps engineer helping teams build and deploy reliable cloud applications.",       followers: "16.9K", courses: 13, rating: 4.8, reviews: "872"  },
  { name: "Deepa Nair",       role: "Mentor", spec: "Machine Learning & AI",               icon: "🤖", bio: "ML researcher with a passion for making AI accessible to everyone.",               followers: "29.3K", courses: 22, rating: 4.9, reviews: "2.1K" },
  { name: "Ravi Pillai",      role: "Tutor",  spec: "Game Development",                    icon: "🎮", bio: "Indie game developer sharing Unity and Unreal Engine tutorials.",                  followers: "17.8K", courses: 10, rating: 4.7, reviews: "743"  },
  { name: "Meera Iyer",       role: "Mentor", spec: "Product Management",                  icon: "📋", bio: "Senior PM with top tech experience mentoring aspiring product managers.",          followers: "21.4K", courses: 14, rating: 4.8, reviews: "1.0K" },
  { name: "Suresh Babu",      role: "Tutor",  spec: "Blockchain & Web3",                   icon: "⛓️", bio: "Blockchain developer helping learners navigate the decentralised web.",            followers: "13.6K", courses:  9, rating: 4.6, reviews: "481"  },
  { name: "Pooja Reddy",      role: "Mentor", spec: "Business Strategy",                   icon: "💼", bio: "MBA consultant helping early-stage founders build sustainable businesses.",        followers: "18.9K", courses: 11, rating: 4.7, reviews: "632"  },
  { name: "Amit Verma",       role: "Tutor",  spec: "Java & Spring Boot",                  icon: "☕", bio: "Backend Java developer with a knack for clean architecture and microservices.",   followers: "14.1K", courses: 16, rating: 4.8, reviews: "910"  },
  { name: "Nandita Das",      role: "Mentor", spec: "Yoga & Mindfulness",                  icon: "🧘", bio: "Certified yoga instructor blending mindfulness with modern wellness practices.",   followers: "32.7K", courses: 19, rating: 4.9, reviews: "3.2K" },
  { name: "Harish Kumar",     role: "Tutor",  spec: "SQL & Database Design",               icon: "🗄️", bio: "Database administrator simplifying complex queries and schema design.",            followers: "16.2K", courses: 12, rating: 4.7, reviews: "598"  },
  { name: "Tanvi Sharma",     role: "Mentor", spec: "Graphic Design",                      icon: "🖌️", bio: "Brand designer with a portfolio spanning startups to Fortune 500 companies.",     followers: "23.5K", courses: 15, rating: 4.8, reviews: "1.4K" },
  { name: "Nikhil Gupta",     role: "Tutor",  spec: "React & Next.js",                     icon: "⚛️", bio: "Frontend architect focused on performance, accessibility and modern React.",       followers: "19.0K", courses: 14, rating: 4.9, reviews: "1.1K" },
  { name: "Shreya Bansal",    role: "Mentor", spec: "English Communication",               icon: "💬", bio: "Communication coach helping professionals speak and write with confidence.",       followers: "26.8K", courses: 18, rating: 4.8, reviews: "2.0K" },
  { name: "Varun Tiwari",     role: "Tutor",  spec: "Embedded Systems",                    icon: "🔌", bio: "Electronics engineer teaching microcontrollers and IoT prototyping.",             followers: "10.4K", courses:  7, rating: 4.6, reviews: "312"  },
  { name: "Ankita Rao",       role: "Mentor", spec: "HR & Talent Acquisition",             icon: "👥", bio: "HR leader sharing interview strategies and career growth tips.",                  followers: "17.3K", courses: 10, rating: 4.7, reviews: "541"  },
  { name: "Mohit Saxena",     role: "Tutor",  spec: "Network Engineering",                 icon: "🌐", bio: "CCNA-certified network engineer breaking down complex networking concepts.",       followers: "11.9K", courses:  8, rating: 4.6, reviews: "403"  },
  { name: "Ritika Singh",     role: "Mentor", spec: "Fashion & Styling",                   icon: "👗", bio: "Fashion stylist and personal branding coach helping clients dress for success.",  followers: "28.1K", courses: 13, rating: 4.8, reviews: "1.6K" },
  { name: "Sandeep Mehta",    role: "Tutor",  spec: "Mathematics & Statistics",            icon: "📐", bio: "PhD mathematician making advanced topics approachable for students.",             followers: "15.5K", courses: 21, rating: 4.9, reviews: "1.8K" },
  { name: "Lavanya Krishnan", role: "Mentor", spec: "Clinical Psychology",                 icon: "🧠", bio: "Psychologist sharing evidence-based mental health tools for everyday wellbeing.", followers: "30.2K", courses: 16, rating: 4.9, reviews: "2.7K" },
  { name: "Akash Dubey",      role: "Tutor",  spec: "Arduino & Robotics",                  icon: "🤖", bio: "Robotics enthusiast helping students build their first autonomous machines.",     followers: "12.3K", courses:  9, rating: 4.7, reviews: "487"  },
  { name: "Divya Menon",      role: "Mentor", spec: "Supply Chain & Logistics",            icon: "🚚", bio: "Operations expert with global supply chain experience at scale.",                 followers: "14.8K", courses: 11, rating: 4.7, reviews: "529"  },
  { name: "Gaurav Joshi",     role: "Tutor",  spec: "Kotlin & Android",                    icon: "📲", bio: "Android engineer passionate about Jetpack Compose and clean mobile architecture.",followers: "16.6K", courses: 13, rating: 4.8, reviews: "771"  },
  { name: "Swati Agarwal",    role: "Mentor", spec: "Nutrition & Health Coaching",         icon: "🥗", bio: "Registered dietitian helping people build sustainable healthy eating habits.",    followers: "24.9K", courses: 17, rating: 4.8, reviews: "2.3K" },
  { name: "Pankaj Mishra",    role: "Tutor",  spec: "Linux & Shell Scripting",             icon: "🐧", bio: "Linux sysadmin making command-line mastery accessible to developers.",            followers: "13.1K", courses: 10, rating: 4.7, reviews: "461"  },
  { name: "Kavita Shetty",    role: "Mentor", spec: "Interior Design",                     icon: "🏠", bio: "Interior designer transforming spaces with creativity and budget tips.",          followers: "20.7K", courses: 12, rating: 4.8, reviews: "934"  },
  { name: "Rajan Pillai",     role: "Tutor",  spec: "Swift & iOS Development",             icon: "🍎", bio: "iOS developer sharing Swift best practices from App Store published apps.",       followers: "15.3K", courses: 11, rating: 4.7, reviews: "603"  },
  { name: "Bhavna Chawla",    role: "Mentor", spec: "Astrology & Vedic Sciences",          icon: "🌙", bio: "Vedic astrologer guiding learners through planetary influences and life charts.", followers: "35.4K", courses: 14, rating: 4.9, reviews: "4.1K" },
  { name: "Tarun Kapoor",     role: "Tutor",  spec: "Photography Editing",                 icon: "🖼️", bio: "Photo editor and Lightroom expert helping photographers perfect post-processing.",followers: "18.2K", courses: 10, rating: 4.7, reviews: "682"  },
  { name: "Sunita Verma",     role: "Mentor", spec: "Social Media Strategy",               icon: "📲", bio: "Social media consultant who has grown brand audiences from zero to millions.",   followers: "41.3K", courses: 15, rating: 4.8, reviews: "3.5K" },
  { name: "Deepak Nambiar",   role: "Tutor",  spec: "C++ & Competitive Programming",      icon: "🏆", bio: "Competitive programmer helping students ace coding interviews.",                   followers: "17.7K", courses: 19, rating: 4.9, reviews: "1.5K" },
  { name: "Pallavi Joshi",    role: "Mentor", spec: "Event Planning & Management",         icon: "🎪", bio: "Professional event planner sharing expertise in weddings and corporate events.",  followers: "22.0K", courses: 13, rating: 4.7, reviews: "874"  },
  { name: "Arun Sharma",      role: "Tutor",  spec: "English Grammar & Writing",           icon: "📝", bio: "Language teacher with 12 years helping students write clearly and confidently.",  followers: "19.5K", courses: 16, rating: 4.8, reviews: "1.2K" },
  { name: "Nalini Bhat",      role: "Mentor", spec: "Homeopathy & Alternative Medicine",   icon: "🌿", bio: "Homeopathic practitioner sharing holistic wellness approaches.",                  followers: "13.9K", courses:  8, rating: 4.6, reviews: "398"  },
  { name: "Vishal Pandey",    role: "Tutor",  spec: "AWS & Cloud Architecture",            icon: "☁️", bio: "AWS Solutions Architect teaching cloud fundamentals and certifications.",         followers: "21.8K", courses: 18, rating: 4.9, reviews: "1.7K" },
  { name: "Rekha Pillai",     role: "Mentor", spec: "Spoken Hindi",                        icon: "🗣️", bio: "Hindi teacher helping non-native speakers build conversational fluency.",         followers: "16.4K", courses: 11, rating: 4.7, reviews: "519"  },
  { name: "Sanjay Rao",       role: "Tutor",  spec: "Video Editing & Motion Graphics",     icon: "🎞️", bio: "Video editor specialising in YouTube and social media content.",                  followers: "25.6K", courses: 14, rating: 4.8, reviews: "1.9K" },
  { name: "Hema Krishnan",    role: "Mentor", spec: "Cooking & Indian Cuisine",            icon: "👨‍🍳", bio: "Professional chef sharing authentic Indian recipes and culinary techniques.",      followers: "38.2K", courses: 20, rating: 4.9, reviews: "5.6K" },
  { name: "Vijay Nair",       role: "Tutor",  spec: "SEO & Digital Analytics",             icon: "📊", bio: "SEO specialist helping websites rank through data-driven strategies.",            followers: "17.1K", courses: 12, rating: 4.7, reviews: "643"  },
];

const AVATAR_COLORS = [
  "bg-indigo-500","bg-violet-500","bg-pink-500","bg-amber-500",
  "bg-emerald-500","bg-blue-500","bg-rose-500","bg-teal-500",
];

const PER_PAGE = 12;

const FILTERS = [
  { key: "all",    label: "All" },
  { key: "Mentor", label: "Mentors only" },
  { key: "Tutor",  label: "Tutors only" },
  { key: "top",    label: "Top rated (4.8+)" },
];

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2);
}

function avatarColor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function MentorCard({ mentor }) {
  return (
    <div className="relative group bg-white/40 backdrop-blur-xl border border-indigo-100 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] hover:border-indigo-300 hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col overflow-hidden">
      
      {/* Hover inner glow */}
      <div className="absolute inset-0 border border-indigo-100/50 bg-gradient-to-br from-indigo-100/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]" />
      
      <div className="relative z-10 flex flex-col flex-1">
        {/* Role badge */}
        <div className="flex justify-end mb-2">
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-sm ${
            mentor.role === "Mentor"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-100/50"
              : "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
          }`}>
            {mentor.role}
          </span>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-2xl ${avatarColor(mentor.name)} flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-100/50 group-hover:scale-105 transition-transform duration-500 rotate-3 group-hover:rotate-0`}>
            {initials(mentor.name)}
          </div>
        </div>

        {/* Name + verify */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span className="text-sm font-black text-slate-900 group-hover:text-indigo-700 transition-colors">{mentor.name}</span>
          <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
        </div>

        {/* Specialty */}
        <p className="text-[11px] font-semibold text-indigo-500/80 uppercase tracking-widest text-center mb-3">{mentor.spec}</p>

        {/* Bio */}
        <p className="text-[11px] text-slate-500 leading-relaxed text-center line-clamp-3 flex-1 mb-4 font-medium">
          {mentor.bio}
        </p>

        {/* Stats */}
        <div className="flex justify-between pt-4 border-t border-slate-100/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-800">
              <Users className="w-3.5 h-3.5 text-indigo-400" />{mentor.followers}
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Followers</p>
          </div>
          <div className="text-center border-l border-r border-slate-100/50 px-2">
            <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-800">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />{mentor.courses}
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Courses</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-400" />{mentor.rating}
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">({mentor.reviews})</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pager({ current, total, onChange }) {
  if (total <= 1) return null;

  const pages = new Set(
    [1, total, current, current - 1, current + 1].filter((n) => n >= 1 && n <= total)
  );
  const sorted = [...pages].sort((a, b) => a - b);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {sorted.reduce((acc, n, i) => {
        if (i > 0 && n - sorted[i - 1] > 1) {
          acc.push(<span key={`e${n}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm">…</span>);
        }
        acc.push(
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
              n === current
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {n}
          </button>
        );
        return acc;
      }, [])}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function MentorsPage() {
  const [filter, setFilter]       = useState("all");
  const [page, setPage]           = useState(1);
  const [dropOpen, setDropOpen]   = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all")    return ALL_MENTORS;
    if (filter === "top")    return ALL_MENTORS.filter((m) => m.rating >= 4.8);
    return ALL_MENTORS.filter((m) => m.role === filter);
  }, [filter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const slice      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const start      = (page - 1) * PER_PAGE + 1;
  const end        = Math.min(page * PER_PAGE, filtered.length);

  const handleFilter = (key) => {
    setFilter(key);
    setPage(1);
    setDropOpen(false);
  };

  const handlePage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)] bg-white rounded-[2.5rem] p-8 shadow-sm overflow-hidden border border-slate-100/50">
      {/* Ambient background for glass effect */}
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">All Mentors & Instructors</h1>
          <p className="text-sm text-slate-500 mt-1">Learn from the best experts and industry professionals.</p>
        </div>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            <ChevronDown className={`w-4 h-4 transition-transform ${dropOpen ? "rotate-180" : ""}`} />
          </button>

          {dropOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100 p-1.5 z-10 w-44">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => handleFilter(f.key)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    filter === f.key
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {slice.map((m) => <MentorCard key={m.name} mentor={m} />)}
      </div>

      {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100/50">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {start} to {end} of {filtered.length} mentors
          </p>
          <Pager current={page} total={totalPages} onChange={handlePage} />
        </div>
      </div>
    </div>
  );
}