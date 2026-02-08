import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Globe, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function Home() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="bg-cream/30">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-forest font-semibold text-sm mb-6 border border-green-200">
              New: Community Map Feature 🗺️
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8">
              Trade Time,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-moss">
                Share Skills.
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Velopola is a time-banking community. Teach an hour of what you know, 
              earn a credit, and spend it to learn something new. No money needed.
            </p>
            
            <div className="flex justify-center gap-4">
              {user ? (
                <Link to="/dashboard" className="px-8 py-4 bg-forest text-white rounded-full font-bold text-lg hover:bg-moss transition shadow-xl hover:shadow-2xl flex items-center gap-2">
                  Go to Dashboard <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="px-8 py-4 bg-forest text-white rounded-full font-bold text-lg hover:bg-moss transition shadow-xl hover:shadow-2xl">
                    Start Trading
                  </Link>
                  <Link to="/login" className="px-8 py-4 bg-white text-forest border-2 border-forest/10 rounded-full font-bold text-lg hover:border-forest hover:bg-green-50 transition">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </motion.div>

        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-green-200/40 rounded-full blur-3xl"></div>
          <div className="absolute top-[30%] right-[20%] w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-forest mb-4">Why Velopola?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">We aren't just another freelance site. We are a community built on equality.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Clock className="w-8 h-8 text-forest" />, 
                title: "Time Banking", 
                desc: "1 Hour = 1 Credit. Whether you are a lawyer or a gardener, your time is valued equally." 
              },
              { 
                icon: <Users className="w-8 h-8 text-forest" />, 
                title: "Community First", 
                desc: "Connect with real people in your local area or globally. Build relationships, not just transactions." 
              },
              { 
                icon: <Globe className="w-8 h-8 text-forest" />, 
                title: "Geo-Location", 
                desc: "Find skills available in your neighborhood using our interactive community map." 
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-cream/20 border border-sand/30 hover:border-moss/50 transition duration-300"
              >
                <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home