const spriteKeyframes = {
    archer: {
        idle: {
            animationRow: 0,
            minAnimationCol: 0,
            maxAnimationCol: 5
        },
        running: {
            animationRow: 1,
            minAnimationCol: 0,
            maxAnimationCol: 5
        },
        chargeBow: {
            N: { animationRow: 2 },
            NE: { animationRow: 3 },
            E: { animationRow: 4 },
            SE: { animationRow: 5 },

            S: { animationRow: 6 },
            SW: { animationRow: 5 },
            W: { animationRow: 4 },
            NW: { animationRow: 3 },
        },
        fireArrow: {
            N: {
                animationRow: 2,
                minAnimationCol: 6,
                maxAnimationCol: 7
            },
            NE: {
                animationRow: 3,
                minAnimationCol: 6,
                maxAnimationCol: 7
            },
            E: {
                animationRow: 4,
                minAnimationCol: 6,
                maxAnimationCol: 7
            },
            SE: {
                animationRow: 5,
                minAnimationCol: 6,
                maxAnimationCol: 7
            },
        }
    },
    goblin: {
        idle: {
            animationRow: 0,
            minAnimationCol: 0,
            maxAnimationCol: 6
        },
        running: {
            animationRow: 1,
            minAnimationCol: 0,
            maxAnimationCol: 5
        },
        attack_right: {
            animationRow: 2,
            minAnimationCol: 0,
            maxAnimationCol: 5
        },
        attack_up: {
            animationRow: 3,
            minAnimationCol: 0,
            maxAnimationCol: 5
        },
        attack_down: {
            animationRow: 4,
            minAnimationCol: 0,
            maxAnimationCol: 5
        },
    },

}
export default spriteKeyframes;
