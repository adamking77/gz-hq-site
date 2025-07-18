import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    question: 'Your Name',
    type: 'text',
    name: 'name',
  },
  {
    question: 'What is your preferred contact email?',
    type: 'email',
    name: 'email',
  },
  {
    question: 'Which organization do you represent?',
    type: 'text',
    name: 'company',
  },
  {
    question: 'What is your position of authority there?',
    type: 'text',
    name: 'role',
  },
  {
    question: 'What best describes your current situation?',
    type: 'select',
    name: 'currentSituation',
    options: [
      'Something is systematically undermining my personal power/reputation',
      'My business/professional systems are working against my actual goals',
      'Our family wealth/legacy faces sophisticated threats',
      'I\'m not sure, but I know something isn\'t right'
    ],
  },
  {
    question: 'How quickly do you need this resolved?',
    type: 'select',
    name: 'urgency',
    options: [
      'Crisis mode - need immediate intervention',
      'Urgent - within 30 days',
      'Strategic - within 90 days',
      'Planning ahead - no immediate pressure'
    ],
  },
  {
    question: 'Help us understand what\'s been happening - in your own words, what situation brought you here?',
    type: 'textarea',
    name: 'situation',
  },
  {
    question: 'Which of these feels most familiar?',
    type: 'select',
    name: 'pattern',
    options: [
      'People I trusted are using my own systems against me',
      'The "solutions" I\'m being offered make things worse, not better',
      'I can see the manipulation happening but can\'t prove it to others',
      'Every move I make seems to strengthen my opponents\' position',
      'Something else entirely'
    ],
    hasOther: true,
  },
];

interface QualificationFormProps {
  onComplete?: () => void;
  isModal?: boolean;
}

