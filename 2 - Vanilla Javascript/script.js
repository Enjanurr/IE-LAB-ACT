// ================================================
// THREE CARDS GAME - BSIT Web Dev Project
// ================================================

// DOM Elements Selection
const drawBtn = document.getElementById("draw-btn");
const p1CardElements = document.querySelectorAll(".p1-card");
const p2CardElements = document.querySelectorAll(".p2-card");
const p1ScoreEl = document.getElementById("p1-score");
const p2ScoreEl = document.getElementById("p2-score");
const resultMessageEl = document.getElementById("result-message");

// Card Config Data
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = [
    { name: "Hearts", symbol: "♥" },
    { name: "Diamonds", symbol: "♦" },
    { name: "Clubs", symbol: "♣" },
    { name: "Spades", symbol: "♠" }
];

// App State Object
const gameState = {
    p1Hand: [],
    p2Hand: [],
    p1Score: 0,
    p2Score: 0,
    isDealing: false
};

// 1. Generate one random card
function getRandomCard() {
    const randomRankIndex = Math.floor(Math.random() * ranks.length);
    const randomSuitIndex = Math.floor(Math.random() * suits.length);

    const rank = ranks[randomRankIndex];
    const suitObj = suits[randomSuitIndex];

    return {
        rank: rank,
        suit: suitObj.name,
        value: randomRankIndex + 1, // Ace=1, King=13
        display: `${rank}${suitObj.symbol}`
    };
}

// 2. Generate 3 unique cards (no duplicate card objects per round)
function generateHand(drawnCardsList) {
    const hand = [];

    while (hand.length < 3) {
        const newCard = getRandomCard();

        // Check if card is already drawn in this round
        const isDuplicate = drawnCardsList.some(
            card => card.rank === newCard.rank && card.suit === newCard.suit
        );

        if (!isDuplicate) {
            hand.push(newCard);
            drawnCardsList.push(newCard); // Store card in master list
        }
    }

    return hand;
}

// 3. Calculate sum of a 3-card hand using array reduce
function calculateHandValue(hand) {
    if (hand.length === 0) return 0;

    const totalScore = hand.reduce((sum, card) => {
        return sum + card.value;
    }, 0);

    return totalScore;
}

// 4. Determine round outcome
function determineWinner(val1, val2) {
    if (val1 > val2) {
        return "PLAYER_1";
    } else if (val2 > val1) {
        return "PLAYER_2";
    } else {
        return "DRAW";
    }
}

// 5. Render cards to the UI
function renderHand(hand, cardElements) {
    hand.forEach((card, index) => {
        const cardBox = cardElements[index];

        if (card) {
            cardBox.textContent = card.display;

            // Simple text coloring for red suits
            if (card.suit === "Hearts" || card.suit === "Diamonds") {
                cardBox.classList.add("red");
            } else {
                cardBox.classList.remove("red");
            }
        } else {
            cardBox.textContent = "";
            cardBox.classList.remove("red");
        }
    });
}

// Helper promise for time delay handling
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 6. Main dealing function
async function playRound() {
    if (gameState.isDealing) return;

    // Lock interaction
    gameState.isDealing = true;
    drawBtn.disabled = true;

    // Reset card views
    resultMessageEl.textContent = "Dealing cards...";
    renderHand([], p1CardElements);
    renderHand([], p2CardElements);

    // Track cards drawn in current round
    const roundDrawnCards = [];

    // Generate hands
    gameState.p1Hand = generateHand(roundDrawnCards);
    gameState.p2Hand = generateHand(roundDrawnCards);

    // Deal array sequence
    const sequence = [
        { card: gameState.p1Hand[0], element: p1CardElements[0] },
        { card: gameState.p1Hand[1], element: p1CardElements[1] },
        { card: gameState.p1Hand[2], element: p1CardElements[2] },
        { card: gameState.p2Hand[0], element: p2CardElements[0] },
        { card: gameState.p2Hand[1], element: p2CardElements[1] },
        { card: gameState.p2Hand[2], element: p2CardElements[2] }
    ];

    // Deal sequentially with visual delay
    for (let step of sequence) {
        step.element.textContent = step.card.display;
        if (step.card.suit === "Hearts" || step.card.suit === "Diamonds") {
            step.element.classList.add("red");
        } else {
            step.element.classList.remove("red");
        }
        await sleep(250); // 250ms delay
    }

    // Hand calculations
    const p1Total = calculateHandValue(gameState.p1Hand);
    const p2Total = calculateHandValue(gameState.p2Hand);
    const result = determineWinner(p1Total, p2Total);

    // Update persistent scores and displays
    if (result === "PLAYER_1") {
        gameState.p1Score += 1;
        resultMessageEl.textContent = `Player 1 Wins! (${p1Total} vs ${p2Total})`;
    } else if (result === "PLAYER_2") {
        gameState.p2Score += 1;
        resultMessageEl.textContent = `Player 2 Wins! (${p2Total} vs ${p1Total})`;
    } else {
        resultMessageEl.textContent = `Draw Game! (${p1Total} vs ${p2Total})`;
    }

    // Refresh UI Scores
    p1ScoreEl.textContent = gameState.p1Score;
    p2ScoreEl.textContent = gameState.p2Score;

    // Unlock button
    gameState.isDealing = false;
    drawBtn.disabled = false;
}

// Click listener
drawBtn.addEventListener("click", playRound);