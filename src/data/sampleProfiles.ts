import { StudentProfile, ResumeData } from '../types';

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Aman Verma',
  email: 'aman.verma.ece@example.com',
  phone: '+91 98765 43210',
  qualification: 'Diploma',
  branch: 'Electronics & Communication',
  institution: 'Government Polytechnic Institute',
  boardOrUniversity: 'State Board of Technical Education',
  percentageOrCgpa: 74.5,
  graduationYear: 2026,
  currentSemesterOrStatus: 'Final Year (Semester 6)',
  activeBacklogs: 0,
  clearedBacklogs: 0,
  category: 'General',
  dateOfBirth: '2004-08-15',
  skills: [
    'Digital Circuit Design',
    'Microcontroller 8051 & Arduino',
    'PCB Layout & Soldering',
    'DSO & Function Generator Operation',
    'C Programming',
    'Basic Python',
    'MATLAB / Proteus Simulation',
    'Industrial IoT Basics'
  ],
  location: 'Lucknow, Uttar Pradesh',
  careerGoals: 'Securing a Technician Apprenticeship or Diploma Engineer Trainee role in an electronics manufacturing or defense PSU, or pursuing lateral entry B.Tech.'
};

export const SAMPLE_RESUME_PROFILES: Record<string, ResumeData> = {
  ece: {
    personalInfo: {
      fullName: 'Aman Verma',
      email: 'aman.verma.ece@example.com',
      phone: '+91 98765 43210',
      location: 'Lucknow, UP / Open to Relocation',
      linkedIn: 'linkedin.com/in/aman-verma-ece',
      githubOrPortfolio: 'github.com/aman-electronics',
      summary: 'Motivated and detail-oriented final-year Diploma in Electronics & Communication student with solid hands-on bench experience in embedded prototyping, PCB assembly, circuit testing using DSO, and C programming. Seeking a Technician Apprentice (NATS) or Diploma Engineer Trainee (DET) role to contribute to precision hardware testing and manufacturing operations.'
    },
    education: {
      diploma: {
        degree: 'Diploma in Electronics & Communication Engineering',
        branch: 'Electronics & Communication',
        institution: 'Government Polytechnic Institute',
        board: 'Board of Technical Education (BTE)',
        yearOfPassing: '2026 (Expected)',
        percentageOrCgpa: '74.5% Aggregate'
      },
      tenth: {
        school: 'Kendriya Vidyalaya',
        board: 'CBSE',
        yearOfPassing: '2023',
        percentage: '81.2%'
      }
    },
    skills: {
      technical: [
        'Microcontroller Prototyping (8051, ATmega328P, ESP32)',
        'Embedded C & Python Fundamentals',
        'Analog & Digital Circuit Troubleshooting',
        'Sensor Interfacing (ADC, I2C, SPI, UART)',
        'Basic Power Electronics & Regulated Supplies'
      ],
      toolsAndSoftware: [
        'Proteus Circuit Simulator',
        'KiCad PCB Design',
        'Arduino IDE',
        'Keil µVision',
        'MS Excel & Technical Documentation'
      ],
      labInstruments: [
        'Digital Storage Oscilloscope (DSO)',
        'Digital Multimeter (DMM)',
        'Regulated DC Power Supply',
        'Function Generator',
        'Temperature-Controlled Soldering Station'
      ],
      softSkills: [
        'Technical Problem Solving',
        'Industrial Safety Protocols (5S & ESD precautions)',
        'Shop Floor Communication',
        'Team Collaboration'
      ]
    },
    projects: [
      {
        id: 'proj-1',
        title: 'Smart Environmental Monitoring System using ESP32',
        role: 'Hardware Lead & Firmware Developer',
        technologies: 'ESP32, DHT22 Sensor, MQ-135 Gas Sensor, Arduino C, MQTT',
        duration: 'Jan 2026 – Present (Final Year Project)',
        description: 'Designed a real-time air quality and temperature logger. Fabricated custom two-layer breadboard interface, interfaced calibrated analog sensors, and transmitted data via Wi-Fi to a local dashboard.',
        outcome: 'Achieved 98% telemetry transmission reliability; awarded 2nd prize at the Polytechnic Annual Technical Exposition.'
      },
      {
        id: 'proj-2',
        title: 'Digital Frequency Counter using 8051 Microcontroller',
        role: 'Circuit Assembler & Programmer',
        technologies: '8051 (AT89C51), 7-Segment Multiplexed Displays, Proteus',
        duration: 'Aug 2025 – Nov 2025',
        description: 'Constructed an audio-frequency counter utilizing hardware Timer 0 as an external pulse counter and Timer 1 for a precise 1-second gate interval with 4-digit multiplexed LED display.',
        outcome: 'Accurately measured square and sinusoidal wave inputs from 10 Hz to 50 kHz with less than 1.5% measurement error.'
      }
    ],
    internships: [
      {
        id: 'intern-1',
        company: 'Bharat Sanchar Nigam Limited (BSNL) Telecom Training Centre',
        role: 'Summer Vocational Trainee',
        duration: 'June 2025 – July 2025 (4 Weeks)',
        location: 'Regional Telecom Centre',
        responsibilities: 'Completed 4-week structured industrial training on Optical Fiber Cable (OFC) splicing, OTDR fault locator testing, digital switching exchanges, and BTS mobile tower auxiliary power maintenance.'
      }
    ],
    certifications: [
      'NPTEL Online Certification: Introduction to Embedded Systems (Elite Score)',
      'Basic Electronic Assembly & ESD Prevention Workshop (MSME Technology Centre)'
    ],
    achievements: [
      'Class Representative for ECE Semester 4 and 5',
      'First prize in Inter-Polytechnic Circuit Debugging Contest 2025'
    ]
  },
  mech: {
    personalInfo: {
      fullName: 'Vikram Joshi',
      email: 'vikram.joshi.mech@example.com',
      phone: '+91 98234 56789',
      location: 'Pune, Maharashtra / Willing to Relocate',
      linkedIn: 'linkedin.com/in/vikram-joshi-mech',
      githubOrPortfolio: '',
      summary: 'Practical-minded Diploma in Mechanical Engineering graduate with hands-on expertise in CNC G-code programming, 2D/3D CAD modeling, lathe machining, and quality inspection tools (Vernier, Micrometer, Height Gauge). Eager to work as a Diploma Engineer Trainee in precision manufacturing, automotive assembly, or tool room operations.'
    },
    education: {
      diploma: {
        degree: 'Diploma in Mechanical Engineering',
        branch: 'Mechanical Engineering',
        institution: 'Government Polytechnic Pune',
        board: 'Maharashtra State Board of Technical Education (MSBTE)',
        yearOfPassing: '2026',
        percentageOrCgpa: '76.8% Aggregate'
      },
      tenth: {
        school: 'Modern High School Pune',
        board: 'SSC Maharashtra State Board',
        yearOfPassing: '2023',
        percentage: '83.4%'
      }
    },
    skills: {
      technical: [
        'CNC Turning & Milling G-Code / M-Code Programming',
        'Engineering Drawing & GD&T Standards',
        'Metrology & Quality Inspection',
        'Workshop Machine Tool Operation (Lathe, Shaper, Milling)',
        'Hydraulics & Pneumatics Circuit Understanding'
      ],
      toolsAndSoftware: [
        'AutoCAD (2D Drafting & Detailing)',
        'SolidWorks (3D Part Modeling & Assemblies)',
        'Siemens CNC Sinumerik Simulator',
        'MS Office & Production Logs'
      ],
      labInstruments: [
        'Digital Vernier Caliper & Micrometer',
        'Vernier Height Gauge & Surface Plate',
        'Dial Test Indicator (DTI)',
        'Universal Testing Machine (UTM for Tensile testing)',
        'Rockwell & Brinell Hardness Testers'
      ],
      softSkills: [
        '5S Shop Floor Methodology',
        'Industrial Safety & PPE Adherence',
        'Punctual Shift Work Execution',
        'Teamwork on Assembly Lines'
      ]
    },
    projects: [
      {
        id: 'proj-mech-1',
        title: 'Design & Fabrication of Pneumatic Sheet Metal Cutting Machine',
        role: 'Fabrication & Pneumatic Circuit Lead',
        technologies: 'Pneumatics Cylinder, 5/2 Way Solenoid Valve, Mild Steel Frame, AutoCAD',
        duration: 'Dec 2025 – Present (Final Year Capstone)',
        description: 'Fabricated a low-cost benchtop pneumatic shear for cutting up to 1.5 mm GI sheets. Calculated cylinder force required based on material shear strength, designed frame in AutoCAD, and assembled pneumatic directional control valves.',
        outcome: 'Reduced manual cutting effort by 80% while ensuring uniform burr-free edges; safely demonstrated during polytechnic project inspection.'
      }
    ],
    internships: [
      {
        id: 'intern-mech-1',
        company: 'Bharat Gears & Precision Auto Components Ltd.',
        role: 'Production In-plant Trainee',
        duration: 'May 2025 – June 2025 (6 Weeks)',
        location: 'MIDC Chakan, Pune',
        responsibilities: 'Underwent 6-week factory floor training in gear hobbing, heat treatment inspection, and finished component dimension checks using dial bore gauges and coordinate measuring instruments.'
      }
    ],
    certifications: [
      'Certified SolidWorks Associate (CSWA) - Academic',
      'Industrial Safety & Fire Fighting Awareness (MSME Chakan)'
    ],
    achievements: [
      'Ranked in top 5% of polytechnic mechanical engineering department',
      'Awarded Best Workshop Craftsmanship Trophy in Semester 3'
    ]
  }
};
