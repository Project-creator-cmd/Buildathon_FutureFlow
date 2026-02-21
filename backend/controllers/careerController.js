const Career = require('../models/Career');
const Profile = require('../models/Profile');

exports.getAllCareers = async (req, res) => {
  try {
    const { stream, search } = req.query;
    let query = {};

    // Filter by stream if provided
    if (stream && stream !== 'All') {
      query.stream = stream;
    }

    // Fetch all careers without populating references
    const careers = await Career.find(query).lean();

    let filteredCareers = careers;

    // Apply search filter
    if (search) {
      filteredCareers = careers.filter(career => {
        const searchLower = search.toLowerCase();
        const careerName = career.name || career.career_options?.[0] || '';
        const careerStream = career.stream || '';
        const careerDesc = career.description || '';
        
        return careerName.toLowerCase().includes(searchLower) ||
               careerStream.toLowerCase().includes(searchLower) ||
               careerDesc.toLowerCase().includes(searchLower);
      });
    }

    console.log(`Returning ${filteredCareers.length} careers`);
    res.json(filteredCareers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    console.log('=== GET CAREER BY ID ===');
    console.log('Requested ID:', req.params.id);
    console.log('ID type:', typeof req.params.id);
    
    // Check if ID is valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format');
      return res.status(400).json({ message: 'Invalid career ID format' });
    }

    // First, check if any careers exist
    const totalCareers = await Career.countDocuments();
    console.log('Total careers in database:', totalCareers);

    let career = await Career.findById(req.params.id)
      .populate('requiredStream', 'name')
      .populate('requiredExams', 'name fullName')
      .populate('requiredDegrees', 'name duration')
      .populate('coreSkills', 'name')
      .populate('jobRoles.entry jobRoles.mid jobRoles.senior', 'title salaryRange experience')
      .lean();

    console.log('Career found:', career ? 'YES' : 'NO');
    
    if (!career) {
      console.log('Career not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Career not found' });
    }

    console.log('Career data:', JSON.stringify(career, null, 2));

    // Transform new structure to old structure for frontend compatibility
    const transformedCareer = {
      _id: career._id,
      name: career.name || career.career_options?.[0] || 'Career Path',
      stream: career.stream || career.requiredStream?.name || 'N/A',
      after_10th: career.after_10th || 'Complete 10th standard and choose appropriate stream',
      entrance_exams: career.entrance_exams || career.requiredExams?.map(e => e.fullName || e.name) || [],
      degree_options: career.degree_options || career.requiredDegrees?.map(d => `${d.name} (${d.duration})`) || [],
      skills_required: career.skills_required || career.coreSkills?.map(s => s.name) || [],
      career_options: career.career_options || [career.name] || [],
      alternative_paths: career.alternative_paths || career.alternativePaths || [],
      description: career.description || career.root_path || '',
      certifications: career.certifications || [],
      internshipDuration: career.internshipDuration || 'Varies',
      jobRoles: career.jobRoles || {},
      minMarks: career.minMarks || 50,
      category: career.category || 'General'
    };

    console.log('Transformed career:', transformedCareer.name);
    res.json(transformedCareer);
  } catch (error) {
    console.error('Error fetching career by ID:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};

exports.generatePersonalizedRoadmap = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Fetch careers without populating references
    const careers = await Career.find().lean();

    console.log(`Found ${careers.length} careers for personalization`);
    console.log('Profile:', { marks: profile.tenthMarks, interests: profile.interests, strengths: profile.strengths });

    const recommendations = [];

    for (const career of careers) {
      let score = 0;
      let reason = [];
      let skillGaps = [];
      let improvements = [];

      const careerName = career.name || career.career_options?.[0] || 'Career';
      const minMarks = career.minMarks || 50;

      // Marks eligibility - more lenient
      if (profile.tenthMarks >= minMarks) {
        score += 25;
        reason.push(`Your marks (${profile.tenthMarks}%) meet the requirement`);
      } else if (profile.tenthMarks >= minMarks - 10) {
        score += 15;
        reason.push(`Your marks are close to the requirement`);
        improvements.push(`Aim for ${minMarks}% or higher`);
      }

      // Interest match - check against career name, category, and skills
      const careerText = `${careerName} ${career.category || ''} ${career.stream || ''}`.toLowerCase();
      const careerSkills = (career.skills_required || []).map(s => String(s).toLowerCase());
      
      const matchingInterests = profile.interests.filter(interest => {
        const interestLower = interest.toLowerCase();
        return careerText.includes(interestLower) || 
               careerSkills.some(skill => skill.includes(interestLower));
      });
      
      if (matchingInterests.length > 0) {
        score += matchingInterests.length * 20;
        reason.push(`Matches your interests: ${matchingInterests.join(', ')}`);
      }

      // Strength match
      const matchingStrengths = profile.strengths.filter(strength => {
        const strengthLower = strength.toLowerCase();
        return careerText.includes(strengthLower) || 
               careerSkills.some(skill => skill.includes(strengthLower));
      });
      
      if (matchingStrengths.length > 0) {
        score += matchingStrengths.length * 25;
        reason.push(`Aligns with your strengths: ${matchingStrengths.join(', ')}`);
      }

      // Give base score to all careers
      score += 10;

      // Skill gap analysis
      const allSkills = career.skills_required || [];
      allSkills.forEach(skill => {
        const skillStr = String(skill);
        const hasSkill = profile.strengths.some(s => 
          s.toLowerCase().includes(skillStr.toLowerCase()) ||
          skillStr.toLowerCase().includes(s.toLowerCase())
        );
        if (!hasSkill) {
          skillGaps.push(skillStr);
        }
      });

      // Lower threshold to show more careers
      if (score >= 10) {
        const timeline = {
          year1: 'Complete Intermediate/Diploma',
          year2: 'Prepare for entrance exams',
          year3_6: 'Complete degree program',
          year7: 'Internships and certifications',
          year8: 'Entry-level position',
          year10_12: 'Mid-level position',
          year13_15: 'Senior-level position'
        };

        const salaryProjection = {
          entry: { min: 300000, max: 500000 },
          mid: { min: 800000, max: 1500000 },
          senior: { min: 2000000, max: 4000000 }
        };

        if (reason.length === 0) {
          reason.push('This career path is available based on your profile');
        }

        recommendations.push({
          career,
          suitabilityScore: Math.min(score, 100),
          reason: reason.join('. '),
          skillGaps: skillGaps.slice(0, 5),
          improvements,
          timeline,
          salaryProjection
        });
      }
    }

    recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    const topRecommendations = recommendations.slice(0, 5);
    
    console.log(`Returning ${topRecommendations.length} recommendations`);
    res.json(topRecommendations);
  } catch (error) {
    console.error('Error generating personalized roadmap:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};

exports.getHighDemandCareers = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    
    const careers = await Career.find({ isHighDemand: true })
      .sort({ demandGrowth: -1 })
      .lean();

    // Filter by user's education level and interests if profile exists
    let filteredCareers = careers;
    if (profile) {
      filteredCareers = careers.filter(career => {
        const careerName = career.name || career.career_options?.[0] || '';
        const careerCategory = career.category || career.stream || '';
        const matchesInterest = profile.interests.some(interest =>
          careerName.toLowerCase().includes(interest.toLowerCase()) ||
          careerCategory.toLowerCase().includes(interest.toLowerCase())
        );
        return matchesInterest || true; // Show all if no match
      });
    }

    res.json(filteredCareers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get personalized career details based on user profile
exports.getPersonalizedCareerById = async (req, res) => {
  try {
    console.log('=== GET PERSONALIZED CAREER ===');
    console.log('Career ID:', req.params.id);
    console.log('User ID:', req.user._id);

    // Fetch career
    let career = await Career.findById(req.params.id)
      .populate('requiredStream', 'name')
      .populate('requiredExams', 'name fullName')
      .populate('requiredDegrees', 'name duration')
      .populate('coreSkills', 'name')
      .populate('jobRoles.entry jobRoles.mid jobRoles.senior', 'title salaryRange experience')
      .lean();

    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

    // Fetch user profile
    const profile = await Profile.findOne({ user: req.user._id });
    
    // Transform career data
    const transformedCareer = {
      _id: career._id,
      name: career.name || career.career_options?.[0] || 'Career Path',
      stream: career.stream || career.requiredStream?.name || 'N/A',
      after_10th: career.after_10th || 'Complete 10th standard and choose appropriate stream',
      entrance_exams: career.entrance_exams || career.requiredExams?.map(e => e.fullName || e.name) || [],
      degree_options: career.degree_options || career.requiredDegrees?.map(d => `${d.name} (${d.duration})`) || [],
      skills_required: career.skills_required || career.coreSkills?.map(s => s.name) || [],
      career_options: career.career_options || [career.name] || [],
      alternative_paths: career.alternative_paths || career.alternativePaths || [],
      description: career.description || career.root_path || '',
      certifications: career.certifications || [],
      internshipDuration: career.internshipDuration || 'Varies',
      jobRoles: career.jobRoles || {},
      minMarks: career.minMarks || 50,
      category: career.category || 'General'
    };

    // Add personalization if profile exists
    if (profile) {
      const personalization = {
        eligibility: {
          meetsMarksRequirement: profile.tenthMarks >= transformedCareer.minMarks,
          yourMarks: profile.tenthMarks,
          requiredMarks: transformedCareer.minMarks,
          gap: transformedCareer.minMarks - profile.tenthMarks
        },
        matchingInterests: [],
        matchingStrengths: [],
        skillGaps: [],
        recommendations: []
      };

      // Check interest matches
      const careerText = `${transformedCareer.name} ${transformedCareer.category} ${transformedCareer.stream}`.toLowerCase();
      personalization.matchingInterests = profile.interests.filter(interest =>
        careerText.includes(interest.toLowerCase())
      );

      // Check strength matches
      personalization.matchingStrengths = profile.strengths.filter(strength =>
        transformedCareer.skills_required.some(skill =>
          skill.toLowerCase().includes(strength.toLowerCase()) ||
          strength.toLowerCase().includes(skill.toLowerCase())
        )
      );

      // Identify skill gaps
      personalization.skillGaps = transformedCareer.skills_required.filter(skill =>
        !profile.strengths.some(strength =>
          skill.toLowerCase().includes(strength.toLowerCase()) ||
          strength.toLowerCase().includes(skill.toLowerCase())
        )
      );

      // Generate recommendations
      if (personalization.eligibility.meetsMarksRequirement) {
        personalization.recommendations.push('✅ You meet the minimum marks requirement!');
      } else {
        personalization.recommendations.push(`📚 Focus on improving your marks by ${Math.abs(personalization.eligibility.gap)}%`);
      }

      if (personalization.matchingInterests.length > 0) {
        personalization.recommendations.push(`🎯 Great match! This aligns with your interests in ${personalization.matchingInterests.join(', ')}`);
      }

      if (personalization.matchingStrengths.length > 0) {
        personalization.recommendations.push(`💪 You already have relevant strengths: ${personalization.matchingStrengths.join(', ')}`);
      }

      if (personalization.skillGaps.length > 0) {
        personalization.recommendations.push(`📖 Skills to develop: ${personalization.skillGaps.slice(0, 3).join(', ')}`);
      }

      transformedCareer.personalization = personalization;
    }

    console.log('Returning personalized career:', transformedCareer.name);
    res.json(transformedCareer);
  } catch (error) {
    console.error('Error fetching personalized career:', error);
    res.status(500).json({ message: error.message });
  }
};
