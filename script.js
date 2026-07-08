// --- AUDIO SYNTHESIZER MODULE ---
let audioCtx = null;
let soundMuted = false;

function playSound(type) {
  if (soundMuted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'keypress') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.008, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } else if (type === 'enter') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.setValueAtTime(100, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    console.warn("Audio Context init blocked or not supported:", e);
  }
}

// --- BOOT SEQUENCE LOGS & SIMULATION ---
const bootLogsList = [
  { text: "CORE LOADED: Antigravity v4.0.2 kernel online.", type: "success", delay: 100 },
  { text: "ESTABLISHING LOCALHOST SOCKET CONNECTION...", type: "warning", delay: 200 },
  { text: "SECURITY KEY DECRYPTED [0x8f0a21bc9e]...", type: "success", delay: 150 },
  { text: "ALLOCATING GRAPHIC BUFFERS FOR CANVAS HUD...", type: "warning", delay: 250 },
  { text: "RETRIEVING FIGMA DESIGN STRINGS AND LAYOUTS...", type: "success", delay: 100 },
  { text: "INITIALIZING FULL-STACK ASP.NET LOGIC STREAMS...", type: "success", delay: 200 },
  { text: "CHECKING SYSTEM INTEGRITY...", type: "warning", delay: 150 },
  { text: "DECRYPTING SOURCE ARCHIVES (E-COMMERCE, NEXUS, SENTINEL)...", type: "success", delay: 300 },
  { text: "WARN: Unauthenticated request detected from external recruiter.", type: "error", delay: 200 },
  { text: "OVERRIDING SECURITY PROTOCOLS...", type: "warning", delay: 150 },
  { text: "ACCESS GRANTED: WELCOME RECRUITER TO DHAYA NITHI'S MAINFRAME.", type: "success", delay: 350 }
];

