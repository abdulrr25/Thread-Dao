import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getUserDaos = async (req, res) => {
    try {
        const { address } = req.params;
        const daos = await prisma.dao.findMany({
            where: { creatorAddress: address },
            include: {
                members: true,
                posts: true
            }
        });
        res.json(daos);
    }
    catch (error) {
        console.error('Error fetching user DAOs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getDao = async (req, res) => {
    try {
        const { id } = req.params;
        const dao = await prisma.dao.findUnique({
            where: { id },
            include: {
                members: true,
                posts: true
            }
        });
        if (!dao) {
            return res.status(404).json({ message: 'DAO not found' });
        }
        res.json(dao);
    }
    catch (error) {
        console.error('Error fetching DAO:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const createDao = async (req, res) => {
    try {
        const { name, description, creatorAddress, tokenName, tokenSymbol } = req.body;
        const dao = await prisma.dao.create({
            data: {
                name,
                description,
                creatorAddress,
                tokenName,
                tokenSymbol
            }
        });
        res.status(201).json(dao);
    }
    catch (error) {
        console.error('Error creating DAO:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const updateDao = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, tokenName, tokenSymbol } = req.body;
        const dao = await prisma.dao.update({
            where: { id },
            data: {
                name,
                description,
                tokenName,
                tokenSymbol
            }
        });
        res.json(dao);
    }
    catch (error) {
        console.error('Error updating DAO:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
