import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuizQuestion } from '../types/product'
import { Check, X, Trophy, Star, BookOpen, RefreshCw } from 'lucide-react'

interface QuizCardProps {
  questions: QuizQuestion[]
}

export const QuizCard = ({ questions }: QuizCardProps) => {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const question = questions[currentQ]

  const handleAnswer = (idx: number) => {
    setSelected(idx)
    setAnswered(true)
    if (idx === question.correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setShowResult(false)
  }

  if (showResult) {
    return (
      <motion.div
        className="bg-gold-soft dark:bg-gold-glow-bg rounded-2xl p-8 text-center border border-gold dark:border-gold-neon"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex justify-center mb-4">
          {score === questions.length
            ? <Trophy className="w-20 h-20 text-yellow-500" />
            : score >= questions.length * 0.6
              ? <Star className="w-20 h-20 text-gold dark:text-gold-neon" />
              : <BookOpen className="w-20 h-20 text-gold" />}
        </div>
        <h3 className="text-2xl font-serif font-bold text-gold dark:text-gold-neon mb-2">Kuis Selesai!</h3>
        <p className="text-lg text-teal dark:text-teal-neon font-semibold mb-2">
          Skor Anda {score} dari {questions.length}
        </p>
        <p className="text-stone-text dark:text-dark-body mb-6 text-base">
          {score === questions.length
            ? 'Sempurna! Anda ahli dalam kisah produk ini!'
            : score >= questions.length * 0.6
              ? 'Bagus sekali! Anda memahami rantai pasokan dengan baik!'
              : 'Usaha yang baik! Pelajari lebih lanjut tentang produksi etis!'}
        </p>
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 flex items-center gap-2 mx-auto btn-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetQuiz}
        >
          <RefreshCw className="w-5 h-5" /> Ulangi Kuis
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="bg-pure-card dark:bg-night-card rounded-2xl p-8 shadow-md border border-stone-100 dark:border-night-border">
      {/* Progress */}
      <div className="mb-8">
        <div className="w-full h-2 bg-warm-sand dark:bg-night-border rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-teal dark:from-gold-neon dark:to-teal-neon"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-stone-text dark:text-dark-body font-medium">
          Pertanyaan {currentQ + 1} dari {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-lg font-serif font-bold text-gold dark:text-gold-neon mb-6">{question.question}</h4>

          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-all duration-250 text-left font-medium ${
                    answered && idx === question.correct
                      ? 'border-[#10b981] bg-[#10b981]/10 dark:border-[#10b981] dark:bg-[#10b981]/20 text-ink dark:text-dark-body'
                      : answered && selected === idx
                      ? 'border-red-500 bg-red-500/10 text-ink dark:text-dark-body'
                      : 'border-stone-100 dark:border-night-border hover:border-gold dark:hover:border-gold-neon bg-pure-card dark:bg-night-card text-ink dark:text-dark-body'
                  }`}
                onClick={() => !answered && handleAnswer(idx)}
                whileHover={!answered ? { scale: 1.02 } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
                disabled={answered}
              >
                <span className={`w-8 h-8 rounded-full font-bold flex items-center justify-center ${
                    answered && idx === question.correct
                      ? 'bg-[#10b981] text-white'
                      : answered && selected === idx
                      ? 'bg-red-500 text-white'
                      : 'bg-gold dark:bg-gold-neon text-white'
                  }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
                {answered && idx === question.correct && <Check className="ml-auto w-6 h-6 text-[#10b981]" />}
                {answered && selected === idx && selected !== question.correct && <X className="ml-auto w-6 h-6 text-red-500" />}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div
                className="bg-gold-soft dark:bg-gold-glow-bg border-l-4 border-gold dark:border-gold-neon p-4 rounded-xl mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-ink dark:text-dark-body text-sm leading-relaxed">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {answered && (
            <motion.button
              className="w-full py-3 bg-gradient-to-r from-gold to-gold-deep dark:from-gold-neon dark:to-gold-bright text-white dark:text-night rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-gold/30 dark:hover:shadow-gold-neon/30 transition-all duration-300 btn-glow"
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {currentQ === questions.length - 1 ? 'Lihat Hasil' : 'Pertanyaan Berikutnya'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}