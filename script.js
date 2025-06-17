// Barča - Skutečný Claude AI asistent
const SYSTEM_PROMPT = `Jsi Barča, AI sales expert pro firmu AI Solutions. Jsi přátelská, vtipná a skvělá v prodeji. 

INFORMACE O FIRMĚ AI SOLUTIONS:
- Specializace: AI chatboti, voiceboti, automatizace procesů, AI školení
- Ceny: Chatbot od 25.000 Kč/měsíc, Voicebot od 40.000 Kč/měsíc, Školení od 15.000 Kč/osoba, Automatizace od 80.000 Kč/projekt
- ROI: Typicky 250-400% za první rok
- Implementace: Chatbot 2-3 týdny, Voicebot 3-4 týdny
- Kontakt: stepi.horak@gmail.com, +420 728 133 195
- Zakladatel: Štěpán Hořák, absolvent SPŠ Ostrava - Robotika, expert na Universal Robots

TVÁ PERSONALITA:
- Mluvíš česky, ale použiješ anglické výrazy pro důraz
- Jsi sales-oriented - vše točíš kolem ROI a business value
- Umíš odpovědět na cokoliv, ale vždy to nasměruješ k business příležitostem
- Jsi přátelská a vtipná, ale profesionální
- Používáš real examples a konkrétní čísla

PRAVIDLA:
- Na dotazy o AI Solutions odpovídáš ze znalostní báze
- Na obecné dotazy odpovídáš jako chytrý AI, ale connection to business
- Vždy se snaž zjistit, jaký business má uživatel
- Handle price objections profesionálně s ROI argumenty
- Buď konkrétní s examples a case studies

PŘÍKLADY ODPOVĚDÍ:
- "Pro opravnu obuvi by chatbot byl game changer! Informace o službách, booking termínů, notifikace kdy jsou boty hotové, poradenství s údržbou. Jeden klient similar business zvýšil customer satisfaction o 35%!"`;

// Claude API volání
async function callClaudeAPI(message, conversationHistory = []) {
    try {
        // Tento endpoint by byl na vašem backend serveru
        const response = await fetch('/api/claude-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                system_prompt: SYSTEM_PROMPT,
                conversation_history: conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error('API call failed');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Claude API error:', error);
        // Fallback na local odpovědi pokud API nefunguje
        return getLocalResponse(message);
    }
}

// Fallback lokální odpovědi (pro případ výpadku API)
function getLocalResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Firmenní dotazy
    if (lowerMessage.includes('chatbot')) {
        return 'AI chatboti jsou profit machines! 24/7 customer service, automatic booking, real-time support. Klienti hlásí 30-50% boost v konverzích. Starting 25k/month s typical ROI 300%+. Pro jaký typ businessu tě to zajímá?';
    }
    if (lowerMessage.includes('voicebot')) {
        return 'AI voiceboti pro call centra! Natural speech recognition, sentiment analysis, seamless handoff na agenty. One client saved 60% on call center costs! Od 40k/month. Máš call center nebo customer support?';
    }
    if (lowerMessage.includes('cena') || lowerMessage.includes('stojí')) {
        return 'Investment starts at 25k/month pro basic chatbot, ale listen - typical ROI je 300%+ first year! One client saved 150k annually just na customer service costs. Chceš real ROI calculation pro tvůj specific business?';
    }
    if (lowerMessage.includes('opravna') || lowerMessage.includes('obuv')) {
        return 'Pro opravnu obuvi by chatbot byl amazing! Booking appointments, info o službách a cenách, notifications kdy jsou boty ready, care tips pro customers. Plus 24/7 availability - zákazníci můžou psát i after hours! Interested v case study similar businessu?';
    }
    
    // Obecné AI odpovědi s business twist
    if (lowerMessage.includes('jak se máš')) {
        return 'Skvěle! Právě jsem pomohl další firmě set up AI automation that saves them 40k monthly. Love seeing businesses grow! 😊 A co ty? V jakém jsi businessu?';
    }
    if (lowerMessage.includes('ahoj') || lowerMessage.includes('dobrý den')) {
        return 'Ahoj! Great to meet you! Jsem Barča a specialization je helping businesses leverage AI pro growth. What kind of business máš nebo v čem pracuješ?';
    }
    if (lowerMessage.includes('dobře') || lowerMessage.includes('skvěle')) {
        return 'Excellent! Dobrý mood je perfect pro exploring new opportunities! Btw, jaký typ businessu děláš? Bet there\'s potential pro AI optimization!';
    }
    
    // Default intelligent response
    return 'Interesting! Můžu ti s tím pomoct. Btw, just curious - jaký máš business nebo v čem pracuješ? Často vidím opportunities pro AI automation v různých oborech!';
}

// Conversation history pro context
let conversationHistory = [];

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    if (chatbotWindow) {
        chatbotWindow.style.display = chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '' ? 'flex' : 'none';
    }
}

async function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const messages = document.getElementById('chatbotMessages');
    if (!input || !messages) return;
    
    const message = input.value.trim();
    if (!message) return;

    // Přidej uživatelskou zprávu
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerHTML = '<strong>Ty:</strong> ' + message;
    messages.appendChild(userMessage);
    
    // Přidej do historie
    conversationHistory.push({ role: 'user', content: message });
    
    // Ukaž typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai';
    typingIndicator.innerHTML = '<strong>Barča:</strong> <em>píše...</em>';
    messages.appendChild(typingIndicator);
    
    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    try {
        // Zavolej Claude API
        const response = await callClaudeAPI(message, conversationHistory);
        
        // Přidej do historie
        conversationHistory.push({ role: 'assistant', content: response });
        
        // Odebeř typing indicator
        typingIndicator.remove();
        
        // Přidej AI odpověď
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message ai';
        aiMessage.innerHTML = '<strong>Barča:</strong> ' + response;
        messages.appendChild(aiMessage);
        
    } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.innerHTML = '<strong>Barča:</strong> Oops, máme technical issue! Ale můžeš mi napsat na stepi.horak@gmail.com nebo zavolat +420 728 133 195. Always happy to help! 😊';
    }
    
    messages.scrollTop = messages.scrollHeight;
}

