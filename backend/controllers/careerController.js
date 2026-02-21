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

    // Fetch all careers
    const careers = await Career.find(query)
      .populate('requiredStream')
      .populate('requiredExams')
      .populate('requiredDegrees')
      .populate('coreSkills')
      .populate('jobRoles.entry')
      .populate('jobRoles.mid')
      .populate('jobRoles.senior')
      .lean();

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

    res.json(filteredCareers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id)
      .populate('requiredStream')
      .populate('requiredExams')
      .populate('requiredDegrees')
      .populate('coreSkills')
      .populate({
        path: 'jobRoles.entry',
        populate: { path: 'requiredSkills' }
      })
      .populate({
        path: 'jobRoles.mid',
        populate: { path: 'requiredSkills' }
      })
      .populate({
        path: 'jobRoles.senior',
        populate: { path: 'requiredSkills' }
      })
      .lean();

    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

    res.json(career);
  } catch (error) {
    console.error('Error fetching career by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.generatePersonalizedRoadmap = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const careers = await Career.find()
      .populate('requiredStream')
      .populate('requiredDegrees')
      .populate('coreSkills')
      .populate('jobRoles.entry')
      .populate('jobRoles.mid')
      .populate('jobRoles.senior')
      .lean();

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
      const careerSkills = (career.coreSkills?.map(s => s.name) || career.skills_required || []).map(s => String(s).toLowerCase());
      
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
      const allSkills = career.coreSkills?.map(s => s.name) || career.skills_required || [];
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
          entry: career.jobRoles?.entry?.salaryRange || { min: 300000, max: 500000 },
          mid: career.jobRoles?.mid?.salaryRange || { min: 800000, max: 1500000 },
          senior: career.jobRoles?.senior?.salaryRange || { min: 2000000, max: 4000000 }
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
      .populate('requiredStream')
      .populate('requiredExams')
      .populate('requiredDegrees')
      .populate('coreSkills')
      .populate('jobRoles.entry')
      .populate('jobRoles.mid')
      .populate('jobRoles.senior')
      .sort({ demandGrowth: -1 });

    // Filter by user's education level and interests if profile exists
    let filteredCareers = careers;
    if (profile) {
      filteredCareers = careers.filter(career => {
        const matchesInterest = profile.interests.some(interest =>
          career.name.toLowerCase().includes(interest.toLowerCase()) ||
          career.category.toLowerCase().includes(interest.toLowerCase())
        );
        return matchesInterest || true; // Show all if no match
      });
    }

    res.json(filteredCareers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
