"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportDistress = exports.exportJournals = exports.deleteJournal = exports.getJournals = exports.createJournal = exports.getJournal = void 0;
const getJournal = (req, res) => {
    res.send('Get Journal');
};
exports.getJournal = getJournal;
const createJournal = (req, res) => {
    res.send('Create Journal');
};
exports.createJournal = createJournal;
const getJournals = (req, res) => {
    res.send('Get Journals');
};
exports.getJournals = getJournals;
const deleteJournal = (req, res) => {
    res.send('Delete Journal');
};
exports.deleteJournal = deleteJournal;
const exportJournals = (req, res) => {
    res.send('Export Journals');
};
exports.exportJournals = exportJournals;
const reportDistress = (req, res) => {
    res.send('Report Distress');
};
exports.reportDistress = reportDistress;
