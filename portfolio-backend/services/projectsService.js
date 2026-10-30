const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

// Normalize a raw payload before handing it to Mongoose.
const normalizePayload = (data) => {
    const payload = { ...data };

    if (typeof payload.technologies === 'string') {
        payload.technologies = payload.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (typeof payload.features === 'string') {
        payload.features = payload.features.split(',').map((f) => f.trim()).filter(Boolean);
    }
    if (payload.completedAt === '' || payload.completedAt === 'null' || payload.completedAt === undefined) {
        payload.completedAt = null;
    }

    return payload;
};

const getAllProjects = async ({
    page = 1,
    limit = 6,
    category,
    search,
    sort = '-createdAt',
    featured,
    isVisible,
}) => {
    const query = {};

    if (isVisible !== undefined) {
        query.isVisible = isVisible === 'true' || isVisible === true;
    }

    if (category && category !== 'All') query.category = category;
    if (featured !== undefined) query.isFeatured = featured === 'true' || featured === true;

    // Text search across title, description, and technologies
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { technologies: { $elemMatch: { $regex: search, $options: 'i' } } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
        Project.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
        Project.countDocuments(query),
    ]);

    return { projects, total };
};

const getProjectById = async (id) => {
    const project = await Project.findById(id).lean();
    if (!project) throw { statusCode: 404, message: 'Project not found.' };
    return project;
};

const createProject = async (data, files = []) => {
    const payload = normalizePayload(data);

    const images = files.map((file, idx) => ({
        url: `/uploads/projects/${file.filename}`,
        caption: data[`caption_${idx}`] || '',
        isMain: idx === 0,
    }));

    const project = await Project.create({ ...payload, images });
    return project;
};

const updateProject = async (id, data, files = []) => {
    const project = await Project.findById(id);
    if (!project) throw { statusCode: 404, message: 'Project not found.' };

    const payload = normalizePayload(data);

    // Append newly uploaded images to the existing set
    if (files.length > 0) {
        const newImages = files.map((file, idx) => ({
            url: `/uploads/projects/${file.filename}`,
            caption: data[`caption_${idx}`] || '',
            isMain: false,
        }));
        payload.images = [...(project.images || []), ...newImages];

        if (project.images.length === 0 && newImages.length > 0) {
            payload.images[0].isMain = true;
        }
    }

    Object.assign(project, payload);
    await project.save();
    return project;
};

const deleteProject = async (id) => {
    const project = await Project.findById(id);
    if (!project) throw { statusCode: 404, message: 'Project not found.' };

    // Delete associated image files from disk
    if (project.images && project.images.length > 0) {
        project.images.forEach((img) => {
            const filePath = path.join(__dirname, '..', img.url);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch {
                    /* ignored */
                }
            }
        });
    }

    await project.deleteOne();
    return project;
};

const deleteProjectImage = async (projectId, imageUrl) => {
    const project = await Project.findById(projectId);
    if (!project) throw { statusCode: 404, message: 'Project not found.' };

    const imageIndex = project.images.findIndex((img) => img.url === imageUrl);
    if (imageIndex === -1) throw { statusCode: 404, message: 'Image not found in project.' };

    const filePath = path.join(__dirname, '..', imageUrl);
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch {
            /* ignored */
        }
    }

    project.images.splice(imageIndex, 1);

    if (project.images.length > 0 && !project.images.some((img) => img.isMain)) {
        project.images[0].isMain = true;
    }

    await project.save();
    return project;
};

const getCategories = async () => {
    return Project.distinct('category');
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject, deleteProjectImage, getCategories };
