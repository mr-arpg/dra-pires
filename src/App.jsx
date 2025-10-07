import { useState, useEffect } from 'react'
import './App.css'
import draPiresPhoto from './assets/dra-pires.jpg'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState('')
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [language, setLanguage] = useState('pt')

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzQHAE_aGYZXPQOSDHUqER9r2fZU4GMwRbL8hjAkGEdkmBwlB1Kyyvii7hrDs-ctA-Iug/exec'

  // Translations object
  const translations = {
    pt: {
      title: 'Psicóloga',
      credential1: '✓ Membro Efetivo da Ordem dos Psicólogos Portugueses',
      credential2: '✓ Mais de 30 anos de experiência profissional',
      credential3: '✓ Experiência nacional e internacional',
      aboutTitle: 'Sobre a Dra. Pires',
      formationTitle: 'Formação',
      formationText: 'Licenciada em Psicologia. Formação em Neuropsicologia, Neuroeducação, Neurociências e Ciências da Educação. Membro efetivo da Ordem dos Psicólogos Portugueses.',
      experienceTitle: 'Experiência',
      experienceText: 'Experiência profissional em contexto nacional e internacional, trabalhando com diversos grupos etários e problemáticas psicológicas.',
      internationalTitle: 'Práticas Internacionais',
      internationalText: 'Possibilidade de acompanhamento em Francês, Inglês e Espanhol.',
      servicesTitle: 'Serviços Disponíveis',
      service1Title: 'Pacote de 4 Sessões Mensais',
      service1Item1: 'Sessões online ou presencial',
      service1Item2: 'Desenvolvimento de estratégias personalizadas',
      service1Item3: 'Foco no bem-estar pessoal, social e académico',
      servicePrice: 'Preço Variável mediante rendimento familiar (declaração de IRS)',
      service2Title: 'Acompanhamento Especializado',
      service2Item1: 'Resolução de estados depressivos',
      service2Item2: 'Gestão de ansiedade e stress',
      service2Item3: 'Melhoria da qualidade do sono',
      service2Item4: 'Estratégias académicas',
      contactTitle: 'Entra em contacto',
      phoneTitle: 'Telefone',
      phoneAvailability: 'Disponível para marcação de consultas',
      emailTitle: 'Email',
      emailAvailability: 'Resposta rápida garantida',
      consultationTitle: 'Consulta',
      consultationType: 'Online ou Presencial',
      consultationHours: 'Horários flexíveis',
      encouragementTitle: 'NÃO FIQUES SÓ!',
      encouragementText: 'Estou aqui para te ajudar a superar os teus desafios e alcançar o bem-estar que mereces.',
      footerText: '2025 Dra. Fátima Pires - Psicóloga',
      restartButton: 'Fazer questionário novamente',
      quizQuestion1: 'Qual é a tua idade?',
      quizQuestion2: 'Com que tipo de desafios te identificas mais? (podes escolher várias opções)',
      quizAge1: '18-21 anos',
      quizAge2: '22-25 anos',
      quizAge3: '26-30 anos',
      quizAge4: 'Mais de 30 anos',
      quizProblem1: 'Ansiedade e stress',
      quizProblem2: 'Estados depressivos',
      quizProblem3: 'Problemas de sono',
      quizProblem4: 'Dificuldades académicas',
      quizProblem5: 'Problemas sociais/relacionamentos',
      quizProblem6: 'Alterações de comportamento',
      quizProblem7: 'Autoestima e confiança',
      quizProblem8: 'Outros desafios',
      emailPageTitle: 'Para veres o resultado por favor introduz o teu email',
      emailPlaceholder: 'O teu email',
      emailInstruction: 'O teu email será usado apenas para te enviar informações relevantes sobre os serviços da Dra. Pires.',
      emailSubmitButton: 'Ver Resultado!',
      previousButton: 'Anterior',
      nextButton: 'Seguinte',
      resultButton: 'Ver Resultado',
      helpPrefix: 'Eu posso ajudar-te a ',
      helpAnxiety: 'gerir a ansiedade e encontrar estratégias de relaxamento, ',
      helpDepression: 'superar estados depressivos e recuperar o bem-estar emocional, ',
      helpSleep: 'melhorar a qualidade do sono e estabelecer rotinas saudáveis, ',
      helpAcademic: 'desenvolver estratégias de estudo e gestão do tempo académico, ',
      helpSocial: 'melhorar os relacionamentos sociais e construir conexões mais saudáveis, ',
      helpBehavior: 'modificar padrões de comportamento e desenvolver hábitos mais positivos, ',
      helpSelfEsteem: 'aumentar a autoestima e confiança pessoal, ',
      helpSuffix: 'através de um acompanhamento psicológico personalizado e especializado.'
    },
    en: {
      title: 'Psychologist',
      credential1: '✓ Full Member of the Portuguese Psychologists Association',
      credential2: '✓ Over 30 years of professional experience',
      credential3: '✓ National and international experience',
      aboutTitle: 'About Dr. Pires',
      formationTitle: 'Education',
      formationText: 'Degree in Psychology. Training in Neuropsychology, Neuroeducation, Neurosciences, and Education Sciences. Full member of the Portuguese Psychologists Association.',
      experienceTitle: 'Experience',
      experienceText: 'Professional experience in national and international contexts, working with diverse age groups and psychological issues.',
      internationalTitle: 'International Practice',
      internationalText: 'Sessions available in French, English, and Spanish.',
      servicesTitle: 'Available Services',
      service1Title: 'Package of 4 Monthly Sessions',
      service1Item1: 'Online or in-person sessions',
      service1Item2: 'Development of personalized strategies',
      service1Item3: 'Focus on personal, social, and academic well-being',
      servicePrice: 'Variable price based on family income (tax return declaration)',
      service2Title: 'Specialized Support',
      service2Item1: 'Resolution of depressive states',
      service2Item2: 'Anxiety and stress management',
      service2Item3: 'Sleep quality improvement',
      service2Item4: 'Academic strategies',
      contactTitle: 'Get in touch',
      phoneTitle: 'Phone',
      phoneAvailability: 'Available for appointment scheduling',
      emailTitle: 'Email',
      emailAvailability: 'Quick response guaranteed',
      consultationTitle: 'Consultation',
      consultationType: 'Online or In-Person',
      consultationHours: 'Flexible hours',
      encouragementTitle: 'DON\'T BE ALONE!',
      encouragementText: 'I am here to help you overcome your challenges and achieve the well-being you deserve.',
      footerText: '2025 Dr. Fátima Pires - Psychologist',
      restartButton: 'Take quiz again',
      quizQuestion1: 'What is your age?',
      quizQuestion2: 'What type of challenges do you identify with most? (you can choose multiple options)',
      quizAge1: '18-21 years old',
      quizAge2: '22-25 years old',
      quizAge3: '26-30 years old',
      quizAge4: 'Over 30 years old',
      quizProblem1: 'Anxiety and stress',
      quizProblem2: 'Depressive states',
      quizProblem3: 'Sleep problems',
      quizProblem4: 'Academic difficulties',
      quizProblem5: 'Social/relationship problems',
      quizProblem6: 'Behavioral changes',
      quizProblem7: 'Self-esteem and confidence',
      quizProblem8: 'Other challenges',
      emailPageTitle: 'To see the result, please enter your email',
      emailPlaceholder: 'Your email',
      emailInstruction: 'Your email will only be used to send you relevant information about Dr. Pires\' services.',
      emailSubmitButton: 'See Result!',
      previousButton: 'Previous',
      nextButton: 'Next',
      resultButton: 'See Result',
      helpPrefix: 'I can help you ',
      helpAnxiety: 'manage anxiety and find relaxation strategies, ',
      helpDepression: 'overcome depressive states and recover emotional well-being, ',
      helpSleep: 'improve sleep quality and establish healthy routines, ',
      helpAcademic: 'develop study strategies and academic time management, ',
      helpSocial: 'improve social relationships and build healthier connections, ',
      helpBehavior: 'modify behavior patterns and develop more positive habits, ',
      helpSelfEsteem: 'increase self-esteem and personal confidence, ',
      helpSuffix: 'through personalized and specialized psychological support.'
    }
  }

  const t = (key) => translations[language][key]

  const questions = [
    {
      id: 'age',
      get question() { return t('quizQuestion1') },
      type: 'select',
      get options() {
        return [
          { value: '18-21', label: t('quizAge1') },
          { value: '22-25', label: t('quizAge2') },
          { value: '26-30', label: t('quizAge3') },
          { value: '30+', label: t('quizAge4') }
        ]
      }
    },
    {
      id: 'problems',
      get question() { return t('quizQuestion2') },
      type: 'multiple',
      get options() {
        return [
          { value: 'anxiety', label: t('quizProblem1') },
          { value: 'depression', label: t('quizProblem2') },
          { value: 'sleep', label: t('quizProblem3') },
          { value: 'academic', label: t('quizProblem4') },
          { value: 'social', label: t('quizProblem5') },
          { value: 'behavior', label: t('quizProblem6') },
          { value: 'self-esteem', label: t('quizProblem7') },
          { value: 'other', label: t('quizProblem8') }
        ]
      }
    }
  ]

  // Verificar se o utilizador já completou o questionário
  useEffect(() => {
    const completed = localStorage.getItem('dra-pires-quiz-completed')
    const savedAnswers = localStorage.getItem('dra-pires-quiz-answers')
    const savedEmail = localStorage.getItem('dra-pires-quiz-email')
    
    console.log('Verificando cache:', { completed, savedAnswers, savedEmail })
    
    if (completed === 'true') {
      setHasCompletedQuiz(true)
      setShowResult(true)
      setEmailSubmitted(true)
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers))
      }
      if (savedEmail) {
        setEmail(savedEmail)
      }
    }
  }, [])

  // Função para guardar dados no Google Sheets
  const submitToGoogleSheets = async (data) => {
    try {
      console.log('Enviando dados para Google Sheets:', data)
      
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
      })
      
      console.log('Resposta do Google Sheets:', response)
      
      // Com mode: 'no-cors', não conseguimos verificar o status da resposta
      // Mas assumimos que se não houve erro na requisição, foi enviado com sucesso
      return true
    } catch (error) {
      console.error('Erro ao enviar para Google Sheets:', error)
      return false
    }
  }

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    console.log('🔵 handleNext chamado!')
    console.log('currentStep:', currentStep)
    console.log('questions.length:', questions.length)
    
    if (currentStep < questions.length - 1) {
      console.log('➡️ Indo para próxima pergunta')
      setCurrentStep(currentStep + 1)
    } else {
      // Última pergunta - incrementar para mostrar pedido de email
      console.log('📧 Última pergunta - indo para página de email')
      setCurrentStep(currentStep + 1)
      setSubmissionStatus('')
    }
  }

  const handleEmailSubmit = () => {
    console.log('🔥 BOTÃO CLICADO! handleEmailSubmit chamado')
    console.log('Email:', email)
    console.log('Answers:', answers)
    
    if (!email.trim()) {
      setSubmissionStatus('Por favor, introduz o teu email.')
      return
    }

    console.log('✅ Email válido, prosseguindo...')
    
    // Mapear problemas para português
    const problemMap = {
      'anxiety': 'Ansiedade e stress',
      'depression': 'Estados depressivos',
      'sleep': 'Problemas de sono',
      'academic': 'Dificuldades académicas',
      'social': 'Problemas sociais/relacionamentos',
      'behavior': 'Alterações de comportamento',
      'self-esteem': 'Autoestima e confiança',
      'other': 'Outros desafios'
    }

    // Preparar dados para Google Sheets
    const problemsArray = Array.isArray(answers.problems) ? answers.problems : []
    const problemsInPortuguese = problemsArray.map(problem => problemMap[problem] || problem).join(', ')
    
    const dataToSubmit = {
      idade: answers.age || '',
      problema: problemsInPortuguese,
      email: email.trim(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
    
    console.log('📊 Dados preparados:', dataToSubmit)
    
    // Enviar para Google Sheets (não esperamos pela resposta)
    submitToGoogleSheets(dataToSubmit)
    
    console.log('💾 Guardando no localStorage...')
    
    // Guardar no localStorage que o questionário foi completado
    localStorage.setItem('dra-pires-quiz-completed', 'true')
    localStorage.setItem('dra-pires-quiz-answers', JSON.stringify(answers))
    localStorage.setItem('dra-pires-quiz-email', email)
    
    console.log('🔄 Atualizando estados...')
    
    // Atualizar estados IMEDIATAMENTE
    setEmailSubmitted(true)
    setShowResult(true)
    
    console.log('🎯 Estados atualizados!')
    console.log('emailSubmitted:', true)
    console.log('showResult:', true)
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResult(false)
    setHasCompletedQuiz(false)
    setSubmissionStatus('')
    setEmail('')
    setEmailSubmitted(false)
    // Limpar cache do localStorage
    localStorage.removeItem('dra-pires-quiz-completed')
    localStorage.removeItem('dra-pires-quiz-answers')
    localStorage.removeItem('dra-pires-quiz-email')
  }

  const generatePersonalizedMessage = () => {
    const age = answers.age
    const problems = answers.problems || []
    
    let message = t('helpPrefix')
    
    if (problems.includes('anxiety')) {
      message += t('helpAnxiety')
    }
    if (problems.includes('depression')) {
      message += t('helpDepression')
    }
    if (problems.includes('sleep')) {
      message += t('helpSleep')
    }
    if (problems.includes('academic')) {
      message += t('helpAcademic')
    }
    if (problems.includes('social')) {
      message += t('helpSocial')
    }
    if (problems.includes('behavior')) {
      message += t('helpBehavior')
    }
    if (problems.includes('self-esteem')) {
      message += t('helpSelfEsteem')
    }
    
    // Remove última vírgula
    message = message.replace(/,\s*$/, '')
    
    message += ' ' + t('helpSuffix')
    
    return message
  }


  // Debug dos estados
  console.log('🔍 Estados atuais:', {
    currentStep,
    questionsLength: questions.length,
    emailSubmitted,
    showResult,
    hasCompletedQuiz
  })

  // Se já mostrou resultado, mostrar a página principal
  if (showResult || hasCompletedQuiz) {
    console.log('📄 Mostrando página de resultado')
    return (
      <div className="portfolio-container">
        {/* Header Profissional */}
        <header className="portfolio-header">
          <button 
            className="language-toggle"
            onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
            aria-label="Toggle language"
          >
            {language === 'pt' ? 'EN' : 'PT'}
          </button>
          <div className="header-content">
            <div className="psychologist-intro">
              <h1>Dra. Fátima Pires</h1>
              <h2>{t('title')}</h2>
              <div className="credentials">
                <span className="credential">{t('credential1')}</span>
                <span className="credential">{t('credential2')}</span>
                <span className="credential">{t('credential3')}</span>
              </div>
            </div>
            <div className="profile-image">
              <img 
                src={draPiresPhoto} 
                alt="Dra. Fátima Pires - Psicóloga Clínica" 
                className="profile-photo"
              />
            </div>
          </div>
        </header>

        {/* Mensagem Personalizada */}
        <section className="personalized-section">
          <div className="container">
            <div className="message-card">
              <div className="quote-icon">"</div>
              <p className="message-text">{generatePersonalizedMessage()}</p>
              <div className="quote-icon-end">"</div>
            </div>
          </div>
        </section>


        {/* Sobre */}
        <section className="about-section">
          <div className="container">
            <h3>{t('aboutTitle')}</h3>
            <div className="about-grid">
              <div className="about-card">
                <div className="card-icon">🎓</div>
                <h4>{t('formationTitle')}</h4>
                <p>{t('formationText')}</p>
              </div>
              <div className="about-card">
                <div className="card-icon">🌍</div>
                <h4>{t('experienceTitle')}</h4>
                <p>{t('experienceText')}</p>
              </div>
              <div className="about-card">
                <div className="card-icon">🌍</div>
                <h4>{t('internationalTitle')}</h4>
                <p>{t('internationalText')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section className="services-section">
          <div className="container">
            <h3>{t('servicesTitle')}</h3>
            <div className="services-grid">
              <div className="service-card">
                <h4>{t('service1Title')}</h4>
                <ul>
                  <li>{t('service1Item1')}</li>
                  <li>{t('service1Item2')}</li>
                  <li>{t('service1Item3')}</li>
                </ul>
                <div className="service-price">{t('servicePrice')}</div>
              </div>
              <div className="service-card">
                <h4>{t('service2Title')}</h4>
                <ul>
                  <li>{t('service2Item1')}</li>
                  <li>{t('service2Item2')}</li>
                  <li>{t('service2Item3')}</li>
                  <li>{t('service2Item4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="contact-section">
          <div className="container">
            <h3>{t('contactTitle')}</h3>
            <div className="contact-grid">
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h4>{t('phoneTitle')}</h4>
                <a href="https://wa.me/351938721803" target="_blank" rel="noopener noreferrer">938 721 803</a>
                <p>{t('phoneAvailability')}</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">✉️</div>
                <h4>{t('emailTitle')}</h4>
                <a href="mailto:piresfatima@live.com.pt">piresfatima@live.com.pt</a>
                <p>{t('emailAvailability')}</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">💬</div>
                <h4>{t('consultationTitle')}</h4>
                <p>{t('consultationType')}</p>
                <p>{t('consultationHours')}</p>
              </div>
            </div>
            <div className="encouragement-message">
              <h4>{t('encouragementTitle')}</h4>
              <p>{t('encouragementText')}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="portfolio-footer">
          <div className="container">
            <p>&copy; {t('footerText')}</p>
            <button className="restart-button" onClick={resetQuiz}>
              {t('restartButton')}
            </button>
          </div>
        </footer>
      </div>
    )
  }

  // Página de pedido de email
  if (currentStep >= questions.length) {
    console.log('📧 Mostrando página de pedido de email')
    return (
      <div className="app">
        <div className="quiz-container email-page">
          <div className="quiz-card">
            <h2>{t('emailPageTitle')}</h2>
            
            <div className="email-form-container">
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
              <p className="email-instruction">
                {t('emailInstruction')}
              </p>
              <button 
                onClick={() => {
                  console.log('🔥 BOTÃO CLICADO!')
                  handleEmailSubmit()
                }}
                className="email-submit-button"
              >
                {t('emailSubmitButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]

  return (
    <div className="app">
      <div className="quiz-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="question-container">
          <h1 className="question-title">{currentQuestion.question}</h1>
          
          <div className="options-container">
            {currentQuestion.options.map((option) => (
              <label key={option.value} className="option-label">
                <input
                  type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                  name={currentQuestion.id}
                  value={option.value}
                  checked={
                    currentQuestion.type === 'multiple' 
                      ? (answers[currentQuestion.id] || []).includes(option.value)
                      : answers[currentQuestion.id] === option.value
                  }
                  onChange={(e) => {
                    if (currentQuestion.type === 'multiple') {
                      const currentAnswers = answers[currentQuestion.id] || []
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, option.value]
                        : currentAnswers.filter(ans => ans !== option.value)
                      handleAnswer(currentQuestion.id, newAnswers)
                    } else {
                      handleAnswer(currentQuestion.id, option.value)
                    }
                  }}
                />
                <span className="option-text">{option.label}</span>
              </label>
            ))}
          </div>
          
          <div className="navigation-buttons">
            {currentStep > 0 && (
              <button className="nav-button prev-button" onClick={handlePrevious}>
                {t('previousButton')}
              </button>
            )}
            <button 
              className="nav-button next-button" 
              onClick={() => {
                console.log('🟢 Botão Next/Ver Resultado clicado!')
                handleNext()
              }}
              disabled={
                !answers[currentQuestion.id] || 
                (currentQuestion.type === 'multiple' && answers[currentQuestion.id].length === 0)
              }
            >
              {currentStep === questions.length - 1 ? t('resultButton') : t('nextButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App