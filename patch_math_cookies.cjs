const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldTambah = `'konsep_tambah': {
                flashcards: [
                    {front: '1 + 1', back: '2', icon: '🍪 + 🍪'},
                    {front: '2 + 1', back: '3', icon: '🍪🍪 + 🍪'},
                    {front: '3 + 2', back: '5', icon: '🍪🍪🍪 + 🍪🍪'},
                    {front: '4 + 2', back: '6', icon: '🍪🍪🍪🍪 + 🍪🍪'},
                    {front: '5 + 3', back: '8', icon: '🍪🍪🍪🍪🍪 + 🍪🍪🍪'},
                    {front: '5 + 5', back: '10', icon: '🍪🍪🍪🍪🍪 + 🍪🍪🍪🍪🍪'}
                ],`;

const newTambah = `'konsep_tambah': {
                flashcards: [
                    {front: '1 + 1', back: '2', icon: '🍪&nbsp;&nbsp;&nbsp;🍪'},
                    {front: '2 + 1', back: '3', icon: '🍪🍪&nbsp;&nbsp;&nbsp;🍪'},
                    {front: '3 + 2', back: '5', icon: '🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪'},
                    {front: '4 + 2', back: '6', icon: '🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪'},
                    {front: '5 + 3', back: '8', icon: '🍪🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪🍪'},
                    {front: '5 + 5', back: '10', icon: '🍪🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪🍪🍪🍪'}
                ],`;

const oldTolak = `'konsep_penolakan': {
                flashcards: [
                    {front: '2 − 1', back: '1', icon: '🍪🍪 − 🍪'},
                    {front: '3 − 2', back: '1', icon: '🍪🍪🍪 − 🍪🍪'},
                    {front: '5 − 3', back: '2', icon: '🍪🍪🍪🍪🍪 − 🍪🍪🍪'},
                    {front: '7 − 2', back: '5', icon: '🍪🍪🍪🍪🍪🍪🍪 − 🍪🍪'},
                    {front: '10 − 5', back: '5', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 − 🍪🍪🍪🍪🍪'}
                ],`;

const newTolak = `'konsep_penolakan': {
                flashcards: [
                    {front: '2 − 1', back: '1', icon: '🍪🍪&nbsp;&nbsp;&nbsp;🍪'},
                    {front: '3 − 2', back: '1', icon: '🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪'},
                    {front: '5 − 3', back: '2', icon: '🍪🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪🍪'},
                    {front: '7 − 2', back: '5', icon: '🍪🍪🍪🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪'},
                    {front: '10 − 5', back: '5', icon: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪&nbsp;&nbsp;&nbsp;🍪🍪🍪🍪🍪'}
                ],`;

code = code.replace(oldTambah, newTambah);
code = code.replace(oldTolak, newTolak);

fs.writeFileSync('public/app-logic.js', code);
console.log('patched math cookies');
