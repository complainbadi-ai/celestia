
import { Request, Response } from 'express';

export const getHoroscope = (req: Request, res: Response) => {
  res.send('Get Horoscope');
};

export const getTodayHoroscope = (req: Request, res: Response) => {
  res.send('Get Today Horoscope');
};

export const getHoroscopeByDate = (req: Request, res: Response) => {
  res.send('Get Horoscope By Date');
};

export const getCompatibility = (req: Request, res: Response) => {
  res.send('Get Compatibility');
};

export const getCrisisResources = (req: Request, res: Response) => {
  res.send('Get Crisis Resources');
};
