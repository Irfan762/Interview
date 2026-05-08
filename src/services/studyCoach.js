// Study Coach Service - Generates personalized study plans

const PROFILE = {
  name: "Irfan Tamboli",
  college: "JSPM RSCOE Pune, B.Tech IT (2023-2027)",
  gpa: 8.88,
  achievements: [
    "IIT KGP Hackathon National Winner",
    "EY Top 1.5% from 2,00,000+ candidates",
    "15 National Hackathon Finalist",
    "LeetCode 300+ (Rating 1356+)",
    "Best Achievement Award JSPM 2025"
  ],
  skills: ["MERN Stack", "C/C++", "SQL", "JWT Auth", "REST APIs", "DSA", "OOP", "DBMS", "OS", "Git"],
  projects: [
    "GoFarm (MERN + JWT + Render)",
    "Wanderlust (MVC + Passport.js + SQL + Cloudinary)"
  ],
  openSource: "Processing Foundation (p5.js), Learning Unlimited (ESP-Website) — 6+ merged PRs",
  role: "Training & Placement Coordinator at JSPM RSCOE"
};

export async function generateStudyPlan(day, topics) {
  // Simulate API call - In production, this would call an AI API
  await new Promise(resolve => setTimeout(resolve, 1500));

  const dsaTopics = topics.filter(t => t.tag === "DSA");
  const aptTopics = topics.filter(t => t.tag === "APT");
  const csTopics = topics.filter(t => t.tag === "CS");
  const hrTopics = topics.filter(t => t.tag === "HR");
  const engTopics = topics.filter(t => t.tag === "ENG");

  let html = `
    <div style="font-family: 'Inter', sans-serif; line-height: 1.8;">
      <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05)); padding: 20px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #FFD700;">
        <h3 style="margin: 0 0 8px 0; color: #FFD700;">🏆 Day ${day} - Your Mission</h3>
        <p style="margin: 0; color: #ccc; font-size: 14px;">
          ${topics.map(t => `<strong>${t.tag}</strong>: ${t.topic}`).join(" • ")}
        </p>
      </div>
  `;

  // DSA Section
  if (dsaTopics.length > 0) {
    html += generateDSASection(dsaTopics[0]);
  }

  // Aptitude Section
  if (aptTopics.length > 0) {
    html += generateAptitudeSection(aptTopics[0]);
  }

  // Core CS Section
  if (csTopics.length > 0) {
    html += generateCSSection(csTopics[0]);
  }

  // MERN Stack Section (Always included)
  html += generateMERNSection(day);

  // English Section (Always included)
  html += generateEnglishSection(day);

  // HR Section
  if (hrTopics.length > 0) {
    html += generateHRSection(hrTopics[0]);
  }

  // Revision Section
  html += generateRevisionSection(day);

  // End Summary
  html += generateEndSummary(day, topics);

  html += `</div>`;

  return html;
}

function generateDSASection(topic) {
  return `
    <div style="margin-bottom: 32px;">
      <h2 style="color: #1565C0; border-bottom: 2px solid #1565C0; padding-bottom: 8px; margin-bottom: 16px;">
        💻 DSA: ${topic.topic}
      </h2>
      <div style="background: rgba(21, 101, 192, 0.1); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <p style="margin: 0; color: #aaa;"><strong>💡 Tip:</strong> ${topic.tip}</p>
      </div>
      
      <h3 style="color: #FFD700; margin-top: 24px;">📝 Concept Explanation</h3>
      <p style="color: #ccc;">
        [Detailed explanation with examples will be generated here based on the specific topic]
      </p>

      <h3 style="color: #FFD700; margin-top: 24px;">🎯 3 Practice Problems</h3>
      <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
        <h4 style="color: #4CAF50; margin: 0 0 8px 0;">Problem 1: Easy</h4>
        <p style="color: #ccc; margin: 0;">[Problem description and solution approach]</p>
      </div>
      <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
        <h4 style="color: #FFA500; margin: 0 0 8px 0;">Problem 2: Medium</h4>
        <p style="color: #ccc; margin: 0;">[Problem description and solution approach]</p>
      </div>
      <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px;">
        <h4 style="color: #E65100; margin: 0 0 8px 0;">Problem 3: Hard</h4>
        <p style="color: #ccc; margin: 0;">[Problem description and solution approach]</p>
      </div>
    </div>
  `;
}

