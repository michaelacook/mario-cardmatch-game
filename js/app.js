const app = new Vue({
    el: '#matchGame',
    data: {
        cards: null,
        allowClick: true,
        started: false,
        active: false,
        matchesCount: 0,
        win: null,
        gameOver: false,
        previousCard: '',
        currentCard: '',
        numberOfMatches: '',
        fails: 0,
        sound: sound,
    },
    methods: {
        runGameSequence: function(index){
            if (this.active) {
                if (!this.cards[index].matched) {
                    if (this.allowClick) {
                        this.flipCard(index);
                        if (!this.previousCard) {
                            if (this.sound.allowSound) {
                                this.sound.gameSounds.click.play();
                            }
                        }
                        this.assignCardTrackers(index);
                        if (this.currentCard) {
                            this.toggleAllowClicks();
                            this.checkIfMatch();
                            this.gameWin();
                            this.gameover();
                        }
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
                if (this.sound.allowSound) {
                    this.sound.gameSounds.noMatch.play();
                }
                return;
            } else {
                if (this.currentCard.card.name == this.previousCard.card.name) {
                    if (!this.currentCard.card.matched &&
                        !this.previousCard.card.matched) {
                        this.cards[this.previousCard.i].matched = true;
                        this.cards[this.currentCard.i].matched = true;
                        this.matchesCount++;
                        if (this.sound.allowSound) {
                            this.sound.gameSounds.match.play();
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
            if (this.sound.allowSound) {
                this.sound.gameSounds.noMatch.play();
            }
            this.fails++;
            const id = setTimeout(() => {
                app.flipNonMatch();
                app.resetCardTrackers();
                app.toggleAllowClicks();
            }, 1500);
        },
        toggleAllowClicks: function() {
            this.allowClick = !this.allowClick;
        },
        flipNonMatch: function() {
            if (!this.gameOver) {
                this.previousCard.card.flipped = false;
                this.currentCard.card.flipped = false;
            }
        },
        gameWin: function() {
            if (this.matchesCount === 9) {
                this.active = false;
                this.win = true;
                if (this.sound.backgroundMusic) {
                    this.sound.stopMusic();
                }
                if (this.sound.allowSound) {
                    this.sound.gameSounds.match.play();
                    setTimeout(() => {
                        this.sound.gameSounds.win.play();
                    }, 400);
                }
                this.flipUnflipped();
            }
        },
        gameover: function() {
            if (!this.win) {
                if (this.fails === 5) {
                    this.active = false;
                    this.win = false;
                    this.gameOver = true;
                    if (this.sound.backgroundMusic) {
                        this.sound.stopMusic();
                    }
                    if (this.sound.allowSound) {
                        this.sound.gameSounds.noMatch.play();
                        setTimeout(() => {
                            this.sound.gameSounds.gameOver.play();
                        }, 650);
                    }
                }
            }
        },
        flipUnflipped: function() {
            this.cards.forEach((card) => {
                if (!card.flipped) {
                    card.flipped = true;
                }
            });
        },
        start: function() {
            this.generateShuffledCards();
            this.started = true;
            this.active = true;
            this.gameOver = false;
            this.fails = 0;
            if (this.win) {
                this.win = null;
            }
            if (!this.allowClick) {
                this.allowClick = true;
            }
            if (this.matchesCount) {
                this.matchesCount = 0;
            }
            if (this.sound.allowSound) {
                this.sound.startMusic();
            }
        },
    },
    mounted: function() {
        this.start();
    },
});
