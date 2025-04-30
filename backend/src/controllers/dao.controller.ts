import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { DAO } from '../models/dao.model';
import { Proposal } from '../models/proposal.model';
import { Vote } from '../models/vote.model';

export const getAllDAOs = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const daos = await DAO.find()
    .sort(sort as string)
    .skip(skip)
    .limit(Number(limit))
    .populate('creator', 'name handle avatar');

  const total = await DAO.countDocuments();

  res.status(200).json({
    status: 'success',
    data: {
      daos,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});

export const getDAO = catchAsync(async (req: Request, res: Response) => {
  const dao = await DAO.findById(req.params.id)
    .populate('creator', 'name handle avatar')
    .populate('members', 'name handle avatar');

  if (!dao) {
    throw new ApiError(404, 'DAO not found');
  }

  res.status(200).json({
    status: 'success',
    data: { dao }
  });
});

export const createDAO = catchAsync(async (req: Request, res: Response) => {
  const dao = await DAO.create({
    ...req.body,
    creator: req.user.id,
    members: [req.user.id]
  });

  res.status(201).json({
    status: 'success',
    data: { dao }
  });
});

export const updateDAO = catchAsync(async (req: Request, res: Response) => {
  const dao = await DAO.findById(req.params.id);

  if (!dao) {
    throw new ApiError(404, 'DAO not found');
  }

  if (dao.creator.toString() !== req.user.id) {
    throw new ApiError(403, 'You are not authorized to update this DAO');
  }

  Object.assign(dao, req.body);
  await dao.save();

  res.status(200).json({
    status: 'success',
    data: { dao }
  });
});

export const createProposal = catchAsync(async (req: Request, res: Response) => {
  const dao = await DAO.findById(req.params.id);

  if (!dao) {
    throw new ApiError(404, 'DAO not found');
  }

  if (!dao.members.includes(req.user.id)) {
    throw new ApiError(403, 'You must be a member to create proposals');
  }

  const proposal = await Proposal.create({
    ...req.body,
    dao: req.params.id,
    proposer: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { proposal }
  });
});

export const voteOnProposal = catchAsync(async (req: Request, res: Response) => {
  const { proposalId } = req.params;
  const { vote } = req.body;

  const proposal = await Proposal.findById(proposalId);

  if (!proposal) {
    throw new ApiError(404, 'Proposal not found');
  }

  const dao = await DAO.findById(proposal.dao);

  if (!dao) {
    throw new ApiError(404, 'DAO not found');
  }

  if (!dao.members.includes(req.user.id)) {
    throw new ApiError(403, 'You must be a member to vote');
  }

  const existingVote = await Vote.findOne({
    proposal: proposalId,
    voter: req.user.id
  });

  if (existingVote) {
    throw new ApiError(400, 'You have already voted on this proposal');
  }

  await Vote.create({
    proposal: proposalId,
    voter: req.user.id,
    vote
  });

  res.status(200).json({
    status: 'success',
    message: 'Vote recorded successfully'
  });
});

export const getProposalVotes = catchAsync(async (req: Request, res: Response) => {
  const votes = await Vote.find({ proposal: req.params.proposalId })
    .populate('voter', 'name handle avatar');

  res.status(200).json({
    status: 'success',
    data: { votes }
  });
});
