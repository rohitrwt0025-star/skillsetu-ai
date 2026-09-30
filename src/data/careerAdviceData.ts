export interface PresetPrompt {
  id: string;
  category: string;
  label: string;
  prompt: string;
  response: string;
}

export const CAREER_PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'career-leet-vs-job',
    category: 'Career Decisions',
    label: 'Lateral Entry (B.Tech) vs PSU/Job',
    prompt: 'Should I take lateral entry into B.Tech (2nd year) or join a job/NATS apprenticeship after my diploma?',
    response: `This is the most common dilemma faced by diploma engineers. Here is a clear, objective decision framework:

1. **When to Choose Lateral Entry B.Tech (LEET / Direct 2nd Year)**:
   • If you want to aim for high-tier R&D, product engineering, or software developer roles that mandate a 4-year degree.
   • If your family finances allow 3 more years of study without heavy debt burden, or if you secure admission into a reputed government engineering college (where fees are low and placement cells are active).
   • If you wish to appear for GATE in the future for PSU Executive Engineer positions (Navratna/Maharatna) or M.Tech.

2. **When to Choose Job / NATS Apprenticeship First**:
   • If your family requires immediate financial support.
   • If you join a top-tier core firm as a Diploma Engineer Trainee (e.g., Tata Motors, L&T, BEL, Maruti, Siemens). The practical shop-floor learning in these 2 years is immensely respected.
   • After 1–2 years of job experience, you can also pursue evening B.Tech / Work Integrated Learning Programs (WILP like BITS Pilani or State Technical University part-time degree) while earning your salary.

**Summary**: If you get a top government engineering college via LEET, prioritize B.Tech. If you secure a core DET role in a premier PSU or OEM, work for 1–2 years to build industrial acumen.`
  },
  {
    id: 'career-nats-explanation',
    category: 'Apprenticeships',
    label: 'What is NATS & does it guarantee a job?',
    prompt: 'What is the NATS Apprenticeship scheme for diploma holders, and does it lead to a permanent job?',
    response: `Here is the factual reality about the National Apprenticeship Training Scheme (NATS):

1. **What is NATS?**
   • Governed by the Ministry of Education, Government of India.
   • It offers 1 year of structured on-the-job training in government PSUs (BHEL, HAL, ISRO, BEL, DRDO, Railway Workshops) and registered private companies.
   • Stipend: Central government subsidizes the stipend (typically ₹8,000 to ₹14,000/month depending on industry & state).

2. **Does it guarantee a permanent job?**
   • **Legally No**: The Apprentices Act explicitly states that companies have no legal obligation to absorb apprentices into permanent employment upon completion.
   • **However, Huge Advantages**:
     - You receive a Government of India "National Apprenticeship Certificate" (NAC/COP) which is a **mandatory eligibility requirement** for many permanent technician and junior engineer exams (e.g., ISRO Technician-B, Railway RRB Alp, DRDO CEPTAM, Ordnance Factories).
     - Several companies (like BEL, L&T, Godrej) give preferential weightage or reserved quota to their own completed apprentices during permanent technician recruitment drives.
     - You gain 1 full year of verified industrial experience on your resume rather than an education gap.

**Key Rule**: You can only undergo NATS apprenticeship ONCE in your lifetime within 3 years of passing your diploma.`
  },
  {
    id: 'career-det-interview',
    category: 'Preparation',
    label: 'How to prepare for DET written test & interview?',
    prompt: 'How should a diploma student prepare for Diploma Engineer Trainee (DET) campus placements and written tests?',
    response: `Most DET recruitment drives (Tata Motors, Schneider Electric, Cummins, Ashok Leyland, Jindal) follow a standard 3-stage funnel:

1. **Stage 1: Online Aptitude & Technical Test (60–90 min)**
   • **Quantitative & Reasoning (30%)**: Number systems, percentages, ratios, time & work, series completion, spatial reasoning.
   • **Basic English (10%)**: Grammar, sentence correction, reading comprehension.
   • **Core Technical (60%)**: 
     - Focus on 2nd and 3rd-year diploma core subjects (e.g., for ECE: Basic Electronics, Digital logic, Microcontroller 8051; for Mech: SOM, Thermodynamics, Workshop tech; for Electrical: Transformers, AC circuits).
     - Review past questions from R.S. Khurmi, J.B. Gupta, or Diploma CET/State JE objective question banks.

2. **Stage 2: Technical Interview (20–30 min)**
   • **Your Final Year Project**: You must know every wire, component, formula, and code line. Be ready to draw the block diagram on a blank sheet.
   • **Summer Internship / Industrial Training**: Explain what you saw, what machines you operated, and what safety rules were practiced.
   • **Bench Skills**: Explain how to use a multimeter, DSO, Vernier caliper, or soldering iron properly.

3. **Stage 3: HR / Fitment Round**
   • Express high enthusiasm for plant and shop-floor operations.
   • Confirm readiness for shift rotations and plant locations.`
  },
  {
    id: 'career-ece-certifications',
    category: 'Skill Building',
    label: 'Top skills & certifications for Diploma in ECE',
    prompt: 'What are the top practical skills and certifications that increase employability for a Diploma in ECE graduate?',
    response: `To stand out against thousands of fresh diploma applicants, focus on these tangible, verifiable skills:

1. **Embedded Firmware & Hardware Prototyping**:
   • Master **Embedded C** and Python basics.
   • Build hands-on projects with **ESP32 and STM32 ARM Cortex** microcontrollers (far more impressive than basic Arduino UNO).
   • Learn sensor protocols: UART, I2C, SPI.

2. **PCB Design & Layout**:
   • Learn free open-source **KiCad** or Autodesk Eagle.
   • Know schematic capture, board routing, ground planes, trace widths, and generating Gerber files for fabrication.

3. **Test & Measurement Equipment Mastery**:
   • Become proficient in using Digital Storage Oscilloscopes (DSOs), logic analyzers, and function generators.
   • Practice SMD component soldering and rework (0805 and 0603 packages) using hot-air stations.

4. **Recommended Recognized Certifications**:
   • **SWAYAM / NPTEL**: "Introduction to Embedded System Design" or "Basic Electrical Circuits" (IIT certified, low cost).
   • **MSME Technology Centre** short-term courses: Industrial Automation (PLC & SCADA), Embedded Systems, or PCB fabrication.
   • **Cisco CCNA / Network Basics**: If interested in telecommunications, ISP operations, or BSNL/Jio fiber NOCs.`
  }
];
