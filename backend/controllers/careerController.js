const Career = require('../models/Career');
const Profile = require('../models/Profile');

exports.getAllCareers = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const careers = await Career.find(query)
      .populate('requiredStream')
      .populate('requiredExams')
      .populate('requiredDegrees')
      .populate('coreSkills')
      .populate('jobRoles.entry')
      .populate('jobRoles.mid')
      .populate('jobRoles.senior');

    let filteredCareers = careers;
    if (search) {
      filteredCareers = careers.filter(career =>
        career.name.toLowerCase().includes(search.toLowerCase()) ||
        career.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(filteredCareers);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      });

    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

    res.json(career);
  } catch (error) {
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
      .populate('jobRoles.senior');

    const recommendations = [];

    for (const career of careers) {
      let score = 0;
      let reason = [];
      let skillGaps = [];
      let improvements = [];

      // Marks eligibility
      if (profile.tenthMarks >= career.minMarks) {
        score += 30;
        reason.push(`Your marks (${profile.tenthMarks}%) meet the requirement`);
      } else {
        improvements.push(`Improve marks to ${career.minMarks}%`);
      }

      // Interest match
      const careerSkills = career.coreSkills.map(s => s.name.toLowerCase());
      const matchingInterests = profile.interests.filter(interest => 
        careerSkills.some(skill => skill.includes(interest.toLowerCase())) ||
        career.name.toLowerCase().includes(interest.toLowerCase())
      );
      
      if (matchingInterests.length > 0) {
        score += matchingInterests.length * 15;
        reason.push(`Matches your interests: ${matchingInterests.join(', ')}`);
      }

      // Strength match
      const matchingStrengths = profile.strengths.filter(strength => 
        careerSkills.some(skill => skill.includes(strength.toLowerCase()))
      );
      
      if (matchingStrengths.length > 0) {
        score += matchingStrengths.length * 20;
        reason.push(`Aligns with your strengths: ${matchingStrengths.join(', ')}`);
      }

      // Skill gap analysis
      career.coreSkills.forEach(skill => {
        const hasSkill = profile.strengths.some(s => 
          s.toLowerCase().includes(skill.name.toLowerCase())
        );
        if (!hasSkill) {
          skillGaps.push(skill.name);
        }
      });

      if (score >= 40) {
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
          entry: career.jobRoles.entry?.salaryRange || { min: 300000, max: 500000 },
          mid: career.jobRoles.mid?.salaryRange || { min: 800000, max: 1500000 },
          senior: career.jobRoles.senior?.salaryRange || { min: 2000000, max: 4000000 }
        };

        recommendations.push({
          career,
          suitabilityScore: Math.min(score, 100),
          reason: reason.join('. '),
          skillGaps,
          improvements,
          timeline,
          salaryProjection
        });
      }
    }

    recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    res.json(recommendations.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: error.message });
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
