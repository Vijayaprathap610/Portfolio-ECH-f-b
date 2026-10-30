const Skill = require('../models/Skill');

const getAllSkills = async (filters = {}) => {
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.isVisible !== undefined) query.isVisible = filters.isVisible === 'true' || filters.isVisible === true;

    const skills = await Skill.find(query).sort({ category: 1, order: 1, name: 1 }).lean();

    // Group by category
    const grouped = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return { skills, grouped };
};

const getSkillById = async (id) => {
    const skill = await Skill.findById(id).lean();
    if (!skill) throw { statusCode: 404, message: 'Skill not found.' };
    return skill;
};

const createSkill = async (data) => {
    const existing = await Skill.findOne({ name: data.name, category: data.category });
    if (existing) {
        throw { statusCode: 409, message: `Skill '${data.name}' already exists in ${data.category}.` };
    }
    const skill = await Skill.create(data);
    return skill;
};

const updateSkill = async (id, data) => {
    const skill = await Skill.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!skill) throw { statusCode: 404, message: 'Skill not found.' };
    return skill;
};

const deleteSkill = async (id) => {
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) throw { statusCode: 404, message: 'Skill not found.' };
    return skill;
};

const reorderSkills = async (orderedIds) => {
    const updates = orderedIds.map((id, index) =>
        Skill.findByIdAndUpdate(id, { order: index }, { new: true })
    );
    await Promise.all(updates);
    return { message: 'Skills reordered successfully.' };
};

module.exports = { getAllSkills, getSkillById, createSkill, updateSkill, deleteSkill, reorderSkills };