function generateAptitudeSection(topic) {
  return `
    <div style="margin-bottom: 32px;">
      <h2 style="color: #1976D2; border-bottom: 2px solid #1976D2; padding-bottom: 8px; margin-bottom: 16px;">
        🧮 Aptitude: ${topic.topic}
      </h2>
      <div style="background: rgba(25, 118, 210, 0.1); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <p style="margin: 0; color: #aaa;"><strong>💡 Tip:</strong> ${topic.tip}</p>
        <p style="margin: 8px 0 0 0; color: #FFD700;"><strong>⏱️ Target:</strong> Under 60 seconds per question</p>
      </div>
      
      <h3 style="color: #FFD700; margin-top: 24px;">📊 10 Practice Questions</h3>
      ${Array.from({length: 10}, (_, i) => `
        <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
          <h4 style="color: #1976D2; margin: 0 0 8px 0;">Q${i+1}. [Question]</h4>
          <p style="color: #4CAF50; margin: 0;"><strong>Solution:</strong> [Answer with shortcut method]</p>
        </div>
      `).join('')}
    </div>
  `;
}

function generateCSSection(topic) {
  return `
    <div style="margin-bottom: 32px;">
      <h2 style="color: #2E7D32; border-bottom: 2px solid #2E7D32; padding-bottom: 8px; margin-bottom: 16px;">
        🖥️ Core CS: ${topic.topic}
      </h2>
      <div style="background: rgba(46, 125, 50, 0.1); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <p style="margin: 0; color: #aaa;"><strong>💡 Tip:</strong> ${topic.tip}</p>
      </div>
      
      <h3 style="color: #FFD700; margin-top: 24px;">📚 Concept with GoFarm/Wanderlust Example</h3>
      <p style="color: #ccc;">[Explanation connecting to your projects]</p>

      <h3 style="color: #FFD700; margin-top: 24px;">❓ 5 Must-Know Interview Q&As</h3>
      ${Array.from({length: 5}, (_, i) => `
        <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
          <h4 style="color: #2E7D32; margin: 0 0 8px 0;">Q${i+1}. [Question]</h4>
          <p style="color: #ccc; margin: 0;"><strong>A:</strong> [Answer]</p>
        </div>
      `).join('')}

      <h3 style="color: #FFD700; margin-top: 24px;">📋 Cheatsheet</h3>
      <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px;">
        <pre style="color: #ccc; margin: 0; white-space: pre-wrap;">[Concept map in text format]</pre>
      </div>
    </div>
  `;
}

function generateMERNSection(day) {
  return `
    <div style="margin-bottom: 32px;">
      <h2 style="color: #61DAFB; border-bottom: 2px solid #61DAFB; padding-bottom: 8px; margin-bottom: 16px;">
        ⚛️ MERN Stack Deep-Dive
      </h2>
      <p style="color: #ccc;">
        Today's focus: [React/MongoDB/Express/Node concept] with examples from GoFarm and Wanderlust
      </p>
      <div style="background: rgba(97, 218, 251, 0.1); padding: 16px; border-radius: 8px;">
        <h4 style="color: #61DAFB; margin: 0 0 8px 0;">Code Example from Your Projects</h4>
        <pre style="background: #1a1a2e; padding: 12px; border-radius: 6px; overflow-x: auto; color: #ccc;"><code>[Code snippet]</code></pre>
      </div>
    </div>
  `;
}

function generateEnglishSection(day) {
  return `
    <div style="margin-bottom: 32px;">
      <h2 style="color: #E65100; border-bottom: 2px solid #E65100; padding-bottom: 8px; margin-bottom: 16px;">
        📖 English Practice (Daily)
      </h2>
      
      <h3 style="color: #FFD700; margin-top: 24px;">📚 5 New Vocabulary Words</h3>
      ${Array.from({length: 5}, (_, i) => `
        <div style="background: rgba(230, 81, 0, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 8px;">
          <p style="margin: 0; color: #E65100;"><strong>Word ${i+1}:</strong> [Word] - [Meaning]</p>
          <p style="margin: 4px 0 0 0; color: #ccc; font-style: italic;">"[Example sentence]"</p>
        </div>
      `).join('')}

      <h3 style="color: #FFD700; margin-top: 24px;">✍️ Grammar Exercise</h3>
      <p style="color: #ccc;">[10 fill-in-the-blanks with answers]</p>

      <h3 style="color: #FFD700; margin-top: 24px;">📰 Reading Passage</h3>
      <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
        <p style="color: #ccc; line-height: 1.8;">[150-word passage]</p>
      </div>
      <p style="color: #aaa;"><strong>Comprehension Questions:</strong></p>
      <ol style="color: #ccc;">
        <li>[Question 1]</li>
        <li>[Question 2]</li>
        <li>[Question 3]</li>
      </ol>

      <h3 style="color: #FFD700; margin-top: 24px;">🎤 60-Second Speaking Script</h3>
      <div style="background: rgba(230, 81, 0, 0.1); padding: 16px; border-radius: 8px;">
        <p style="color: #ccc; line-height: 1.8;">[Script to read aloud]</p>
      </div>

      <h3 style="color: #FFD700; margin-top: 24px;">✉️ Email Writing Task</h3>
      <p style="color: #ccc;">[Placement/internship related email task]</p>
    </div>
  `;
}

