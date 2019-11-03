const app = new Vue({
    el: '#matchGame',
    data: {
        cards: '',
        gameSounds: audio,
        backgroundMusic: audio.supermario3,
        allowClick: true,
        allowSound: true,
        started: false,
        active: false,
        matchesCount: 0,
        win: false,
        previousCard: '',
        currentCard: '',
        numberOfMatches: ''
    },
    methods: {
        runGameSequence: function(index){
            if (!this.cards[index].matched) {
                if (this.allowClick) {
                    this.flipCard(index);
                    if (!this.previousCard) {
                        if (this.allowSound) {
                            this.gameSounds.coin.play();
                        }
                    }
                    this.assignCardTrackers(index);
                    if (this.currentCard) {
                        this.toggleAllowClicks();
                        this.checkIfMatch();
                        this.checkForWin();
                        this.gameWin();
                    }
                }
            }
        },
        randomize: function(arr) {
            let newArray = arr.slice();
            for (let i = newArray.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        },
        generateShuffledCards: function() {
            const cards = [];
            // Create base of six sets of matches first
            for (let i = 0; i < 6; i++) {
                cards.push({ ...items[i] }, { ...items[i] });
            }
            // Add three more sets of matches randomly
            while (cards.length < 18) {
                let randint = Math.floor(Math.random() * 6);
                cards.push({ ...items[randint] }, { ...items[randint] });
            }
            // Randomized cards and assign
            this.cards = this.randomize(cards);
        },
        // getNumberOfMatches: function() {
        //     const names = ['oneup', 'mushroom', 'flower', 'star', 'coin10', 'coin20'];
        //     let matches = 0;
        //     for (let i = 0; i <= this.cards.length; i++) {
        //         const name = names[i];
        //         let count = 0;
        //         for (let j = 0; j <= this.cards.length; j++) {
        //             if (this.cards[j] !== undefined) {
        //                 if (this.cards[j].name == name) {
        //                     count++;
        //                 }
        //             }
        //         }
        //         if (count > 0) {
        //             if (count % 2 !== 0) {
        //                 count = (count - (count % 2)) / 2;
        //             } else {
        //                 even = true;
        //                 count = count / 2;
        //             }
        //             matches += count;
        //         }
        //     }
        //     return matches;
        // },
        assignCardTrackers: function(index) {
            if (!this.previousCard) {
                if (!this.cards[index].matched) {
                    this.previousCard = {
                        card: this.cards[index],
                        i: index
                    };
                }
            } else if (this.previousCard) {
                if (!this.cards[index].matched) {
                    if (index != this.previousCard.i) {
                        this.currentCard = {
                            card: this.cards[index],
                            i: index
                        }
                    }
                }
            }
        },
        resetCardTrackers: function() {
            this.previousCard = '';
            this.currentCard = '';
        },
        flipCard: function(index) {
            this.cards[index].flipped = !this.cards[index].flipped;
        },
        checkIfMatch: function() {
            if (this.currentCard.i == this.previousCard.i) {
                if (this.allowSound) {
                    this.gameSounds.noMatch.play();
                }
                return;
            } else {
                if (this.currentCard.card.name == this.previousCard.card.name) {
                    if (!this.currentCard.card.matched &&
                        !this.previousCard.card.matched) {
                        this.cards[this.previousCard.i].matched = true;
                        this.cards[this.currentCard.i].matched = true;
                        this.matchesCount++;
                        if (this.allowSound) {
                            this.gameSounds.match.play();
                        }
                        this.resetCardTrackers();
                        this.toggleAllowClicks();
                    }
                } else {
                    this.notMatch();
                }
            }
        },
        notMatch: function() {
            if (this.allowSound) {
                app.gameSounds.noMatch.play();
            }
            const id = setTimeout(function() {
                app.flipNonMatch();
                app.resetCardTrackers();
                app.toggleAllowClicks();
            }, 1500);
        },
        toggleAllowClicks: function() {
            this.allowClick = !this.allowClick;
        },
        toggleAllowSounds: function() {
            if (event.target.value == 1) {
                this.allowSound = true;
            } else if (event.target.value == 0) {
                this.allowSound = false;
                this.stopMusic();
            }
        },
        flipNonMatch: function() {
            this.previousCard.card.flipped = false;
            this.currentCard.card.flipped = false;
        },
        checkForWin: function() {
            if (this.matchesCount == 9) {
                this.win = true;
            }
        },
        gameWin: function() {
            if (this.win) {
                if (this.backgroundMusic) {
                    this.stopMusic();
                }
                if (this.allowSound) {
                    this.gameSounds.match.play();
                    setTimeout(function() {
                        app.gameSounds.win.play();
                    }, 400);
                }
                this.flipUnflipped();
                this.active = false;
            }
        },
        flipUnflipped: function() {
            this.cards.forEach(function(card) {
                if (!card.flipped) {
                    card.flipped = true;
                }
            });
        },
        start: function() {
            this.generateShuffledCards();
            this.started = true;
            this.active = true;
            if (this.win) {
                this.win = false;
            }
            if (!this.allowClick) {
                this.allowClick = true;
            }
            if (this.matchesCount) {
                this.matchesCount = 0;
            }
            this.startMusic();
        },
        stop: function() {
            this.allowClick = false;
            this.started = false;
            this.resetCardTrackers();
            this.matchesCount = 0;
            this.cards = '';
            if (this.backgroundMusic) {
                this.stopMusic();
            }
        },
        pause: function() {
            this.active = false;
            if (this.allowSound) {
                this.gameSounds.pause.play();
            }
            if (this.allowClick) {
                this.toggleAllowClicks();
            }
            this.backgroundMusic.pause();
        },
        resume: function() {
            this.active = true;
            this.toggleAllowClicks();
            if (this.allowSound) {
                this.gameSounds.pause.play();
                this.backgroundMusic.play();
            }
        },
        startMusic: function() {
            if (this.allowSound) {
                if (this.backgroundMusic) {
                    this.backgroundMusic.play();
                }
                this.backgroundMusic.loop = true;
            }
        },
        stopMusic: function() {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.loop = false;
        },
        changeBackgroundMusic: function() {
            if (this.backgroundMusic) {
                this.stopMusic();
            }
            switch(event.target.value) {
                case 'supermario1':
                    this.backgroundMusic = this.gameSounds.supermario1;
                    break;
                case 'supermario2':
                    this.backgroundMusic = this.gameSounds.supermario2;
                    break;
                case 'supermario3':
                    this.backgroundMusic = this.gameSounds.supermario3;
                    break;
                case 'none':
                    this.stopMusic();
                    this.backgroundMusic = '';
                    break;
            }
            if (this.backgroundMusic) {
                this.startMusic();
            }
        },
        changeBackgroundColor: function() {
            const body = document.querySelector('body');
            switch(event.target.value) {
                case 'light':
                    body.style.backgroundColor = 'white';
                    break;
                case 'night':
                    body.style.backgroundColor = '#3E3E3E';
                    break;
            }
        }
    }
});
