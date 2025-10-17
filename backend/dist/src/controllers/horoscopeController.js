"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrisisResources = exports.getCompatibility = exports.getHoroscopeByDate = exports.getTodayHoroscope = exports.getHoroscope = void 0;
const getHoroscope = (req, res) => {
    res.send('Get Horoscope');
};
exports.getHoroscope = getHoroscope;
const getTodayHoroscope = (req, res) => {
    res.send('Get Today Horoscope');
};
exports.getTodayHoroscope = getTodayHoroscope;
const getHoroscopeByDate = (req, res) => {
    res.send('Get Horoscope By Date');
};
exports.getHoroscopeByDate = getHoroscopeByDate;
const getCompatibility = (req, res) => {
    res.send('Get Compatibility');
};
exports.getCompatibility = getCompatibility;
const getCrisisResources = (req, res) => {
    res.send('Get Crisis Resources');
};
exports.getCrisisResources = getCrisisResources;
