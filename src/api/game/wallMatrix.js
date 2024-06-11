const wallMatrix = [
    [],
    {
        N: ['N'],
        S: ['S'],
        E: ['E'],
        w: ['W']
    },
    {
        N: {
            E: ['N','E'],
            S: ['N','S'],
            W: ['N','W']
        },
        E: {
            S: ['E','S'],
            W: ['E','W']
        },
        S: {
            W: ['S','W']
        } 
    },
    {
        nN: ['E','S','W'],
        nE: ['S','W','N'],
        nS: ['W','N','E'],
        nW: ['N','E','S']
    },
    ['N','E','S','W']
];
module.exports = wallMatrix;