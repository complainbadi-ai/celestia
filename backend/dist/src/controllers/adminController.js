"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHoroscope = exports.updateHoroscope = exports.getMetrics = exports.updateReportStatus = exports.getDistressReports = exports.getUsers = void 0;
const getUsers = (req, res) => {
    res.send('Get Users');
};
exports.getUsers = getUsers;
const getDistressReports = (req, res) => {
    res.send('Get Distress Reports');
};
exports.getDistressReports = getDistressReports;
const updateReportStatus = (req, res) => {
    res.send('Update Report Status');
};
exports.updateReportStatus = updateReportStatus;
const getMetrics = (req, res) => {
    res.send('Get Metrics');
};
exports.getMetrics = getMetrics;
const updateHoroscope = (req, res) => {
    res.send('Update Horoscope');
};
exports.updateHoroscope = updateHoroscope;
const createHoroscope = (req, res) => {
    res.send('Create Horoscope');
};
exports.createHoroscope = createHoroscope;
