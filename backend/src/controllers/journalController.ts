
import { Request, Response } from 'express';

export const getJournal = (req: Request, res: Response) => {
  res.send('Get Journal');
};

export const createJournal = (req: Request, res: Response) => {
  res.send('Create Journal');
};

export const getJournals = (req: Request, res: Response) => {
  res.send('Get Journals');
};

export const deleteJournal = (req: Request, res: Response) => {
  res.send('Delete Journal');
};

export const exportJournals = (req: Request, res: Response) => {
  res.send('Export Journals');
};

export const reportDistress = (req: Request, res: Response) => {
  res.send('Report Distress');
};
