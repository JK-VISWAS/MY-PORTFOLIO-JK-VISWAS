import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Award, Code, Github, Globe, Sun, Moon, Plus, Trash2, X, LogIn, Linkedin, Gamepad2, Trophy, RotateCcw } from 'lucide-react';
import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

// ...existing code...
// 1. IMPORT LIGHTPILLAR (Ensure the file is named lightpillar.jsx)
import LightPillar from './lightpillar';
import TextType from './TextType';
import TicTacToe from './TicTacToe';
import Snake from './Snake';
import Game2048 from './Game2048';
const App = () => {
  const [isDark, setIsDark] = useState(true);
  const [accentColor, setAccentColor] = useState('#06b6d4');
  const [certs, setCerts] = useState([]);
  const [user, setUser] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({ title: '', issuer: '', date: '', link: '', image: '' });
  const [loginCreds, setLoginCreds] = useState({ email: '', password: '' });
  const [showGames, setShowGames] = useState(false);
  const [activeGame, setActiveGame] = useState(null); // 'tictactoe', 'snake', or '2048'
  const [showNotice, setShowNotice] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const auth = getAuth();

  const fetchCerts = async () => {
    const querySnapshot = await getDocs(collection(db, "certifications"));
    const certsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCerts(certsData);
  };

  useEffect(() => {
    fetchCerts();
    onAuthStateChanged(auth, (user) => setUser(user));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) setShowNotice(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Hidden shortcut: Shift + A
      if (e.shiftKey && e.key === 'A') {
        const password = prompt("Enter Admin Secret:");
        if (password === "your_password_here") { // Change this to your password
          setIsAdmin(true);
          alert("Admin Mode: Active 🔓");
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "certifications"), formData);
      setShowAdminModal(false);
      setFormData({ title: '', issuer: '', date: '', link: '', image: '' });
      fetchCerts();
    } catch (err) { alert("Access Denied: You must be logged in as Admin."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this achievement?")) {
      await deleteDoc(doc(db, "certifications", id));
      fetchCerts();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginCreds.email, loginCreds.password);
      setShowLogin(false);
    } catch (err) { alert("Invalid Admin Credentials"); }
  };

  const handleUpload = (file) => {
    if (!file) return;

    // TODO: Implement file upload to Firebase Storage or your preferred storage solution
    // For now, this is a placeholder that you can customize
    // Example: Convert to base64, upload to Firebase Storage, then save URL to Firestore

    const reader = new FileReader();
    reader.onloadend = async () => {
      // You can implement the upload logic here
      // For example: upload to Firebase Storage, get download URL, then add to Firestore
      alert("Upload functionality needs to be implemented. File selected: " + file.name);
    };
    reader.readAsDataURL(file);
  };

  const projects = [
    {
      title: "Project One",
      videoUrl: "/videos/eco-track-bg-video.mp4",
      link: "https://your-website-link.com",
      tech: ["React", "Tailwind", "Node.js"]
    },
    // Add more projects here
  ];

  const ProjectCard = ({ project }) => {
    return (
      <div className="relative group w-full overflow-hidden rounded-[2.5rem] border border-white/10 !bg-white/5 !backdrop-blur-xl transition-all duration-500 hover:border-cyan-500/50 p-4">
        
        {/* The Video Preview Area */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/5 border border-white/5 shadow-2xl">
          <video
            src={project.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-70"
          />
          {/* Transparent Glass Tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Project Info */}
        <div className="mt-5 px-2">
          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          
          {/* Tech Stack */}
          <div className="flex gap-2 mt-2">
            {project.tech?.map(t => (
              <span key={t} className="text-[10px] font-mono text-cyan-400/80 uppercase">
                #{t}
              </span>
            ))}
          </div>

          <button
            onClick={() => window.open(project.link, '_blank')}
            className="mt-6 w-full py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-bold hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"
          >
            OPEN PROJECT →
          </button>
        </div>
      </div>
    );
  };

  const ProjectSection = () => {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-white text-center">Featured Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className={`${isDark ? 'dark bg-black text-white' : 'bg-white text-black'} min-h-screen transition-colors duration-500 relative overflow-x-hidden`}>

      {/* 2. BACKGROUND LAYER (Fixed position, z-index 0) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={0.5}
          rotationSpeed={2.0}
          pillarWidth={3.5}
        />
      </div>

      {/* 3. CONTENT LAYER (Relative position, z-index 10) */}
      <div className="relative z-10">

        {/* NAV */}
        <nav className="fixed top-6 right-6 z-50 flex gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10">
          <button onClick={() => setIsDark(!isDark)} className="p-2 hover:bg-white/10 rounded-full transition-all">
            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          </button>
          <button
            onClick={() => setShowCertificates(true)}
            className="relative z-[9999] p-2 bg-white/10 border border-white/10 rounded-full hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all"
          >
            <Award size={20} />
          </button>
          <button
            onClick={() => setShowGames(true)}
            className="relative p-2 hover:bg-white/20 rounded-full transition-all text-cyan-400 border border-white/10 bg-black/20"
          >
            <Gamepad2 size={24} />
            {/* Notification Dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </button>
          {user ? (
            <button onClick={() => setShowAdminModal(true)} className="p-2 text-cyan-500"><Plus size={20} /></button>
          ) : (
            <button onClick={() => setShowLogin(true)} className="p-2 text-gray-500"><LogIn size={20} /></button>
          )}
        </nav>

        {/* HERO */}
        <section className="h-screen flex flex-col justify-center items-center text-center px-4">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-7xl md:text-9xl font-bold tracking-tighter">
            JOY VISWAS
          </motion.h1>
          <TextType
            text={[
              "Full-Stack Developer",
              "UI/UX Designer",
              "DevOps Engineer",
              "Casual Gamer (Check top right! ↗️)"
            ]}
            as="h2"
            className="text-2xl font-light tracking-[0.2em] uppercase mt-4"
            style={{ color: accentColor }}
            typingSpeed={100}
            deletingSpeed={50}
            pauseDuration={2000}
            loop={true}
            showCursor={true}
            cursorCharacter="|"
            cursorBlinkDuration={0.8}
          />
        </section>

        {/* CERTIFICATIONS */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-12 flex items-center gap-4 uppercase tracking-widest opacity-60">
            <Award size={20} style={{ color: accentColor }} /> Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((cert) => (
              <motion.div key={cert.id} className={`relative p-6 rounded-[2rem] border group overflow-hidden ${isDark ? 'bg-white/5 border-white/10 backdrop-blur-2xl' : 'bg-white/30 border-black/10 backdrop-blur-xl'} shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all hover:scale-[1.02]`}>
                {/* Decorative Glows for Glass */}
                <div className="absolute -top-16 -left-16 w-40 h-40 bg-cyan-500/20 rounded-full blur-[60px] pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none" />
                {/* Inner subtle border for glass panel */}
                <div className="absolute inset-0 rounded-[2rem] border border-white/5 pointer-events-none" />

                {user && (
                  <button onClick={() => handleDelete(cert.id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={18} />
                  </button>
                )}
                {cert.image && (
                  <div className="mb-4">
                    <img
                      src={cert.image}
                      alt={`${cert.title} certificate`}
                      className="w-full h-32 object-cover rounded-lg border border-white/10 bg-white/10"
                    />
                  </div>
                )}
                <h3 className="font-bold text-xl mb-1">{cert.title}</h3>
                <p className="opacity-50 text-sm mb-4">{cert.issuer} • {cert.date}</p>
                <a href={cert.link} target="_blank" className="text-sm font-medium underline text-cyan-400 hover:text-cyan-300">View Credential</a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <ProjectSection />

        {/* LET'S CONNECT SECTION */}
        <section className="py-24 px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          <p className="opacity-60 mb-12 max-w-lg mx-auto">
            I'm currently looking for new opportunities. My inbox is always open!
          </p>
          <a
            href="mailto:joyviswaskolli@Gmail.com"
            className="px-8 py-4 rounded-full font-bold transition-all border"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Send a Message
          </a>
        </section>

        {/* UPDATED MOBILE-RESPONSIVE SOCIAL LINKS */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:bottom-6 md:translate-x-0 z-50 flex flex-row md:flex-col gap-4">
          <motion.a
            href="https://github.com/JK-VISWAS"
            target="_blank"
            whileHover={{ scale: 1.2, color: accentColor }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full transition-colors"
          >
            <Github size={20} />
          </motion.a>

          <motion.a
            href="https://linkedin.com/in/joy-viswas-kolli-319520320"
            target="_blank"
            whileHover={{ scale: 1.2, color: accentColor }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full transition-colors"
          >
            <Linkedin size={20} />
          </motion.a>

          <motion.a
            href="mailto:joyviswaskolli@Gmail.com"
            whileHover={{ scale: 1.2, color: accentColor }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full transition-colors"
          >
            <Mail size={20} />
          </motion.a>
        </div>
      </div>

      {/* SCROLL NOTICE */}
      <AnimatePresence>
        {showNotice && !showGames && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed bottom-24 right-6 z-40 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-3 cursor-pointer shadow-xl"
            onClick={() => setShowGames(true)}
          >
            <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
              <Gamepad2 size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-tighter">Bored?</p>
              <p className="text-[10px] opacity-60">Click to play 2048 or Snake!</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setShowNotice(false); }} className="ml-2 opacity-40 hover:opacity-100">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS (Keep them outside the relative z-10 for full coverage) */}
      <AnimatePresence>
        {showGames && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-6"
          >
            <div className="w-full max-w-4xl bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-6 right-6 flex gap-3">
                {activeGame && (
                  <button
                    onClick={() => {
                      // Simple reset by re-selecting the game (triggers re-render)
                      const currentGame = activeGame;
                      setActiveGame(null);
                      setTimeout(() => setActiveGame(currentGame), 10);
                    }}
                    className="text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                    title="Reset Game"
                  >
                    <RotateCcw size={18} />
                  </button>
                )}
                <button onClick={() => { setShowGames(false); setActiveGame(null); }} className="text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter flex items-center justify-center gap-3">
                  <Gamepad2 className="text-cyan-400" /> GAME CENTER
                </h2>
                <p className="text-white/40 text-sm mt-2 uppercase tracking-widest">Take a break and chill</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: '2048', title: '2048', desc: 'Merge the tiles', color: '#edc22e' },
                  { id: 'tictactoe', title: 'Tic Tac Toe', desc: 'Classic 3x3', color: '#06b6d4' },
                  { id: 'snake', title: 'Retro Snake', desc: 'Old School fun', color: '#22c55e' }
                ].map((game) => (
                  <motion.div
                    key={game.id} whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveGame(game.id)}
                    className="p-6 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: game.color + '20', color: game.color }}>
                      <Trophy size={24} />
                    </div>
                    <h3 className="font-bold text-xl">{game.title}</h3>
                    <p className="text-sm opacity-40">{game.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* ACTIVE GAME RENDERER */}
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
                {!activeGame && (
                  <p className="text-white/20 animate-pulse italic">Select a game to start playing...</p>
                )}
                {activeGame === 'tictactoe' && <TicTacToe accentColor={accentColor} />}
                {activeGame === 'snake' && <Snake accentColor={accentColor} />}
                {activeGame === '2048' && <Game2048 accentColor={accentColor} />}
              </div>
            </div>
          </motion.div>
        )}

        {/* CERTIFICATES MODAL */}
        {showCertificates && (
          /* 1. The Overlay: Blurred background instead of solid black */
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-black/20">

            {/* 2. The Modal Container: Glass effect */}
            <div className="relative w-full max-w-4xl bg-white/10 border border-white/20 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-2xl">

              {/* Decorative Glows inside the glass */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowCertificates(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight">
                My <span className="text-cyan-400">Certifications</span>
              </h2>

              {/* 1. The Responsive Container Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full overflow-y-auto max-h-[60vh] pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(6, 182, 212, 0.5) transparent' }}>

                {certs.length > 0 ? (
                  certs.map((cert) => (
                    <div
                      key={cert.id}
                      className="relative group w-full overflow-hidden rounded-[2rem] border border-white/10 !bg-white/5 !backdrop-blur-xl transition-all hover:!bg-white/10 hover:border-cyan-500/50 p-4 shadow-2xl flex flex-col"
                    >
                      {/* Responsive Image Area */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/5 border border-white/5">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/400x250/000000/ffffff?text=Preview"; }}
                        />

                        {/* Admin Delete Button - Re-integrated */}
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(cert.id);
                            }}
                            className="absolute top-2 right-2 text-red-500 bg-black/50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                            title="Delete Certification"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {/* Content Area - Adjusted for mobile touch */}
                      <div className="mt-4 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">
                            {cert.title}
                          </h3>
                          <p className="text-white/40 text-[10px] md:text-xs mt-1 uppercase tracking-widest font-mono">
                            {cert.issuer} • {cert.idNumber || ''}
                          </p>
                        </div>

                        <button
                          onClick={() => window.open(cert.link, '_blank')}
                          className="mt-4 w-full py-3 rounded-xl bg-cyan-500/10 text-cyan-400 text-sm font-bold hover:bg-cyan-500/20 transition-all active:scale-95"
                        >
                          VIEW CREDENTIAL →
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Award size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-white/40">No certificates to display yet.</p>
                  </div>
                )}
              </div>

              {/* Admin Upload (Only shows for you) */}
              {isAdmin && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <label className="block text-cyan-400 text-[10px] font-mono mb-3 uppercase tracking-widest">
                    Admin: Upload New Credential
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleUpload(e.target.files[0])}
                    className="text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADMIN MODAL */}
        <AnimatePresence>
          {showAdminModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[300] flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[2rem] relative"
              >
                <button onClick={() => setShowAdminModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">Add Certification</h2>
                <form onSubmit={handleAddCert} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Certification Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Issuer (e.g., Amazon Web Services)"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Date (e.g., Dec 2024)"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Credential Link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Certificate Image URL (optional)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none"
                  />
                  <button type="submit" className="w-full p-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors">
                    Add Certification
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGIN MODAL */}
        <AnimatePresence>
          {showLogin && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[300] flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-[2rem] relative"
              >
                <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Admin Email"
                    value={loginCreds.email}
                    onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginCreds.password}
                    onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <button type="submit" className="w-full p-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors">
                    Login
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
};

export default App;