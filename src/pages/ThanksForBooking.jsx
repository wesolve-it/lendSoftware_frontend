import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------
// 1. Konfetti-Komponente (rein CSS-basiert, für einfache Animation)
// ----------------------------------------------------
// Fügen Sie diese CSS-Keyframes in Ihre Haupt-CSS-Datei (z.B. index.css oder global.css) ein,
// wenn Sie sie nicht direkt im globalen Stil-Block Ihrer React-App verwenden können.

/*
// Beispiel CSS (Fügen Sie dies in Ihre globale CSS-Datei ein):

@keyframes confetti-fall {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
  1% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--color);
  top: 0;
  opacity: 0;
  animation: confetti-fall 3s ease-in-out infinite;
}

// Ende Beispiel CSS
*/

const Confetti = () => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']; // Tailwind-Farben: Red, Amber, Emerald, Blue, Violet

    // Erzeugt 25 Konfetti-Teile mit zufälliger Position und Verzögerung
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(25)].map((_, i) => (
                <div
                    key={i}
                    className="confetti-piece"
                    style={{
                        '--color': colors[i % colors.length],
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2.5 + Math.random() * 1.5}s`,
                        width: `${5 + Math.random() * 8}px`,
                        height: `${5 + Math.random() * 8}px`,
                    }}
                ></div>
            ))}
        </div>
    );
};


// ----------------------------------------------------
// 2. Haupt-Komponente: ThanksForBooking
// ----------------------------------------------------

export default function ThanksForBooking() {
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(false);

    // Konfetti nach dem ersten Rendern anzeigen und nach 4 Sekunden ausblenden
    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative">

            {/* Konfetti-Animation */}
            {showConfetti && <Confetti />}

            <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 lg:p-16 text-center max-w-lg w-full relative z-10 transform transition-all duration-500 ease-in-out">

                {/* Logo-Bereich (mit verbessertem Styling) */}
                <img
                    className="h-24 md:h-28 mx-auto mb-8 object-contain"
                    src={require('../assets/SportWeberLogoStartseite.png')}
                    alt="SportWeber Logo"
                />

                {/* Bestätigungs-Icon mit Animation */}
                <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 text-7xl md:text-8xl mx-auto mb-6 transform scale-100 animate-pulse-once"
                    // Anmerkung: 'animate-pulse-once' ist ein benutzerdefinierter Tailwind-Keyframe,
                    // der einmalig für einen "Pop"-Effekt sorgt.
                    // In reinem Tailwind benötigen Sie entweder eine Konfiguration in tailwind.config.js
                    // oder eine einfache CSS-Klasse:
                    // className="text-green-500 text-8xl mx-auto mb-6 transition-all duration-700 ease-out transform hover:scale-105"
                />

                {/* Haupttitel */}
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-3">
                    Vielen Dank für Ihre Buchung!
                </h2>

                {/* Untertitel */}
                <h3 className="text-lg md:text-xl text-gray-600 mb-10">
                    Wir freuen uns auf Ihr Erscheinen.
                </h3>

                {/* Button zur Startseite */}
                <button
                    onClick={() => navigate('/')}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-[1.02] active:scale-95"
                >
                    Zur Startseite
                </button>
            </div>

            <p className="mt-8 text-gray-500 text-sm">
                Bei Fragen kontaktieren Sie bitte unseren Support.
            </p>
        </div>
    );
}