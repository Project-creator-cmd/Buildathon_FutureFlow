const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Stream = require('../models/Stream');
const Degree = require('../models/Degree');
const Exam = require('../models/Exam');
const Skill = require('../models/Skill');
const JobRole = require('../models/JobRole');
const Career = require('../models/Career');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Stream.deleteMany();
    await Degree.deleteMany();
    await Exam.deleteMany();
    await Skill.deleteMany();
    await JobRole.deleteMany();
    await Career.deleteMany();

    console.log('Cleared existing data');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@futureflow.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin created');

    // Create Streams
    const streams = await Stream.insertMany([
      { name: 'Science (PCM)', description: 'Physics, Chemistry, Mathematics' },
      { name: 'Science (PCB)', description: 'Physics, Chemistry, Biology' },
      { name: 'Commerce', description: 'Accountancy, Business Studies, Economics' },
      { name: 'Arts/Humanities', description: 'History, Political Science, Literature' },
      { name: 'Vocational', description: 'Technical and vocational courses' },
      { name: 'Diploma', description: 'Polytechnic and diploma programs' }
    ]);
    console.log('Streams created');

    // Create Skills (25 skills)
    const skills = await Skill.insertMany([
      { name: 'Programming', category: 'Technical' },
      { name: 'Data Structures', category: 'Technical' },
      { name: 'Web Development', category: 'Technical' },
      { name: 'Machine Learning', category: 'Technical' },
      { name: 'Database Management', category: 'Technical' },
      { name: 'Cloud Computing', category: 'Technical' },
      { name: 'Cybersecurity', category: 'Technical' },
      { name: 'Problem Solving', category: 'Soft Skill' },
      { name: 'Communication', category: 'Soft Skill' },
      { name: 'Leadership', category: 'Soft Skill' },
      { name: 'Analytical Thinking', category: 'Soft Skill' },
      { name: 'Biology', category: 'Science' },
      { name: 'Chemistry', category: 'Science' },
      { name: 'Anatomy', category: 'Medical' },
      { name: 'Patient Care', category: 'Medical' },
      { name: 'Accounting', category: 'Finance' },
      { name: 'Financial Analysis', category: 'Finance' },
      { name: 'Taxation', category: 'Finance' },
      { name: 'UI/UX Design', category: 'Design' },
      { name: 'Graphic Design', category: 'Design' },
      { name: 'Legal Research', category: 'Law' },
      { name: 'Critical Thinking', category: 'Soft Skill' },
      { name: 'Project Management', category: 'Management' },
      { name: 'Business Strategy', category: 'Management' },
      { name: 'Data Analysis', category: 'Technical' }
    ]);
    console.log('Skills created');

    // Create Exams (15 exams)
    const exams = await Exam.insertMany([
      { name: 'JEE Main', fullName: 'Joint Entrance Examination Main', streams: [streams[0]._id], level: 'entrance' },
      { name: 'JEE Advanced', fullName: 'Joint Entrance Examination Advanced', streams: [streams[0]._id], level: 'entrance' },
      { name: 'NEET', fullName: 'National Eligibility cum Entrance Test', streams: [streams[1]._id], level: 'entrance' },
      { name: 'GATE', fullName: 'Graduate Aptitude Test in Engineering', streams: [streams[0]._id], level: 'entrance' },
      { name: 'CAT', fullName: 'Common Admission Test', streams: [streams[2]._id], level: 'entrance' },
      { name: 'CLAT', fullName: 'Common Law Admission Test', streams: [streams[3]._id], level: 'entrance' },
      { name: 'UPSC CSE', fullName: 'Civil Services Examination', streams: [streams[3]._id], level: 'competitive' },
      { name: 'NIFT', fullName: 'National Institute of Fashion Technology', streams: [streams[3]._id], level: 'entrance' },
      { name: 'NDA', fullName: 'National Defence Academy', streams: [streams[0]._id], level: 'competitive' },
      { name: 'CA Foundation', fullName: 'Chartered Accountant Foundation', streams: [streams[2]._id], level: 'certification' },
      { name: 'NATA', fullName: 'National Aptitude Test in Architecture', streams: [streams[0]._id], level: 'entrance' },
      { name: 'AIIMS', fullName: 'All India Institute of Medical Sciences', streams: [streams[1]._id], level: 'entrance' },
      { name: 'XAT', fullName: 'Xavier Aptitude Test', streams: [streams[2]._id], level: 'entrance' },
      { name: 'CTET', fullName: 'Central Teacher Eligibility Test', streams: [streams[3]._id], level: 'certification' },
      { name: 'CSIR NET', fullName: 'Council of Scientific & Industrial Research NET', streams: [streams[0]._id], level: 'competitive' }
    ]);
    console.log('Exams created');

    // Create Degrees (12 degrees)
    const degrees = await Degree.insertMany([
      { name: 'B.Tech Computer Science', level: 'undergraduate', duration: '4 years', streams: [streams[0]._id], requiredExams: [exams[0]._id] },
      { name: 'MBBS', level: 'undergraduate', duration: '5.5 years', streams: [streams[1]._id], requiredExams: [exams[2]._id] },
      { name: 'B.Com', level: 'undergraduate', duration: '3 years', streams: [streams[2]._id] },
      { name: 'BBA', level: 'undergraduate', duration: '3 years', streams: [streams[2]._id] },
      { name: 'MBA', level: 'postgraduate', duration: '2 years', streams: [streams[2]._id], requiredExams: [exams[4]._id] },
      { name: 'LLB', level: 'undergraduate', duration: '3 years', streams: [streams[3]._id], requiredExams: [exams[5]._id] },
      { name: 'B.Sc Data Science', level: 'undergraduate', duration: '3 years', streams: [streams[0]._id] },
      { name: 'M.Tech', level: 'postgraduate', duration: '2 years', streams: [streams[0]._id], requiredExams: [exams[3]._id] },
      { name: 'BCA', level: 'undergraduate', duration: '3 years', streams: [streams[0]._id] },
      { name: 'B.Des', level: 'undergraduate', duration: '4 years', streams: [streams[3]._id], requiredExams: [exams[7]._id] },
      { name: 'B.Ed', level: 'undergraduate', duration: '2 years', streams: [streams[3]._id], requiredExams: [exams[13]._id] },
      { name: 'B.Sc Physics', level: 'undergraduate', duration: '3 years', streams: [streams[0]._id] }
    ]);
    console.log('Degrees created');

    // Create Job Roles (30+ roles)
    const jobRoles = await JobRole.insertMany([
      // Software Engineering
      { title: 'Junior Software Developer', level: 'entry', salaryRange: { min: 300000, max: 600000 }, experience: '0-2 years', requiredSkills: [skills[0]._id, skills[1]._id], sector: 'private' },
      { title: 'Software Engineer', level: 'mid', salaryRange: { min: 800000, max: 1500000 }, experience: '3-6 years', requiredSkills: [skills[0]._id, skills[1]._id, skills[2]._id], sector: 'private' },
      { title: 'Senior Software Architect', level: 'senior', salaryRange: { min: 2000000, max: 4000000 }, experience: '7-10 years', requiredSkills: [skills[0]._id, skills[1]._id, skills[5]._id], sector: 'private' },
      
      // Data Science
      { title: 'Data Analyst', level: 'entry', salaryRange: { min: 400000, max: 700000 }, experience: '0-2 years', requiredSkills: [skills[24]._id, skills[10]._id], sector: 'both' },
      { title: 'Data Scientist', level: 'mid', salaryRange: { min: 1000000, max: 1800000 }, experience: '3-6 years', requiredSkills: [skills[3]._id, skills[24]._id], sector: 'both' },
      { title: 'Lead Data Scientist', level: 'senior', salaryRange: { min: 2500000, max: 5000000 }, experience: '7-10 years', requiredSkills: [skills[3]._id, skills[9]._id], sector: 'both' },
      
      // Medical
      { title: 'Junior Doctor', level: 'entry', salaryRange: { min: 600000, max: 1000000 }, experience: '0-2 years', requiredSkills: [skills[13]._id, skills[14]._id], sector: 'both' },
      { title: 'Medical Officer', level: 'mid', salaryRange: { min: 1200000, max: 2000000 }, experience: '3-6 years', requiredSkills: [skills[13]._id, skills[14]._id], sector: 'both' },
      { title: 'Senior Consultant', level: 'senior', salaryRange: { min: 2500000, max: 6000000 }, experience: '7-10 years', requiredSkills: [skills[13]._id, skills[9]._id], sector: 'both' },
      
      // Finance
      { title: 'Junior Accountant', level: 'entry', salaryRange: { min: 300000, max: 500000 }, experience: '0-2 years', requiredSkills: [skills[15]._id, skills[17]._id], sector: 'both' },
      { title: 'Financial Analyst', level: 'mid', salaryRange: { min: 700000, max: 1200000 }, experience: '3-6 years', requiredSkills: [skills[16]._id, skills[10]._id], sector: 'both' },
      { title: 'Finance Manager', level: 'senior', salaryRange: { min: 1800000, max: 3500000 }, experience: '7-10 years', requiredSkills: [skills[16]._id, skills[9]._id], sector: 'both' },
      
      // Design
      { title: 'UI/UX Designer', level: 'entry', salaryRange: { min: 350000, max: 600000 }, experience: '0-2 years', requiredSkills: [skills[18]._id, skills[19]._id], sector: 'private' },
      { title: 'Senior Designer', level: 'mid', salaryRange: { min: 800000, max: 1400000 }, experience: '3-6 years', requiredSkills: [skills[18]._id, skills[19]._id], sector: 'private' },
      { title: 'Design Lead', level: 'senior', salaryRange: { min: 1800000, max: 3000000 }, experience: '7-10 years', requiredSkills: [skills[18]._id, skills[9]._id], sector: 'private' },
      
      // Law
      { title: 'Junior Associate', level: 'entry', salaryRange: { min: 400000, max: 800000 }, experience: '0-2 years', requiredSkills: [skills[20]._id, skills[21]._id], sector: 'both' },
      { title: 'Senior Associate', level: 'mid', salaryRange: { min: 1000000, max: 2000000 }, experience: '3-6 years', requiredSkills: [skills[20]._id, skills[8]._id], sector: 'both' },
      { title: 'Partner', level: 'senior', salaryRange: { min: 3000000, max: 8000000 }, experience: '7-10 years', requiredSkills: [skills[20]._id, skills[9]._id], sector: 'both' },
      
      // Management
      { title: 'Management Trainee', level: 'entry', salaryRange: { min: 400000, max: 700000 }, experience: '0-2 years', requiredSkills: [skills[22]._id, skills[8]._id], sector: 'private' },
      { title: 'Manager', level: 'mid', salaryRange: { min: 1000000, max: 1800000 }, experience: '3-6 years', requiredSkills: [skills[23]._id, skills[9]._id], sector: 'private' },
      { title: 'Senior Manager/Director', level: 'senior', salaryRange: { min: 2500000, max: 5000000 }, experience: '7-10 years', requiredSkills: [skills[23]._id, skills[9]._id], sector: 'private' },
      
      // Civil Services
      { title: 'SDM/ASP', level: 'entry', salaryRange: { min: 800000, max: 1200000 }, experience: '0-2 years', requiredSkills: [skills[8]._id], sector: 'government' },
      { title: 'DM/SP', level: 'mid', salaryRange: { min: 1500000, max: 2000000 }, experience: '5-10 years', requiredSkills: [skills[9]._id], sector: 'government' },
      { title: 'Secretary', level: 'senior', salaryRange: { min: 2500000, max: 3500000 }, experience: '15+ years', requiredSkills: [skills[9]._id], sector: 'government' },
      
      // Cybersecurity
      { title: 'Security Analyst', level: 'entry', salaryRange: { min: 400000, max: 700000 }, experience: '0-2 years', requiredSkills: [skills[6]._id, skills[0]._id], sector: 'both' },
      { title: 'Security Engineer', level: 'mid', salaryRange: { min: 1000000, max: 1800000 }, experience: '3-6 years', requiredSkills: [skills[6]._id, skills[7]._id], sector: 'both' },
      { title: 'Chief Security Officer', level: 'senior', salaryRange: { min: 2500000, max: 5000000 }, experience: '7-10 years', requiredSkills: [skills[6]._id, skills[9]._id], sector: 'both' },
      
      // Teaching
      { title: 'Assistant Teacher', level: 'entry', salaryRange: { min: 300000, max: 500000 }, experience: '0-2 years', requiredSkills: [skills[8]._id, skills[21]._id], sector: 'both' },
      { title: 'Senior Teacher', level: 'mid', salaryRange: { min: 500000, max: 800000 }, experience: '3-6 years', requiredSkills: [skills[8]._id, skills[9]._id], sector: 'both' },
      { title: 'Principal/Professor', level: 'senior', salaryRange: { min: 1000000, max: 2000000 }, experience: '7-10 years', requiredSkills: [skills[9]._id, skills[22]._id], sector: 'both' },
      
      // Research
      { title: 'Research Assistant', level: 'entry', salaryRange: { min: 350000, max: 600000 }, experience: '0-2 years', requiredSkills: [skills[10]._id, skills[21]._id], sector: 'both' },
      { title: 'Research Scientist', level: 'mid', salaryRange: { min: 800000, max: 1500000 }, experience: '3-6 years', requiredSkills: [skills[10]._id, skills[7]._id], sector: 'both' },
      { title: 'Senior Research Scientist', level: 'senior', salaryRange: { min: 1800000, max: 3500000 }, experience: '7-10 years', requiredSkills: [skills[10]._id, skills[9]._id], sector: 'both' }
    ]);
    console.log('Job Roles created');

    // Create 20+ Careers
    const careers = await Career.insertMany([
      {
        name: 'Software Engineer',
        category: 'Engineering & Technology',
        requiredStream: streams[0]._id,
        requiredExams: [exams[0]._id],
        requiredDegrees: [degrees[0]._id],
        coreSkills: [skills[0]._id, skills[1]._id, skills[2]._id, skills[7]._id],
        certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
        internshipDuration: '3-6 months',
        jobRoles: { entry: jobRoles[0]._id, mid: jobRoles[1]._id, senior: jobRoles[2]._id },
        alternativePaths: ['Full Stack Developer', 'DevOps Engineer', 'Cloud Architect'],
        description: 'Design, develop, and maintain software applications',
        minMarks: 60,
        isHighDemand: true,
        demandGrowth: 25
      },
      {
        name: 'Data Scientist',
        category: 'Emerging Fields',
        requiredStream: streams[0]._id,
        requiredExams: [exams[0]._id],
        requiredDegrees: [degrees[6]._id],
        coreSkills: [skills[3]._id, skills[24]._id, skills[0]._id, skills[10]._id],
        certifications: ['Google Data Analytics', 'IBM Data Science Professional'],
        internshipDuration: '6 months',
        jobRoles: { entry: jobRoles[3]._id, mid: jobRoles[4]._id, senior: jobRoles[5]._id },
        alternativePaths: ['ML Engineer', 'AI Researcher', 'Business Analyst'],
        description: 'Analyze complex data to help companies make decisions',
        minMarks: 65,
        isHighDemand: true,
        demandGrowth: 30
      },
      {
        name: 'Doctor (MBBS)',
        category: 'Medical & Healthcare',
        requiredStream: streams[1]._id,
        requiredExams: [exams[2]._id],
        requiredDegrees: [degrees[1]._id],
        coreSkills: [skills[11]._id, skills[12]._id, skills[13]._id, skills[14]._id],
        certifications: ['MRCP', 'USMLE', 'Specialty Certifications'],
        internshipDuration: '1 year (Mandatory)',
        jobRoles: { entry: jobRoles[6]._id, mid: jobRoles[7]._id, senior: jobRoles[8]._id },
        alternativePaths: ['Surgeon', 'Radiologist', 'Cardiologist'],
        description: 'Diagnose and treat patients, save lives',
        minMarks: 85,
        isHighDemand: true,
        demandGrowth: 15
      },
      {
        name: 'Chartered Accountant',
        category: 'Commerce & Finance',
        requiredStream: streams[2]._id,
        requiredExams: [exams[9]._id],
        requiredDegrees: [degrees[2]._id],
        coreSkills: [skills[15]._id, skills[16]._id, skills[17]._id, skills[10]._id],
        certifications: ['CA Final', 'CFA', 'CPA'],
        internshipDuration: '3 years (Articleship)',
        jobRoles: { entry: jobRoles[9]._id, mid: jobRoles[10]._id, senior: jobRoles[11]._id },
        alternativePaths: ['Tax Consultant', 'Auditor', 'CFO'],
        description: 'Manage financial records, audits, and taxation',
        minMarks: 55,
        isHighDemand: false,
        demandGrowth: 10
      },
      {
        name: 'UI/UX Designer',
        category: 'Design & Creative',
        requiredStream: streams[3]._id,
        requiredExams: [exams[7]._id],
        requiredDegrees: [degrees[9]._id],
        coreSkills: [skills[18]._id, skills[19]._id, skills[21]._id],
        certifications: ['Google UX Design', 'Adobe Certified Professional'],
        internshipDuration: '3-6 months',
        jobRoles: { entry: jobRoles[12]._id, mid: jobRoles[13]._id, senior: jobRoles[14]._id },
        alternativePaths: ['Product Designer', 'Visual Designer', 'Design Director'],
        description: 'Create user-friendly digital experiences',
        minMarks: 50,
        isHighDemand: true,
        demandGrowth: 20
      },
      {
        name: 'Lawyer',
        category: 'Law',
        requiredStream: streams[3]._id,
        requiredExams: [exams[5]._id],
        requiredDegrees: [degrees[5]._id],
        coreSkills: [skills[20]._id, skills[21]._id, skills[8]._id],
        certifications: ['Bar Council Enrollment', 'LLM'],
        internshipDuration: '1 year',
        jobRoles: { entry: jobRoles[15]._id, mid: jobRoles[16]._id, senior: jobRoles[17]._id },
        alternativePaths: ['Corporate Lawyer', 'Judge', 'Legal Advisor'],
        description: 'Represent clients in legal matters',
        minMarks: 55,
        isHighDemand: false,
        demandGrowth: 8
      },
      {
        name: 'MBA Graduate',
        category: 'Management',
        requiredStream: streams[2]._id,
        requiredExams: [exams[4]._id],
        requiredDegrees: [degrees[4]._id],
        coreSkills: [skills[22]._id, skills[23]._id, skills[9]._id],
        certifications: ['PMP', 'Six Sigma'],
        internshipDuration: '2-3 months',
        jobRoles: { entry: jobRoles[18]._id, mid: jobRoles[19]._id, senior: jobRoles[20]._id },
        alternativePaths: ['Entrepreneur', 'Consultant', 'CEO'],
        description: 'Lead teams and drive business growth',
        minMarks: 60,
        isHighDemand: false,
        demandGrowth: 12
      },
      {
        name: 'Civil Servant (IAS/IPS)',
        category: 'Government & Civil Services',
        requiredStream: streams[3]._id,
        requiredExams: [exams[6]._id],
        requiredDegrees: [degrees[2]._id],
        coreSkills: [skills[8]._id, skills[9]._id, skills[21]._id],
        certifications: ['UPSC CSE Cleared'],
        internshipDuration: '2 years (Training)',
        jobRoles: { entry: jobRoles[21]._id, mid: jobRoles[22]._id, senior: jobRoles[23]._id },
        alternativePaths: ['IFS', 'IRS', 'State Services'],
        description: 'Serve the nation through administrative roles',
        minMarks: 70,
        isHighDemand: false,
        demandGrowth: 5
      },
      {
        name: 'Cybersecurity Analyst',
        category: 'Emerging Fields',
        requiredStream: streams[0]._id,
        requiredExams: [exams[0]._id],
        requiredDegrees: [degrees[0]._id],
        coreSkills: [skills[6]._id, skills[0]._id, skills[7]._id],
        certifications: ['CEH', 'CISSP', 'CompTIA Security+'],
        internshipDuration: '6 months',
        jobRoles: { entry: jobRoles[24]._id, mid: jobRoles[25]._id, senior: jobRoles[26]._id },
        alternativePaths: ['Penetration Tester', 'Security Architect', 'CISO'],
        description: 'Protect systems and networks from cyber threats',
        minMarks: 65,
        isHighDemand: true,
        demandGrowth: 35
      },
      {
        name: 'Teacher',
        category: 'Pure Sciences',
        requiredStream: streams[3]._id,
        requiredExams: [exams[13]._id],
        requiredDegrees: [degrees[10]._id],
        coreSkills: [skills[8]._id, skills[21]._id, skills[9]._id],
        certifications: ['CTET', 'TET', 'B.Ed'],
        internshipDuration: '6 months (Practice Teaching)',
        jobRoles: { entry: jobRoles[27]._id, mid: jobRoles[28]._id, senior: jobRoles[29]._id },
        alternativePaths: ['Principal', 'Education Consultant', 'Curriculum Designer'],
        description: 'Educate and inspire the next generation',
        minMarks: 50,
        isHighDemand: false,
        demandGrowth: 7
      },
      {
        name: 'Research Scientist',
        category: 'Pure Sciences',
        requiredStream: streams[0]._id,
        requiredExams: [exams[14]._id],
        requiredDegrees: [degrees[11]._id],
        coreSkills: [skills[10]._id, skills[21]._id, skills[7]._id],
        certifications: ['PhD', 'Research Publications'],
        internshipDuration: '1 year',
        jobRoles: { entry: jobRoles[30]._id, mid: jobRoles[31]._id, senior: jobRoles[32]._id },
        alternativePaths: ['Professor', 'Lab Director', 'R&D Head'],
        description: 'Conduct research and advance scientific knowledge',
        minMarks: 75,
        isHighDemand: false,
        demandGrowth: 10
      },
      {
        name: 'Cloud Engineer',
        category: 'Emerging Fields',
        requiredStream: streams[0]._id,
        requiredExams: [exams[0]._id],
        requiredDegrees: [degrees[0]._id],
        coreSkills: [skills[5]._id, skills[0]._id, skills[4]._id],
        certifications: ['AWS Solutions Architect', 'Azure Administrator', 'GCP Professional'],
        internshipDuration: '6 months',
        jobRoles: { entry: jobRoles[0]._id, mid: jobRoles[1]._id, senior: jobRoles[2]._id },
        alternativePaths: ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer'],
        description: 'Design and manage cloud infrastructure',
        minMarks: 60,
        isHighDemand: true,
        demandGrowth: 28
      },
      {
        name: 'Digital Marketer',
        category: 'Management',
        requiredStream: streams[2]._id,
        requiredExams: [],
        requiredDegrees: [degrees[3]._id],
        coreSkills: [skills[8]._id, skills[24]._id, skills[21]._id],
        certifications: ['Google Ads', 'Facebook Blueprint', 'HubSpot'],
        internshipDuration: '3 months',
        jobRoles: { entry: jobRoles[18]._id, mid: jobRoles[19]._id, senior: jobRoles[20]._id },
        alternativePaths: ['Content Strategist', 'SEO Specialist', 'Growth Hacker'],
        description: 'Promote brands and products online',
        minMarks: 50,
        isHighDemand: true,
        demandGrowth: 22
      },
      {
        name: 'Product Manager',
        category: 'Management',
        requiredStream: streams[0]._id,
        requiredExams: [exams[4]._id],
        requiredDegrees: [degrees[4]._id],
        coreSkills: [skills[22]._id, skills[23]._id, skills[8]._id],
        certifications: ['Certified Scrum Product Owner', 'Product Management Certificate'],
        internshipDuration: '6 months',
        jobRoles: { entry: jobRoles[18]._id, mid: jobRoles[19]._id, senior: jobRoles[20]._id },
        alternativePaths: ['VP Product', 'Chief Product Officer', 'Entrepreneur'],
        description: 'Define product vision and strategy',
        minMarks: 65,
        isHighDemand: true,
        demandGrowth: 24
      },
      {
        name: 'AI Engineer',
        category: 'Emerging Fields',
        requiredStream: streams[0]._id,
        requiredExams: [exams[0]._id],
        requiredDegrees: [degrees[6]._id],
        coreSkills: [skills[3]._id, skills[0]._id, skills[1]._id],
        certifications: ['TensorFlow Developer', 'Deep Learning Specialization'],
        internshipDuration: '6 months',
        jobRoles: { entry: jobRoles[3]._id, mid: jobRoles[4]._id, senior: jobRoles[5]._id },
        alternativePaths: ['ML Engineer', 'Research Scientist', 'AI Architect'],
        description: 'Build intelligent systems using AI and ML',
        minMarks: 70,
        isHighDemand: true,
        demandGrowth: 40
      },
      {
        name: 'Graphic Designer',
        category: 'Design & Creative',
        requiredStream: streams[3]._id,
        requiredExams: [exams[7]._id],
        requiredDegrees: [degrees[9]._id],
        coreSkills: [skills[19]._id, skills[21]._id],
        certifications: ['Adobe Certified Expert', 'Graphic Design Certification'],
        internshipDuration: '3 months',
        jobRoles: { entry: jobRoles[12]._id, mid: jobRoles[13]._id, senior: jobRoles[14]._id },
        alternativePaths: ['Art Director', 'Brand Designer', 'Creative Director'],
        description: 'Create visual content for brands',
        minMarks: 45,
        isHighDemand: false,
        demandGrowth: 12
      },
      {
        name: 'Financial Analyst',
        category: 'Commerce & Finance',
        requiredStream: streams[2]._id,
        requiredExams: [],
        requiredDegrees: [degrees[2]._id],
        coreSkills: [skills[16]._id, skills[24]._id, skills[10]._id],
        certifications: ['CFA', 'FRM', 'Financial Modeling'],
        internshipDuration: '6 months',
        jobRoles: { entry: jobRoles[9]._id, mid: jobRoles[10]._id, senior: jobRoles[11]._id },
        alternativePaths: ['Investment Banker', 'Portfolio Manager', 'CFO'],
        description: 'Analyze financial data and provide insights',
        minMarks: 60,
        isHighDemand: false,
        demandGrowth: 14
      },
      {
        name: 'Web Developer',
        category: 'Engineering & Technology',
        requiredStream: streams[0]._id,
        requiredExams: [],
        requiredDegrees: [degrees[8]._id],
        coreSkills: [skills[2]._id, skills[0]._id, skills[4]._id],
        certifications: ['Full Stack Developer', 'React Developer', 'Node.js Certified'],
        internshipDuration: '3-6 months',
        jobRoles: { entry: jobRoles[0]._id, mid: jobRoles[1]._id, senior: jobRoles[2]._id },
        alternativePaths: ['Frontend Developer', 'Backend Developer', 'Tech Lead'],
        description: 'Build and maintain websites and web applications',
        minMarks: 55,
        isHighDemand: true,
        demandGrowth: 26
      },
      {
        name: 'Architect',
        category: 'Design & Creative',
        requiredStream: streams[0]._id,
        requiredExams: [exams[10]._id],
        requiredDegrees: [degrees[9]._id],
        coreSkills: [skills[19]._id, skills[21]._id, skills[7]._id],
        certifications: ['Council of Architecture Registration', 'LEED Certification'],
        internshipDuration: '1 year',
        jobRoles: { entry: jobRoles[12]._id, mid: jobRoles[13]._id, senior: jobRoles[14]._id },
        alternativePaths: ['Urban Planner', 'Landscape Architect', 'Interior Designer'],
        description: 'Design buildings and structures',
        minMarks: 60,
        isHighDemand: false,
        demandGrowth: 9
      },
      {
        name: 'Pharmacist',
        category: 'Medical & Healthcare',
        requiredStream: streams[1]._id,
        requiredExams: [exams[2]._id],
        requiredDegrees: [degrees[1]._id],
        coreSkills: [skills[12]._id, skills[14]._id, skills[8]._id],
        certifications: ['Pharmacy Council Registration', 'Clinical Pharmacy'],
        internshipDuration: '6 months',
        jobRoles: { entry: jobRoles[6]._id, mid: jobRoles[7]._id, senior: jobRoles[8]._id },
        alternativePaths: ['Clinical Pharmacist', 'Hospital Pharmacist', 'Pharmaceutical Researcher'],
        description: 'Dispense medications and provide healthcare advice',
        minMarks: 70,
        isHighDemand: false,
        demandGrowth: 11
      },
      {
        name: 'Business Analyst',
        category: 'Management',
        requiredStream: streams[2]._id,
        requiredExams: [],
        requiredDegrees: [degrees[3]._id],
        coreSkills: [skills[24]._id, skills[23]._id, skills[8]._id],
        certifications: ['CBAP', 'Agile Analysis', 'Business Analytics'],
        internshipDuration: '6 months',
        jobRoles: { entry: jobRoles[18]._id, mid: jobRoles[19]._id, senior: jobRoles[20]._id },
        alternativePaths: ['Data Analyst', 'Product Manager', 'Strategy Consultant'],
        description: 'Bridge business needs with technology solutions',
        minMarks: 55,
        isHighDemand: true,
        demandGrowth: 18
      }
    ]);
    console.log('Careers created');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@futureflow.com');
    console.log('Password: admin123');
    console.log(`\n${careers.length} careers created`);
    console.log(`${jobRoles.length} job roles created`);
    console.log(`${exams.length} exams created`);
    console.log(`${skills.length} skills created`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
