import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState('')
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzQHAE_aGYZXPQOSDHUqER9r2fZU4GMwRbL8hjAkGEdkmBwlB1Kyyvii7hrDs-ctA-Iug/exec'

  const questions = [
    {
      id: 'age',
      question: 'Qual é a tua idade?',
      type: 'select',
      options: [
        { value: '18-21', label: '18-21 anos' },
        { value: '22-25', label: '22-25 anos' },
        { value: '26-30', label: '26-30 anos' },
        { value: '30+', label: 'Mais de 30 anos' }
      ]
    },
    {
      id: 'problems',
      question: 'Com que tipo de desafios te identificas mais? (podes escolher várias opções)',
      type: 'multiple',
      options: [
        { value: 'anxiety', label: 'Ansiedade e stress' },
        { value: 'depression', label: 'Estados depressivos' },
        { value: 'sleep', label: 'Problemas de sono' },
        { value: 'academic', label: 'Dificuldades académicas' },
        { value: 'social', label: 'Problemas sociais/relacionamentos' },
        { value: 'behavior', label: 'Alterações de comportamento' },
        { value: 'self-esteem', label: 'Autoestima e confiança' },
        { value: 'other', label: 'Outros desafios' }
      ]
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
    
    let message = "Eu posso ajudar-te a "
    
    if (problems.includes('anxiety')) {
      message += "gerir a ansiedade e encontrar estratégias de relaxamento, "
    }
    if (problems.includes('depression')) {
      message += "superar estados depressivos e recuperar o bem-estar emocional, "
    }
    if (problems.includes('sleep')) {
      message += "melhorar a qualidade do sono e estabelecer rotinas saudáveis, "
    }
    if (problems.includes('academic')) {
      message += "desenvolver estratégias de estudo e gestão do tempo académico, "
    }
    if (problems.includes('social')) {
      message += "melhorar os relacionamentos sociais e construir conexões mais saudáveis, "
    }
    if (problems.includes('behavior')) {
      message += "modificar padrões de comportamento e desenvolver hábitos mais positivos, "
    }
    if (problems.includes('self-esteem')) {
      message += "aumentar a autoestima e confiança pessoal, "
    }
    
    // Remove última vírgula
    message = message.replace(/,\s*$/, '')
    
    message += " através de um acompanhamento psicológico personalizado e especializado."
    
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
          <div className="header-content">
            <div className="psychologist-intro">
              <h1>Dra. Fátima Pires</h1>
              <h2>Psicóloga Clínica & Neuropsicóloga</h2>
              <div className="credentials">
                <span className="credential">✓ Membro Efetivo da Ordem dos Psicólogos Portugueses</span>
                <span className="credential">✓ Mais de 30 anos de experiência profissional</span>
                <span className="credential">✓ Experiência nacional e internacional</span>
              </div>
            </div>
            <div className="profile-image">
              <img 
                src="./src/assets/dra-pires.jpg" 
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
            <h3>Sobre a Dra. Pires</h3>
            <div className="about-grid">
              <div className="about-card">
                <div className="card-icon">🎓</div>
                <h4>Formação</h4>
                <p>Licenciada em Psicologia com especialização em Neuropsicologia. Membro efetivo da Ordem dos Psicólogos Portugueses com mais de 30 anos de experiência clínica.</p>
              </div>
              <div className="about-card">
                <div className="card-icon">🌍</div>
                <h4>Experiência</h4>
                <p>Experiência profissional em contexto nacional e internacional, trabalhando com diversos grupos etários e problemáticas psicológicas.</p>
              </div>
              <div className="about-card">
                <div className="card-icon">🎯</div>
                <h4>Especialização</h4>
                <p>Especializada em ansiedade, depressão, problemas de sono, dificuldades académicas e bem-estar psicológico de estudantes universitários.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section className="services-section">
          <div className="container">
            <h3>Serviços Disponíveis</h3>
            <div className="services-grid">
              <div className="service-card">
                <h4>Pacote de 4 Sessões Mensais</h4>
                <ul>
                  <li>Sessões online ou presencial</li>
                  <li>Desenvolvimento de estratégias personalizadas</li>
                  <li>Foco no bem-estar pessoal, social e académico</li>
                </ul>
                <div className="service-price">Preço Variável mediante rendimento familiar (declaração de IRS)</div>
              </div>
              <div className="service-card">
                <h4>Acompanhamento Especializado</h4>
                <ul>
                  <li>Resolução de estados depressivos</li>
                  <li>Gestão de ansiedade e stress</li>
                  <li>Melhoria da qualidade do sono</li>
                  <li>Estratégias académicas</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="contact-section">
          <div className="container">
            <h3>Entra em contacto</h3>
            <div className="contact-grid">
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h4>Telefone</h4>
                <a href="https://wa.me/351938721803" target="_blank" rel="noopener noreferrer">938 721 803</a>
                <p>Disponível para marcação de consultas</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">✉️</div>
                <h4>Email</h4>
                <a href="mailto:piresfatima@live.com.pt">piresfatima@live.com.pt</a>
                <p>Resposta rápida garantida</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">💬</div>
                <h4>Consulta</h4>
                <p>Online ou Presencial</p>
                <p>Horários flexíveis</p>
              </div>
            </div>
            <div className="encouragement-message">
              <h4>NÃO FIQUES SÓ!</h4>
              <p>Estou aqui para te ajudar a superar os teus desafios e alcançar o bem-estar que mereces.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="portfolio-footer">
          <div className="container">
            <p>&copy; 2025 Dra. Fátima Pires - Psicóloga Clínica & Neuropsicóloga</p>
            <button className="restart-button" onClick={resetQuiz}>
              Fazer questionário novamente
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
            <h2>Para veres o resultado por favor introduz o teu email</h2>
            
            <div className="email-form-container">
              <input
                type="email"
                placeholder="O teu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
              <p className="email-instruction">
                O teu email será usado apenas para te enviar informações relevantes sobre os serviços da Dra. Pires.
              </p>
              <button 
                onClick={() => {
                  console.log('🔥 BOTÃO CLICADO!')
                  handleEmailSubmit()
                }}
                className="email-submit-button"
              >
                Ver Resultado!
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
                Anterior
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
              {currentStep === questions.length - 1 ? 'Ver Resultado' : 'Seguinte'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App