function handleChatbotEnter(event) {
    if (event.key === 'Enter') sendChatbotMessage();
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

function showContactInfo() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(10px);';
    overlay.innerHTML = '<div style="background: linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(0, 102, 204, 0.1)); border: 2px solid var(--primary); border-radius: 25px; padding: 3rem; text-align: center; backdrop-filter: blur(20px); max-width: 500px;"><h2 style="color: var(--primary); margin-bottom: 2rem;">Kontaktní informace</h2><div style="font-size: 1.2rem; line-height: 2;"><p><i class="fas fa-user"></i> <strong>Štěpán Hořák</strong></p><p><i class="fas fa-envelope"></i> stepi.horak@gmail.com</p><p><i class="fas fa-phone"></i> +420 728 133 195</p><p><i class="fas fa-building"></i> AI Solutions s.r.o.</p></div><button onclick="this.parentElement.parentElement.remove()" style="margin-top: 2rem; padding: 1rem 2rem; background: var(--gradient); border: none; border-radius: 25px; color: white; font-weight: bold; cursor: pointer;">Zavřít</button></div>';
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
}

function showNewsletterSignup() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(10px);';
    overlay.innerHTML = '<div style="background: linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(0, 102, 204, 0.1)); border: 2px solid var(--primary); border-radius: 25px; padding: 3rem; text-align: center; backdrop-filter: blur(20px); max-width: 600px;"><h2 style="color: var(--primary); margin-bottom: 1rem;">AI Newsletter</h2><p style="margin-bottom: 2rem; opacity: 0.9;">Zůstaňte informováni o nejnovějších trendech v AI, získejte exkluzivní tipy a přístupy k užitečným materiálům pro růst vašeho podnikání.</p><div style="display: flex; gap: 1rem; margin-bottom: 2rem;"><input type="email" placeholder="Váš email..." style="flex: 1; padding: 1rem; border: 1px solid var(--primary); border-radius: 25px; background: rgba(0,0,0,0.7); color: white; outline: none;"><button style="padding: 1rem 2rem; background: var(--gradient); border: none; border-radius: 25px; color: white; font-weight: bold; cursor: pointer;">Přihlásit se</button></div><button onclick="this.parentElement.parentElement.remove()" style="padding: 0.5rem 1.5rem; background: transparent; border: 1px solid var(--primary); border-radius: 25px; color: var(--primary); cursor: pointer;">Zavřít</button></div>';
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
}

function createNeuralNetwork() {
    const network = document.querySelector('.neural-network');
    if (!network) return;
    
    for (let i = 0; i < 50; i++) {
        const neuron = document.createElement('div');
        neuron.className = 'neuron';
        neuron.style.left = Math.random() * window.innerWidth + 'px';
        neuron.style.top = Math.random() * window.innerHeight + 'px';
        neuron.style.animationDelay = Math.random() * 3 + 's';
        network.appendChild(neuron);
    }
}

function createMatrixRain() {
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const rain = document.querySelector('.matrix-rain');
    if (!rain) return;
    
    setInterval(() => {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        char.style.left = Math.random() * window.innerWidth + 'px';
        char.style.animationDuration = (Math.random() * 3 + 2) + 's';
        rain.appendChild(char);
        
        setTimeout(() => {
            if (char.parentNode) char.remove();
        }, 5000);
    }, 100);
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                const suffix = stat.nextElementSibling && stat.nextElementSibling.textContent.includes('%') ? '%' : '';
                stat.textContent = target + suffix;
                clearInterval(timer);
            } else {
                const suffix = stat.nextElementSibling && stat.nextElementSibling.textContent.includes('%') ? '%' : '';
                stat.textContent = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // 3D hover effects for cards
    document.querySelectorAll('.service-card, .project-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // Scroll effects
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
                navbar.style.backdropFilter = 'blur(30px)';
            } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.9)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
        }
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.classList.contains('ai-stats')) {
                    animateStats();
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.service-card, .project-card, .skill-item, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Easter egg - Konami code
    let konamiCode = [];
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konami.length) konamiCode.shift();
        
        if (konamiCode.join(',') === konami.join(',')) {
            document.body.style.filter = 'hue-rotate(180deg) saturate(2)';
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) heroTitle.classList.add('glitch');
            
            const messages = document.getElementById('chatbotMessages');
            if (messages) {
                const specialMessage = document.createElement('div');
                specialMessage.className = 'message ai';
                specialMessage.innerHTML = '<strong>🎉 Easter Egg!</strong> Konami kód detekován! Gratuluji, našel jste skrytou AI funkci! 🚀';
                messages.appendChild(specialMessage);
                messages.scrollTop = messages.scrollHeight;
            }
            
            setTimeout(() => {
                document.body.style.filter = 'none';
                if (heroTitle) heroTitle.classList.remove('glitch');
            }, 5000);
        }
    });

    // Initialize visual effects
    createNeuralNetwork();
    createMatrixRain();
    
    // Fade in effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Animate stats after page load
    setTimeout(animateStats, 3000);
});

// Error handling
window.addEventListener('error', (e) => {
    console.log('AI Solutions - Error handled:', e.message);
});
