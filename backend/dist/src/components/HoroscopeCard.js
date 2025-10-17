"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const HoroscopeCard = ({ sign, content, actionPrompt, tags }) => {
    return (<react_native_1.View>
      <react_native_1.Text>Horoscope for {sign}</react_native_1.Text>
      <react_native_1.Text>{content}</react_native_1.Text>
      <react_native_1.Text>{actionPrompt}</react_native_1.Text>
      <react_native_1.Text>Tags: {tags.join(', ')}</react_native_1.Text>
    </react_native_1.View>);
};
exports.default = HoroscopeCard;