document.addEventListener("DOMContentLoaded", () => {
  const bootScreen = document.getElementById("boot-screen");
  const bootLogs = document.getElementById("boot-logs");
  const bootPercentText = document.getElementById("boot-percent");
  const bootProgressFill = document.getElementById("boot-progress-fill");
  const bootStatusMsg = document.getElementById("boot-status-msg");

  let logIndex = 0;
  let progress = 0;

  function printNextLog() {
    if (logIndex < bootLogsList.length) {
      const log = bootLogsList[logIndex];
      const logLine = document.createElement("div");
      logLine.className = `boot-log-line ${log.type}`;

      let prefix = "[ OK ]";
      if (log.type === "warning") prefix = "[ INFO ]";
      if (log.type === "error") prefix = "[ WARN ]";

      logLine.innerHTML = `<span class="font-mono" style="opacity: 0.65;">${prefix}</span> <span>${log.text}</span>`;
      bootLogs.appendChild(logLine);
      bootLogs.scrollTop = bootLogs.scrollHeight;

      playSound('click');

      // Update progress proportionally
      logIndex++;
      progress = Math.min(Math.floor((logIndex / bootLogsList.length) * 100), 100);
      bootPercentText.innerText = `${progress}%`;
      bootProgressFill.style.width = `${progress}%`;

      setTimeout(printNextLog, log.delay);
    } else {
      // Completed loading
      bootStatusMsg.innerText = "BOOT PROTOCOLS STABLE. LOADING PORTFOLIO...";
      playSound('success');

      setTimeout(() => {
        bootScreen.style.transition = "transform 0.8s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.8s ease";
        bootScreen.style.transform = "translateY(-100%)";
        bootScreen.style.opacity = "0";
        setTimeout(() => {
          bootScreen.style.display = "none";
          // Trigger animations in view
          handleScrollReveal();
        }, 800);
      }, 500);
    }
  }

  // Start Boot Sequence
  setTimeout(printNextLog, 300);

  // --- AUDIO TOGGLE ---
  const audioToggle = document.getElementById("audio-toggle");
  const audioBtnLabel = document.getElementById("audio-btn-label");

  audioToggle.addEventListener("click", () => {
    soundMuted = !soundMuted;
    if (soundMuted) {
      audioToggle.classList.add("muted");
      audioBtnLabel.innerText = "SOUND: OFF";
    } else {
      audioToggle.classList.remove("muted");
      audioBtnLabel.innerText = "SOUND: ON";
      playSound('success');
    }
  });

  // Sound cues on hovering clickable elements
  const addHoverSounds = (elements) => {
    elements.forEach(el => {
      el.addEventListener("mouseenter", () => {
        playSound('click');
      });
    });
  };

  addHoverSounds(document.querySelectorAll("a, button, input, textarea, .quick-cmd-btn, .heatmap-cell, .logo"));

  // --- CUSTOM CURSOR ---
  const cursor = document.getElementById("custom-cursor");

  if (cursor) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    document.addEventListener("mousedown", () => {
      cursor.classList.add("click");
    });

    document.addEventListener("mouseup", () => {
      cursor.classList.remove("click");
    });

    // Hover state over links
    const interactiveElements = document.querySelectorAll("a, button, .quick-cmd-btn, input, textarea, .heatmap-cell");
    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
  }

  // --- MOBILE NAV BAR TOGGLE ---
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
    playSound('enter');
  });

  // Close nav menu on link clicks
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  // --- HERO SUBTITLE TYPING ANIMATION ---
  const typeWords = ["UI/UX Designer", "Front-End Developer", "Full-Stack Developer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedTextEl = document.getElementById("typed-text");

  function typeEffect() {
    if (!typedTextEl) return;
    const currentWord = typeWords[wordIndex];

    if (isDeleting) {
      typedTextEl.innerText = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextEl.innerText = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 1500; // Delay before starting delete
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typeWords.length;
      typeSpeed = 400; // Small delay before typing next word
    }

    setTimeout(typeEffect, typeSpeed);
  }

  // Start typing
  setTimeout(typeEffect, 2000);

  // --- MATRIX RAIN CANVAS BACKGROUND ---
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d");
  let matrixInterval = null;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%+=-<>*/";
  const fontSize = 13;
  const columns = canvas.width / fontSize;
  const rainDrops = [];

  for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(4, 4, 7, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 255, 102, 0.65)"; // matrix green
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < rainDrops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  }

  matrixInterval = setInterval(drawMatrix, 30);

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const newColumns = canvas.width / fontSize;
    while (rainDrops.length < newColumns) {
      rainDrops.push(1);
    }
  });

  // --- HERO WIDGET COMMAND TERMINAL ---
  const terminalInput = document.getElementById("terminal-input");
  const terminalOutput = document.getElementById("terminal-output");
  const terminalBody = document.getElementById("terminal-body");

  // Load history commands
  let commandHistory = [];
  let historyIndex = -1;

  if (terminalInput) {
    terminalInput.addEventListener("keydown", (e) => {
      playSound('keypress');
      if (e.key === "Enter") {
        const cmd = terminalInput.value.trim().toLowerCase();
        if (cmd) {
          executeCommand(cmd);
          commandHistory.push(cmd);
          historyIndex = commandHistory.length;
        }
        terminalInput.value = "";
      } else if (e.key === "ArrowUp") {
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = "";
        }
        e.preventDefault();
      }
    });
  }

  // Quick Command buttons handler
  document.querySelectorAll(".quick-cmd-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      executeCommand(cmd);
    });
  });

  function executeCommand(cmd) {
    playSound('enter');

    // Add command echo to terminal log
    const cmdEcho = document.createElement("div");
    cmdEcho.innerHTML = `<span class="terminal-prompt-sym">dhayanithi$</span> <span class="text-cyan">${cmd}</span>`;
    terminalOutput.appendChild(cmdEcho);

    const responseLine = document.createElement("div");
    responseLine.className = "margin-bottom-sm";

    switch (cmd) {
      case "help":
        responseLine.innerHTML = `
          <div>Available commands:</div>
          <div>  <span class="text-cyan">about</span>     - Displays summary of professional identity.</div>
          <div>  <span class="text-cyan">skills</span>    - Output developer technical capabilities stack.</div>
          <div>  <span class="text-cyan">projects</span>  - Review compiled repositories &amp; prototypes.</div>
          <div>  <span class="text-cyan">certs</span>     - Display verified training credentials.</div>
          <div>  <span class="text-cyan">socials</span>   - Output secure communication links.</div>
          <div>  <span class="text-cyan">contact</span>   - Output secure link communication credentials.</div>
          <div>  <span class="text-cyan">matrix</span>    - Toggle visual matrix rain background overlay.</div>
          <div>  <span class="text-cyan">hack</span>      - Initialize system decryption sequences.</div>
          <div>  <span class="text-cyan">clear</span>     - Purge terminal display stack.</div>
          <div>  <span class="text-cyan">sudo</span>      - Execute action with system root privileges.</div>
        `;
        break;

      case "about":
        responseLine.innerHTML = `
          <div>IDENTITY: Dhaya Nithi</div>
          <div>ROLE: Computer Science Student / UI/UX &amp; Full-Stack Coder</div>
          <div>STATUS: Deep passion for turning wireframe designs into stable functional software.</div>
          <div>LOCATION: Tamil Nadu, India.</div>
        `;
        break;

      case "skills":
        responseLine.innerHTML = `
          <div>DESIGN: Figma, Prototyping, Wireframing, UX Design</div>
          <div>FRONT-END: HTML5, CSS3, ES6 JavaScript, Responsive Grid Layouts</div>
          <div>LANGUAGES: C, C++, Python, C#</div>
          <div>FULL-STACK: ASP.NET Core, Relational SQL Databases, Git/GitHub</div>
        `;
        break;

      case "projects":
        responseLine.innerHTML = `
          <div>1. Cyber E-Commerce Engine [ACTIVE] // ASP.NET, SQL, CSS3</div>
          <div>2. Nexus Learning App UI [PROTOTYPE] // Figma Vector Design</div>
          <div>3. Portfolio Website [STABLE] // Semantic HTML5, CSS3, JS</div>
          <div>4. Sentinel Auth System [STABLE] // JWT Cryptographic Framework</div>
          <div>5. Holographic Security Dashboard [STABLE] // HTML5, CSS3, SVG Charts</div>
          <div>6. SaaS Quantum Landing Page [STABLE] // HTML5, CSS3, JS Animations</div>
        `;
        break;

      case "certs":
      case "certificates":
        responseLine.innerHTML = `
          <div>1. Google Professional UI/UX Design Certificate [VERIFIED]</div>
          <div>2. Microsoft Full Stack Developer Certificate [VERIFIED]</div>
        `;
        break;

      case "socials":
        responseLine.innerHTML = `
          <div>LINKEDIN: linkedin.com (Connected)</div>
          <div>GITHUB: github.com/DhayaNithi-Dev (Online)</div>
          <div>TWITTER: twitter.com/DhayaNithi (Stealth)</div>
        `;
        break;

      case "contact":
        responseLine.innerHTML = `
          <div>EMAIL: dhayanithisabarinathan9@gmail.com</div>
          <div>VOICE: +91 78100 18048</div>
          <div>GITHUB: github.com/DhayaNithi-Dev</div>
          <div>LINKEDIN: linkedin.com</div>
        `;
        break;

      case "matrix":
        if (canvas.classList.contains("active")) {
          canvas.classList.remove("active");
          responseLine.innerHTML = "<div>Matrix rain canvas opacity reduced to stealth mode.</div>";
        } else {
          canvas.classList.add("active");
          responseLine.innerHTML = "<div class='text-green'>Matrix rain canvas active. Intensity: MAX.</div>";
        }
        break;

      case "hack":
        playSound('success');
        let hackLines = [
          "CONNECTING TO REMOTE PORT 8080...",
          "BYPASSING SENTINEL AUTH PROTOCOLS [BYPASS = TRUE]...",
          "DECRYPTING FIGMA VECTOR STRINGS...",
          "DOWNLOADING PORTFOLIO DB BACKUPS...",
          "INJECTING CYBERPUNK THEME INTENSITY...",
          "DECRYPTION LEVEL 100% // MAIN DECRYPTOR STABLE // RECRUITER WELCOMED!"
        ];
        let i = 0;
        responseLine.innerHTML = "";
        function printHack() {
          if (i < hackLines.length) {
            const line = document.createElement("div");
            line.className = i === hackLines.length - 1 ? "text-green" : "text-cyan";
            line.innerText = `> ${hackLines[i]}`;
            responseLine.appendChild(line);
            playSound('keypress');
            terminalBody.scrollTop = terminalBody.scrollHeight;
            i++;
            setTimeout(printHack, 250);
          }
        }
        printHack();
        break;

      case "clear":
        terminalOutput.innerHTML = "";
        responseLine.innerHTML = "<div>Terminal buffer purged. Ready.</div>";
        break;

      case "sudo":
        playSound('error');
        responseLine.innerHTML = "<div class='text-red'>[ ACCESS DENIED ] SYSTEM OVERLORD PRIVILEGES REQUIRED. ENTER RECRUITER VERIFICATION CODE...</div>";
        break;

      default:
        playSound('error');
        responseLine.innerHTML = `<div class='text-red'>Command not found: '${cmd}'. Type 'help' for support diagnostics.</div>`;
        break;
    }

    terminalOutput.appendChild(responseLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // --- SIMULATED GITHUB HEATMAP CREATOR ---
  const heatmap = document.getElementById("github-heatmap");
  if (heatmap) {
    // Generate dates for the past 371 days (53 weeks * 7 days)
    const totalDays = 53 * 7;
    const cellsArray = [];

    // We populate week columns
    for (let w = 0; w < 53; w++) {
      const col = document.createElement("div");
      col.className = "heatmap-col";

      for (let d = 0; d < 7; d++) {
        const cell = document.createElement("div");

        // Random level weights
        const rand = Math.random();
        let level = 0;
        let commits = 0;

        if (rand > 0.95) { level = 4; commits = Math.floor(Math.random() * 5) + 12; }
        else if (rand > 0.87) { level = 3; commits = Math.floor(Math.random() * 4) + 8; }
        else if (rand > 0.75) { level = 2; commits = Math.floor(Math.random() * 4) + 4; }
        else if (rand > 0.60) { level = 1; commits = Math.floor(Math.random() * 3) + 1; }

        cell.className = `heatmap-cell level-${level}`;

        // Custom Tooltip info
        const dateOffset = (53 - w) * 7 + (7 - d);
        const cellDate = new Date();
        cellDate.setDate(cellDate.getDate() - dateOffset);
        const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const commitText = commits === 0 ? "No contributions" : `${commits} contributions`;
        cell.title = `${commitText} on ${dateStr}`;

        col.appendChild(cell);
      }
      heatmap.appendChild(col);
    }
  }

  // --- SKILLS METERS OBSERVER ---
  const skillsSection = document.getElementById("skills");
  const skillPercentEls = document.querySelectorAll(".skill-percent");
  const skillFills = document.querySelectorAll(".skill-meter-fill");

  const runSkillsAnimation = () => {
    skillPercentEls.forEach((el, index) => {
      const targetVal = parseInt(el.getAttribute("data-val"));
      const fillEl = skillFills[index];

      // Animate progress fill width
      fillEl.style.width = `${targetVal}%`;

      // Animate percent counting number
      let currentVal = 0;
      const countInterval = setInterval(() => {
        if (currentVal >= targetVal) {
          clearInterval(countInterval);
        } else {
          currentVal++;
          el.innerText = `${currentVal}%`;
        }
      }, 15);
    });
  };

  // --- ACHIEVEMENT COUNTERS OBSERVER ---
  const achievementCounts = document.querySelectorAll(".achievement-count");

  const runAchievementsCounter = () => {
    achievementCounts.forEach(el => {
      const targetVal = parseInt(el.getAttribute("data-target"));
      let currentVal = 0;
      const duration = 1200; // ms
      const stepTime = Math.max(Math.floor(duration / targetVal), 1);

      const countUp = setInterval(() => {
        if (currentVal >= targetVal) {
          clearInterval(countUp);
          el.innerText = targetVal;
        } else {
          currentVal += Math.ceil(targetVal / 50); // Increment steps
          if (currentVal >= targetVal) currentVal = targetVal;
          el.innerText = currentVal;
        }
      }, stepTime);
    });
  };

  // --- INTERSECTION OBSERVERS FOR WIDGETS ---
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runSkillsAnimation();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  const certSection = document.getElementById("certificates");
  const achievementsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runAchievementsCounter();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  if (certSection) {
    achievementsObserver.observe(certSection);
  }

  // --- CYBER CONTACT FORM DISPATCH ---
  const contactForm = document.getElementById("cyber-contact-form");
  const formStatusMsg = document.getElementById("form-status-msg");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      playSound('click');

      formStatusMsg.className = "form-status-msg warning";
      formStatusMsg.innerText = "ENCRYPTING PAYLOAD & DISPATCHING PACKETS...";

      setTimeout(() => {
        playSound('success');
        formStatusMsg.className = "form-status-msg success";
        formStatusMsg.innerHTML = `<i class="fa-solid fa-square-check"></i> TRANSMISSION DELIVERED. CORE LOGGED AS SECURE.`;
        contactForm.reset();
      }, 1500);
    });
  }

  // --- SCROLL REVEAL DIAGNOSTICS ---
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  function handleScrollReveal() {
    const triggerBottom = window.innerHeight * 0.88;

    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;

      if (elTop < triggerBottom) {
        el.classList.add("revealed");
      }
    });
  }

  window.addEventListener("scroll", handleScrollReveal);

  // HUD Nav header scrolled styling
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Track active navigation links based on scroll section
  const sections = document.querySelectorAll("section");
  const navLi = document.querySelectorAll(".nav-links li");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute("id");
      }
    });

    navLi.forEach(li => {
      li.classList.remove("active");
      const a = li.querySelector("a");
      if (a && a.getAttribute("href") === `#${current}`) {
        li.classList.add("active");
      }
    });
  });

});