function generateHRSection(topic) {
  return `
    <div style="margin-bottom: 32px;">
      <h2 style="color: #6A1B9A; border-bottom: 2px solid #6A1B9A; padding-bottom: 8px; margin-bottom: 16px;">
        🤝 HR/Behavioral: ${topic.topic}
      </h2>
      
      <h3 style="color: #FFD700; margin-top: 24px;">⭐ STAR Format Answer</h3>
      <div style="background: rgba(106, 27, 154, 0.1); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <p style="color: #ccc;"><strong>Situation:</strong> [Context from IIT KGP/EY/GoFarm]</p>
        <p style="color: #ccc;"><strong>Task:</strong> [Your responsibility]</p>
        <p style="color: #ccc;"><strong>Action:</strong> [What you did]</p>
        <p style="color: #ccc;"><strong>Result:</strong> [Outcome and impact]</p>
      </div>

      <h3 style="color: #FFD700; margin-top: 24px;">❓ 3 Follow-up Questions</h3>
      <ol style="color: #ccc;">
        <li>[Follow-up question 1]</li>
        <li>[Follow-up question 2]</li>
        <li>[Follow-up question 3]</li>
      </ol>
    </div>
  `;
}

function generateRevisionSection(day) {
  const day3 = day - 3;
  const day6 = day - 6;

  let html = `
    <div style="margin-bottom: 32px;">
      <h2 style="color: #455A64; border-bottom: 2px solid #455A64; padding-bottom: 8px; margin-bottom: 16px;">
        🔁 Revision (1-4-7 Rule)
      </h2>
  `;

  if (day3 > 0) {
    html += `
      <h3 style="color: #FFD700; margin-top: 24px;">📝 Day ${day3} Recall (5 Quick Questions)</h3>
      <ol style="color: #ccc;">
        <li>[Recall question 1]</li>
        <li>[Recall question 2]</li>
        <li>[Recall question 3]</li>
        <li>[Recall question 4]</li>
        <li>[Recall question 5]</li>
      </ol>
    `;
  }

  if (day6 > 0) {
    html += `
      <h3 style="color: #FFD700; margin-top: 24px;">✅ Day ${day6} Mastery (5 Deep Questions)</h3>
      <ol style="color: #ccc;">
        <li>[Mastery question 1]</li>
        <li>[Mastery question 2]</li>
        <li>[Mastery question 3]</li>
        <li>[Mastery question 4]</li>
        <li>[Mastery question 5]</li>
      </ol>
    `;
  }

  html += `</div>`;
  return html;
}

function generateEndSummary(day, topics) {
  return `
    <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05)); padding: 24px; border-radius: 12px; border-left: 4px solid #FFD700;">
      <h2 style="color: #FFD700; margin: 0 0 16px 0;">🎯 Day ${day} Summary</h2>
      <p style="color: #ccc; line-height: 1.8; margin-bottom: 12px;">
        <strong>Today you covered:</strong><br/>
        ${topics.map(t => `• ${t.tag}: ${t.topic}`).join('<br/>')}
      </p>
      <p style="color: #4CAF50; margin: 12px 0;"><strong>Expected Productivity:</strong> 9/10 if you complete all tasks</p>
      <p style="color: #FFD700; font-weight: bold; font-size: 16px; margin: 16px 0 0 0;">
        🏆 "You didn't win at IIT KGP by luck—you won because you showed up every day. Day ${day} is just another step toward your dream SDE role. Let's dominate this!"
      </p>
    </div>
  `;
}
