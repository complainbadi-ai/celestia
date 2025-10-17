"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
exports.api = {
    get: (url) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Faking API call to', url);
        return {
            data: {
                id: '1',
                zodiac_sign: 'aries',
                date: '2024-07-26',
                content: 'Today is a good day for Aries.',
                tags: ['general', 'optimism'],
                action_prompt: 'Take a walk outside.',
            },
        };
    }),
};
