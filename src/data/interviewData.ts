import { InterviewQuestion } from '../types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // Electronics & Communication
  {
    id: 'int-ece-1',
    subject: 'Basic Electronics & Semiconductor Devices',
    branch: 'Electronics & Communication',
    difficulty: 'Core Concept',
    question: 'What is the fundamental difference between BJT (Bipolar Junction Transistor) and MOSFET, and why are MOSFETs preferred in digital VLSI circuits?',
    interviewerIntent: 'Testing your fundamental semiconductor device physics, current control mechanisms, and why low power dissipation matters in modern digital systems.',
    modelAnswer: 'A BJT is a current-controlled device where output collector current is controlled by base current (Ic = β * Ib), and conduction involves both majority and minority charge carriers (electrons and holes). In contrast, a MOSFET is a voltage-controlled device where drain current is modulated by gate-to-source voltage (Vgs), and it is a unipolar device conducting with only one type of carrier. MOSFETs are preferred in digital VLSI because their insulated gate (SiO2 layer) draws virtually zero static DC gate current, resulting in extremely low static power dissipation, smaller silicon footprint, and easier fabrication of complementary pairs (CMOS).',
    keyKeywords: ['Current-controlled vs Voltage-controlled', 'Bipolar vs Unipolar', 'Static power dissipation', 'Gate impedance', 'CMOS logic'],
    tipsForDiploma: 'Draw the standard symbol of NPN and N-channel MOSFET on paper if asked. Highlight the input resistance (BJTs have low input impedance, MOSFETs have very high input impedance).'
  },
  {
    id: 'int-ece-2',
    subject: 'Microcontrollers & Embedded Systems',
    branch: 'Electronics & Communication',
    difficulty: 'Beginner',
    question: 'Explain the difference between a Microprocessor and a Microcontroller with examples (e.g., 8085 vs 8051 or Arduino / ATmega328).',
    interviewerIntent: 'Checking if the diploma graduate understands system-on-chip integration vs external bus architectures.',
    modelAnswer: 'A microprocessor (like Intel 8085 or Core i5) consists only of the Central Processing Unit (ALU and registers) on a single chip; RAM, ROM, timers, and I/O ports must be connected externally via address and data buses. A microcontroller (like Intel 8051, ATmega328, PIC, or STM32) integrates the CPU, on-chip RAM, flash ROM, timer/counters, ADC, and general-purpose I/O (GPIO) pins onto a single silicon chip. Microcontrollers are designed for dedicated embedded control tasks with low cost and low power consumption, whereas microprocessors are designed for high-performance general-purpose computing.',
    keyKeywords: ['On-chip peripherals', 'GPIO', 'Dedicated embedded system', 'Single-chip solution', '8051 / ATmega'],
    tipsForDiploma: 'Mention your diploma final year project microcontroller. If you used Arduino, explain what microcontroller chip is on board (ATmega328P).'
  },
  {
    id: 'int-ece-3',
    subject: 'Analog Communication & Modulation',
    branch: 'Electronics & Communication',
    difficulty: 'Core Concept',
    question: 'Why do we need modulation to transmit audio or baseband signals over long distances through air?',
    interviewerIntent: 'Assessing your grasp of antenna height requirements, electromagnetic radiation, and frequency multiplexing.',
    modelAnswer: 'We need modulation for three critical physical reasons: 1) Antenna height requirement: An efficient antenna length must be at least λ/4 (quarter wavelength). For an audio signal of 3 kHz, wavelength λ = c/f = 3x10^8 / 3000 = 100,000 meters, requiring an impractical 25 km antenna. By modulating onto a high-frequency carrier (e.g., 100 MHz), antenna length drops to a few centimeters. 2) Prevention of signal mixing: Multiple baseband signals in the same 20 Hz–20 kHz range would jam each other without frequency division multiplexing. 3) Radiation power efficiency: High-frequency signals radiate electromagnetic power much more efficiently into free space without rapid attenuation.',
    keyKeywords: ['Antenna height (λ/4)', 'Wavelength formula c=fλ', 'Frequency division multiplexing', 'Signal interference', 'Carrier frequency'],
    tipsForDiploma: 'Always state the formula λ = c / f first, and do a quick mental calculation for the interviewer. It demonstrates solid technical grounding.'
  },
  {
    id: 'int-ece-4',
    subject: 'Instrumentation & Lab Measurements',
    branch: 'Electronics & Communication',
    difficulty: 'Intermediate',
    question: 'How do you measure the peak-to-peak voltage, frequency, and phase difference of a sinusoidal signal using a Digital Storage Oscilloscope (DSO)?',
    interviewerIntent: 'Practical bench skill check—interviewers in BEL, DRDO, and private electronics firms love to test whether you actually worked with lab instruments.',
    modelAnswer: 'To measure peak-to-peak voltage (Vp-p), count vertical divisions from the lowest trough to the highest peak and multiply by the Volts/Div scale setting (or use DSO automatic measurement "Vpp"). To measure frequency, count horizontal divisions for one complete wave cycle, multiply by Time/Div setting to obtain the period T, then calculate f = 1/T (or read the built-in hardware counter). To measure phase difference between two signals, connect Channel 1 and Channel 2, set triggering on Channel 1, and measure time delay Δt between corresponding zero-crossings: Phase angle θ = (Δt / T) * 360°, or switch to X-Y mode to observe the Lissajous pattern ellipse.',
    keyKeywords: ['Volts/Div', 'Time/Div', 'Period T = 1/f', 'Dual-channel triggering', 'Lissajous figures'],
    tipsForDiploma: 'Mention proper 10X probe calibration and connecting the ground alligator clip to circuit ground to prevent 50Hz hum pickup.'
  },

  // Computer Science & IT
  {
    id: 'int-cs-1',
    subject: 'Data Structures & Algorithms',
    branch: 'Computer Science & IT',
    difficulty: 'Core Concept',
    question: 'Compare Arrays and Singly Linked Lists in terms of memory layout, insertion time complexity, and random access.',
    interviewerIntent: 'Testing memory structure understanding and Big-O efficiency analysis.',
    modelAnswer: 'An Array stores elements in contiguous memory locations, allowing O(1) instantaneous random access using index arithmetic (base_address + index * element_size). However, insertion or deletion in the middle requires shifting elements, resulting in O(n) time, and array size is typically static. A Singly Linked List allocates nodes dynamically on the heap; each node holds data plus a pointer to the next node. Random access requires traversing from head node, taking O(n) time. However, inserting or deleting a node once the pointer position is known is O(1) without shifting data.',
    keyKeywords: ['Contiguous memory vs heap nodes', 'O(1) random indexing', 'O(n) traversal', 'Dynamic sizing', 'Pointer overhead'],
    tipsForDiploma: 'Explain with a quick pointer diagram: [Data|Next] -> [Data|Next] -> NULL.'
  },
  {
    id: 'int-cs-2',
    subject: 'Database Management Systems',
    branch: 'Computer Science & IT',
    difficulty: 'Beginner',
    question: 'What are ACID properties in relational databases, and why are they necessary in real-world systems like banking?',
    interviewerIntent: 'Fundamental relational database integrity principles.',
    modelAnswer: 'ACID stands for: 1) Atomicity: All operations in a transaction succeed or all fail together (all-or-nothing); 2) Consistency: The database transitions from one valid state to another, satisfying all constraints; 3) Isolation: Concurrent transactions execute without interfering with one another; 4) Durability: Once a transaction is committed, changes survive system crashes. In banking, transferring ₹5,000 from Account A to B requires debiting A and crediting B: Atomicity ensures that if the system crashes midway, A is not debited without B receiving funds.',
    keyKeywords: ['Atomicity (All-or-Nothing)', 'Consistency', 'Isolation', 'Durability', 'Transaction rollback'],
    tipsForDiploma: 'Always use the standard bank transfer analogy. It is simple, universal, and instantly proves comprehension.'
  },

  // Mechanical Engineering
  {
    id: 'int-mech-1',
    subject: 'Thermodynamics & IC Engines',
    branch: 'Mechanical Engineering',
    difficulty: 'Core Concept',
    question: 'Explain the working difference between Otto Cycle (Petrol) and Diesel Cycle, and why Diesel engines have higher thermal efficiency.',
    interviewerIntent: 'Testing core thermodynamics, compression ratio limits, and ignition mechanics.',
    modelAnswer: 'In the Otto cycle (4-stroke petrol engine), air-fuel mixture is drawn in during suction, compressed at a moderate compression ratio (8:1 to 11:1), and heat addition occurs at constant volume via an electric spark plug. In the Diesel cycle, only fresh air is inducted and compressed to a much higher ratio (16:1 to 22:1); high compression raises air temperature beyond fuel auto-ignition point, and diesel is atomized into the hot air with heat addition at constant pressure. Diesel engines achieve higher thermal efficiency (typically 35–45% vs 25–30% in petrol) because their higher compression ratio extracts more mechanical expansion work per unit of fuel burned.',
    keyKeywords: ['Constant volume vs constant pressure heat addition', 'Compression ratio (8-11 vs 16-22)', 'Spark ignition vs compression ignition', 'Auto-ignition temperature', 'Thermal expansion work'],
    tipsForDiploma: 'Mention why petrol engines cannot use 18:1 compression (knocking/detonation occurs before the spark fires).'
  },
  {
    id: 'int-mech-2',
    subject: 'Manufacturing & Workshop Technology',
    branch: 'Mechanical Engineering',
    difficulty: 'Beginner',
    question: 'What is the difference between Up-Milling (Conventional) and Down-Milling (Climb), and when would you use each on a CNC or manual milling machine?',
    interviewerIntent: 'Evaluating practical shop floor and machining experience.',
    modelAnswer: 'In Up-Milling (conventional milling), the cutter teeth rotate against the direction of table feed. Chip thickness starts at zero and increases to maximum at tooth exit; this tends to lift the workpiece off the table and causes rubbing before cutting begins. In Down-Milling (climb milling), the cutter rotates in the same direction as the table feed. Chip thickness starts at maximum and decreases to zero; cutting force presses the workpiece down onto the fixture, giving a superior surface finish and longer tool life. Down-milling is standard on rigid CNC machines equipped with backlash eliminators; up-milling is used on older manual machines with backlash or when cutting casting skin/scale.',
    keyKeywords: ['Cutter rotation vs table feed direction', 'Chip thickness progression', 'Backlash in lead screw', 'Surface finish', 'Workpiece holding forces'],
    tipsForDiploma: 'Highlight safety: on older manual machines without backlash eliminators, climb milling can grab the workpiece and damage tool/table.'
  },

  // Electrical Engineering
  {
    id: 'int-ee-1',
    subject: 'Electrical Machines & Transformers',
    branch: 'Electrical Engineering',
    difficulty: 'Core Concept',
    question: 'Why is a Transformer rating given in kVA rather than kW, and what are iron losses vs copper losses?',
    interviewerIntent: 'Assessing power factor understanding and loss characteristics in AC electrical machines.',
    modelAnswer: 'A transformer rating is stated in kVA (apparent power) because the manufacturer cannot predict the power factor (cos φ) of the load the user will connect. Transformer heating depends on total losses: Core/Iron losses (hysteresis and eddy currents) depend directly on applied voltage V, while Copper (I²R) losses depend directly on load current I. Neither loss depends on the phase angle or power factor between V and I. Therefore, total loss is governed by V*A, making kVA the accurate capacity metric. Iron losses are fixed/constant independent of load, while copper losses vary with the square of the load current.',
    keyKeywords: ['Apparent power (kVA) vs Real power (kW)', 'Independent of load power factor (cos φ)', 'Iron/Core loss (voltage dependent)', 'Copper I²R loss (current dependent)', 'Open-circuit and short-circuit tests'],
    tipsForDiploma: 'Add that Open Circuit (OC) test measures core losses, and Short Circuit (SC) test measures full-load copper losses.'
  },

  // Civil Engineering
  {
    id: 'int-ce-1',
    subject: 'Concrete Technology & Construction Quality',
    branch: 'Civil Engineering',
    difficulty: 'Beginner',
    question: 'What is the Slump Test in concrete, how is it performed on a construction site, and what does it indicate?',
    interviewerIntent: 'Site testing competence and workability standards.',
    modelAnswer: 'The Slump Test is a standard on-site quality control test performed in accordance with IS 1199 / ASTM C143 to determine the workability and consistency of fresh concrete before placement. A standard hollow metallic frustum cone (300mm high, 200mm bottom diameter, 100mm top diameter) is placed on a clean non-absorbent base and filled with fresh concrete in four equal layers, each tamped 25 times with a standard 16mm bullet-nosed rod. The cone is smoothly lifted vertically, and the subsidence (drop in height) of concrete is measured in millimeters. A true slump indicates good workability; a shear or collapse slump indicates segregation, excess water, or improper mix proportioning.',
    keyKeywords: ['Workability and water-cement ratio', 'Frustum cone dimensions (100x200x300mm)', '25 tamping strokes per layer', 'True slump vs Shear vs Collapse', 'IS 1199 specifications'],
    tipsForDiploma: 'Remember standard slump values: 25–50mm for mass concrete, 50–100mm for normal beams and columns, 100–150mm for heavily reinforced slabs.'
  },

  // General HR / Behavioral for Freshers
  {
    id: 'int-hr-1',
    subject: 'HR & Behavioral',
    branch: 'General HR',
    difficulty: 'Beginner',
    question: 'Tell me about yourself, your educational background, and why you chose a Diploma in engineering.',
    interviewerIntent: 'Evaluating communication clarity, self-awareness, authentic enthusiasm for technical work, and structured speaking.',
    modelAnswer: 'Thank you for this opportunity. My name is [Name], and I recently completed my 3-Year Diploma in [Branch] from [Polytechnic/College] with [Percentage/CGPA]%. I chose a polytechnic diploma because I have always loved hands-on, practical engineering—I wanted to understand how machines, electronic circuits, and industrial systems actually operate rather than just studying pure theory. During my diploma, I completed [mention project/summer training], where I gained hands-on experience in [2-3 skills e.g., PCB troubleshooting, CNC programming, or Python]. I am eager to begin my professional career with [Company Name] where I can apply my shop floor and laboratory skills while continuing to learn and grow.',
    keyKeywords: ['Structured 90-second intro', 'Hands-on practical passion', 'Academic highlights', 'Industrial training link', 'Eagerness to contribute'],
    tipsForDiploma: 'Keep your answer under 2 minutes. Do not recite your entire marks sheet line by line; focus on practical projects, lab work, and discipline.'
  },
  {
    id: 'int-hr-2',
    subject: 'HR & Behavioral',
    branch: 'General HR',
    difficulty: 'Beginner',
    question: 'Are you comfortable working in manufacturing plant shifts, rotational hours, or relocating to our project sites?',
    interviewerIntent: 'Checking flexibility, realistic understanding of core engineering operations, and long-term commitment.',
    modelAnswer: 'Yes, absolutely. As a diploma engineer trainee, I understand that plant operations, testing cycles, and manufacturing lines operate continuously on rotational shifts. In fact, working across different shifts will give me a well-rounded understanding of shift handovers, production maintenance, and team management. I am also fully open to relocating to wherever the company assigns me, as practical field exposure is the best way to build a solid technical foundation in my early career.',
    keyKeywords: ['Shift adaptability', 'Plant operations understanding', 'Relocation willingness', 'Eagerness for shop floor exposure'],
    tipsForDiploma: 'Never hesitate or ask for desk-only jobs in a manufacturing or DET interview. Companies seek proactive, enthusiastic candidates.'
  }
];