const QualificationForm: React.FC<QualificationFormProps> = ({ onComplete, isModal = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showOtherField, setShowOtherField] = useState(false);

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > -1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleChange = (name, value) => {
    setAnswers({ ...answers, [name]: value });
    
    // Check if this is the pattern question and "Something else entirely" is selected
    if (name === 'pattern' && value === 'Something else entirely') {
      setShowOtherField(true);
    } else if (name === 'pattern') {
      setShowOtherField(false);
      // Clear the other field if switching away from "Something else entirely"
      if (answers.patternOther) {
        const newAnswers = { ...answers, [name]: value };
        delete newAnswers.patternOther;
        setAnswers(newAnswers);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
        setSubmitted(true);
      } else {
        console.error('Form submission failed.');
      }
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
    }
  };

  const progress = currentQuestion > -1 ? ((currentQuestion + 1) / (questions.length + 1)) * 100 : 0;

  if (submitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-12 max-w-4xl mx-auto"
        >
          <div className="space-y-8">
            <div className="w-16 h-px bg-foreground/20 mx-auto"></div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-[0.9] text-foreground">
              Assessment Complete
            </h1>
            <p className="text-base sm:text-lg font-light leading-relaxed text-foreground/80 max-w-2xl mx-auto">
              Thank you for taking the time to share your situation with us.
            </p>
          </div>
          
          <div className="text-left space-y-8 max-w-3xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-xl font-light text-foreground">What happens next:</h2>
              <div className="space-y-4 text-base font-light leading-relaxed text-foreground/80">
                <p>Within 48 hours, I'll personally review your responses and determine if our Autonomy Intelligence approach is the right fit for your specific situation.</p>
                <p>If we're a good match, you'll receive a custom scheduling link to book your Strategic Analysis Call at a time that works for you.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-light text-foreground">To prepare for the call:</h2>
              <ul className="space-y-3 text-base font-light leading-relaxed text-foreground/80 list-disc list-inside">
                <li>Have specific examples ready of how your autonomy is being undermined</li>
                <li>Think about your ideal outcome - what would restored autonomy look like for you?</li>
                <li>Be prepared for a diagnostic conversation focused on understanding your situation, not a sales presentation</li>
              </ul>
            </div>
            
            <div className="space-y-4 p-6 bg-secondary/20 border border-foreground/10 rounded-lg">
              <p className="text-base font-light leading-relaxed text-foreground/80">
                <strong className="text-foreground">Important:</strong> Not every situation requires our level of intervention. If we're not the right fit, I'll let you know and suggest alternative approaches that might serve you better.
              </p>
            </div>
          </div>
          
          <div className="space-y-4 text-center">
            <p className="text-base font-light text-foreground/80">You'll hear from me within 48 hours.</p>
            <p className="text-lg font-light text-foreground">Adam King, Founder - GenZen Intelligence Network</p>
          </div>
          
          <div className="pt-8">
            <div className="inline-flex items-center space-x-3 text-sm font-light tracking-widest uppercase text-foreground/60">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Assessment Submitted</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={isModal ? "w-full flex flex-col" : "min-h-screen w-full flex flex-col"}>
      <div className={isModal ? "flex flex-col" : "flex-1 flex flex-col"}>
        {/* Fixed Progress Bar at Top */}
        <div className="w-full bg-background/95 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto">
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-between items-center text-xs font-light tracking-widest uppercase text-foreground/60">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={isModal ? "flex flex-col justify-start px-6 pt-4" : "flex-1 flex flex-col justify-start px-6 pt-8"}>
          <div className="w-full max-w-3xl mx-auto my-10">
            <AnimatePresence mode="wait">
              {currentQuestion === -1 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-center space-y-12"
                >
                  <div className="space-y-8">
                    <div className="w-16 h-px bg-foreground/20 mx-auto"></div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-[0.9] text-foreground">
                      Ready to restore your 
                      <span className="block">autonomy?</span>
                    </h1>
                  </div>
                  <p className="text-base sm:text-lg font-light leading-relaxed text-foreground/80 max-w-xl mx-auto">
                    This brief assessment helps us understand your specific situation so we can provide targeted guidance in your Strategic Analysis Call.
                  </p>
                  <Button 
                    onClick={() => setCurrentQuestion(0)}
                    variant="outline"
                    size="lg"
                    className="font-light text-base px-8 py-3 border-2 border-foreground/30 rounded-full"
                  >
                    Start Assessment
                  </Button>
                </motion.div>
              )}
              {currentQuestion > -1 && currentQuestion < questions.length && (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="space-y-4 py-12"
                >
                  <div className="text-center space-y-6">
                    <div className="space-y-3">
                      <div className="text-sm font-light tracking-widest uppercase text-foreground/60">
                        Question {currentQuestion + 1} of {questions.length}
                      </div>
                    </div>
                    <label htmlFor={questions[currentQuestion].name} className="text-2xl sm:text-3xl md:text-4xl font-light leading-[1.1] text-foreground block">
                      {questions[currentQuestion].question}
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                      {questions[currentQuestion].type === 'text' && (
                        <Input
                          id={questions[currentQuestion].name}
                          type="text"
                          className="w-full p-4 text-lg font-light text-center bg-background border-2 border-foreground/20 rounded-lg focus:border-primary focus:ring-0 transition-all duration-300"
                          onChange={(e) => handleChange(questions[currentQuestion].name, e.target.value)}
                          value={answers[questions[currentQuestion].name] || ''}
                          autoFocus
                        />
                      )}
                      {questions[currentQuestion].type === 'email' && (
                        <Input
                          id={questions[currentQuestion].name}
                          type="email"
                          className="w-full p-4 text-lg font-light text-center bg-background border-2 border-foreground/20 rounded-lg focus:border-primary focus:ring-0 transition-all duration-300"
                          onChange={(e) => handleChange(questions[currentQuestion].name, e.target.value)}
                          value={answers[questions[currentQuestion].name] || ''}
                          autoFocus
                        />
                      )}
                      {questions[currentQuestion].type === 'textarea' && (
                        <Textarea
                          id={questions[currentQuestion].name}
                          className="w-full p-4 text-lg font-light min-h-[120px] bg-background border-2 border-foreground/20 rounded-lg focus:border-primary focus:ring-0 transition-all duration-300 resize-none"
                          onChange={(e) => handleChange(questions[currentQuestion].name, e.target.value)}
                          value={answers[questions[currentQuestion].name] || ''}
                          autoFocus
                        />
                      )}
                      {questions[currentQuestion].type === 'select' && (
                        <div className="space-y-4">
                          <Select onValueChange={(value) => handleChange(questions[currentQuestion].name, value)} value={answers[questions[currentQuestion].name] || ''}>
                            <SelectTrigger className="w-full p-4 text-lg font-light bg-background border-2 border-foreground/20 rounded-lg focus:border-primary focus:ring-0 transition-all duration-300">
                              <SelectValue placeholder="Select an option" className="font-light" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border border-foreground/20">
                              {questions[currentQuestion].options.map((option) => (
                                <SelectItem key={option} value={option} className="text-lg font-light hover:bg-secondary/30 p-3">
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {/* Conditional "Other" text field */}
                          {questions[currentQuestion].hasOther && showOtherField && answers[questions[currentQuestion].name] === 'Something else entirely' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Textarea
                                placeholder="Please describe your situation..."
                                className="w-full p-4 text-lg font-light min-h-[120px] bg-background border-2 border-foreground/20 rounded-lg focus:border-primary focus:ring-0 transition-all duration-300 resize-none"
                                onChange={(e) => handleChange(questions[currentQuestion].name + 'Other', e.target.value)}
                                value={answers[questions[currentQuestion].name + 'Other'] || ''}
                              />
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              {currentQuestion === questions.length && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="space-y-12"
                >
                  <div className="text-center space-y-8">
                    <div className="space-y-4">
                      <div className="w-16 h-px bg-foreground/20 mx-auto"></div>
                      <div className="text-sm font-light tracking-widest uppercase text-foreground/60">
                        Final Review
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-light leading-[1.2] text-foreground">
                      Review Your Answers
                    </h2>
                  </div>
                  <div className="space-y-6 max-w-4xl mx-auto">
                    {questions.map((q, i) => (
                      <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 bg-secondary/20 border border-foreground/10 rounded-lg hover:bg-secondary/30 transition-all duration-300">
                        <p className="font-light text-foreground/80 text-base">{q.question}</p>
                        <div className="text-foreground font-light text-base lg:text-right">
                          <p>{answers[q.name] || 'Not answered'}</p>
                          {q.hasOther && answers[q.name] === 'Something else entirely' && answers[q.name + 'Other'] && (
                            <p className="mt-2 text-sm text-foreground/70 italic">"{answers[q.name + 'Other']}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Navigation - Now inside content area */}
            <div className="w-full max-w-2xl mx-auto flex justify-between items-center mt-12">
              {currentQuestion > -1 ? (
                <Button 
                  variant="outline" 
                  onClick={handlePrev}
                  size="lg"
                  className="font-light text-base px-8 py-3 border-2 border-foreground/30 rounded-full"
                >
                  Previous
                </Button>
              ) : <div />}
              {currentQuestion < questions.length -1 ? (
                <Button 
                  onClick={handleNext}
                  variant="outline"
                  size="lg"
                  className="font-light text-base px-8 py-3 border-2 border-foreground/30 rounded-full"
                >
                  Next
                </Button>
              ) : currentQuestion === questions.length -1 ? (
                  <Button 
                    onClick={handleNext}
                    variant="outline"
                    size="lg"
                    className="font-light text-base px-8 py-3 border-2 border-foreground/30 rounded-full"
                  >
                    Review
                  </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  variant="outline"
                  size="lg"
                  className="font-light text-base px-8 py-3 border-2 border-foreground/30 rounded-full"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationForm;