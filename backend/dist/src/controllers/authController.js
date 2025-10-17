"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.exportUserData = exports.updateProfile = exports.getCurrentUser = exports.logout = exports.register = exports.login = void 0;
const login = (req, res) => {
    res.send('Login');
};
exports.login = login;
const register = (req, res) => {
    res.send('Register');
};
exports.register = register;
const logout = (req, res) => {
    res.send('Logout');
};
exports.logout = logout;
const getCurrentUser = (req, res) => {
    res.send('Get Current User');
};
exports.getCurrentUser = getCurrentUser;
const updateProfile = (req, res) => {
    res.send('Update Profile');
};
exports.updateProfile = updateProfile;
const exportUserData = (req, res) => {
    res.send('Export User Data');
};
exports.exportUserData = exportUserData;
const deleteAccount = (req, res) => {
    res.send('Delete Account');
};
exports.deleteAccount = deleteAccount;
