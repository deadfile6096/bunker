document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('warningModal');
    const startButton = document.getElementById('startButton');
    const readyButton = document.getElementById('readyButton');
    const survivalDays = document.getElementById('survivalDays');
    const resultModal = document.getElementById('resultModal');
    const resultContent = document.getElementById('resultContent');
    const resultText = document.getElementById('resultText');
    const restartGame = document.getElementById('restartGame');

    // Audio elements
    const backgroundMusic = document.getElementById('backgroundMusic');
    const startSound = document.getElementById('startSound');

    // Set volume levels
    backgroundMusic.volume = 0.3; // 30% volume for background music
    startSound.volume = 0.5; // 50% volume for sound effects

    // Items data with their costs and effects
    const items = {
        '111': { cost: 30, radiation: -50, health: 10 },
        '222': { cost: 50, radiation: -100 },
        '333': { cost: 40, strength: 30, survival: 30 },
        '444': { cost: 20, luck: 20 },
        '555': { cost: 35, strength: 25, survival: 15 },
        '666': { cost: 15, health: -25, survival: 25 },
        '777': { cost: 45, health: 100 },
        '113': { cost: 25, style: 50, lung: -20, zombie_attract: 100 },
        '112': { cost: 35, electronics: 30, survival: 15, stealth: -10 },
        '888': { cost: 60, navigation: 40, social: -30, selfie_death: 20 },
        '999': { cost: 30, chill: 70, reaction: -40, mutant_friend: 90 },
        '114': { cost: 10, protection: 100, confidence: 50, speed: -20 },
        '1001': { cost: 25, morale: 80, food_chance: 15, stealth: -25 },
        '1002': { cost: 5, motivation: 200, speed: 50, focus: -30 },
        '1003': { cost: 35, calmness: 90, panic_resistance: 60, danger_reaction: -40 },
        '1004': { cost: 40, mutant_block: 70, motivation: 30, hearing: -50 },
        '1005': { cost: 20, coolness: 100, stress_resistance: 50, lung_health: -30, stamina: -20 },
        '1006': { cost: 30, comfort: 85, energy: 40, milk_chance: 25, speed: -15 },
        '1007': { cost: 45, stealth: 60, cold_protection: 40, radiation_protection: 30 },
        '1008': { cost: 55, combat_aggression: 150, pain_resistance: 80, burn_urge: 200, diplomacy: -30 },
        '1009': { cost: 15, concentration: 95, panic_resistance: 60, shooting_accuracy: 40, reaction_speed: -10 },
        '1010': { cost: 100, trading_luck: 300, tech_chance: 100, elderly_trust: -50, buy_dip_urge: 500 },
        '1011': { cost: 420, innovation: 250, rocket_building: 180, twitter_addiction: 90, earth_attachment: -60, rename_urge: 400 },
        '1012': { cost: 300, street_cred: 500, genz_trade: 200, fashion_confidence: 150, stealth: -80, logic: -90 }
    };

    let selectedItems = new Set();
    let totalCaps = 1000;
    const capsCountElement = document.getElementById('capsCount');

    // Timer and stats elements
    const countdownTimer = document.getElementById('countdownTimer');
    const survivorCount = document.getElementById('survivorCount');
    const timeLeft = document.getElementById('timeLeft');

    // Timer variables
    let timeRemaining = 15 * 60; // 15 minutes in seconds
    let timerInterval;

    const deathReasons = [
        'You were caught in a radioactive storm.',
        'You ran out of food and water.',
        'A mutant creature found your shelter.',
        'You got lost in the wasteland.',
        'You were ambushed by raiders.',
        'You succumbed to radiation poisoning.',
        'You fell into an abandoned bunker trap.',
        'You froze during the nuclear winter.',
        'You were bitten by a radioactive rat.',
        'You trusted the wrong survivor.'
    ];

    // Timer functions
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function updateTimer() {
        if (timeRemaining > 0) {
            timeRemaining--;
            countdownTimer.textContent = formatTime(timeRemaining);
            timeLeft.textContent = formatTime(timeRemaining);

            // Change color as time runs out
            if (timeRemaining <= 60) { // Last minute
                countdownTimer.style.color = '#ff0000';
                countdownTimer.style.animation = 'timerBlink 0.5s infinite';
            } else if (timeRemaining <= 300) { // Last 5 minutes
                countdownTimer.style.color = '#ff6600';
            }
        } else {
            clearInterval(timerInterval);
            countdownTimer.textContent = "00:00";
            timeLeft.textContent = "00:00";
            // Could trigger automatic game over here
        }
    }

    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Update survivor count randomly
    function updateSurvivorCount() {
        const currentCount = parseInt(survivorCount.textContent.replace(',', ''));
        const newCount = currentCount + Math.floor(Math.random() * 5) + 1;
        survivorCount.textContent = newCount.toLocaleString();
    }

    // Generate random SOL addresses for leaderboard
    function generateRandomAddress() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 17; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result + '...';
    }

    function updateLeaderboard() {
        const rows = document.querySelectorAll('.mini-row');
        rows.forEach(row => {
            const addressSpan = row.querySelector('.mini-address');
            if (Math.random() < 0.3) { // 30% chance to update address
                addressSpan.textContent = generateRandomAddress();
            }
        });
    }

    // Close warning modal and start timer
    startButton.addEventListener('click', () => {
        // Play start sound
        startSound.play().catch(e => console.log('Failed to play start sound:', e));

        // Ensure background music is playing
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(e => console.log('Failed to play background music:', e));
        }

        modal.style.display = 'none';

        // Start the countdown timer
        startTimer();

        // Update survivor count every 3-7 seconds
        setInterval(updateSurvivorCount, Math.random() * 4000 + 3000);

        // Update leaderboard every 8-15 seconds
        setInterval(updateLeaderboard, Math.random() * 7000 + 8000);
    });

    // Handle item selection
    document.querySelectorAll('.inventory-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            const itemId = slot.dataset.item;
            const itemData = items[itemId];

            if (selectedItems.has(itemId)) {
                selectedItems.delete(itemId);
                totalCaps += itemData.cost;
                capsCountElement.textContent = totalCaps;
                slot.classList.remove('selected');
            } else if (totalCaps >= itemData.cost) {
                selectedItems.add(itemId);
                totalCaps -= itemData.cost;
                capsCountElement.textContent = totalCaps;
                slot.classList.add('selected');
            } else {
                alert('Not enough caps! You need ' + itemData.cost + ' caps for this item.');
            }
        });
    });

    // Calculate survival days
    readyButton.addEventListener('click', () => {
        if (selectedItems.size === 0) {
            alert('Select at least one item to survive!');
            return;
        }

        // Simple 50/50 chance system
        const survived = Math.random() < 0.5; // 50% chance

        if (survived) {
            // If survived, random years from 1 to 10
            const years = Math.floor(Math.random() * 10) + 1;
            resultContent.classList.remove('result-fail');
            resultContent.classList.add('result-success');
            resultText.textContent = `Congratulations! You survived for ${years} year${years > 1 ? 's' : ''}!`;
        } else {
            resultContent.classList.remove('result-success');
            resultContent.classList.add('result-fail');
            const reason = deathReasons[Math.floor(Math.random() * deathReasons.length)];
            resultText.textContent = `Sorry, you died: ${reason}`;
        }
        resultModal.style.display = 'flex';
    });

    // Function to reset the game
    function resetGameState() {
        selectedItems.clear();
        totalCaps = 1000;
        capsCountElement.textContent = totalCaps;

        // Reset all inventory slots
        document.querySelectorAll('.inventory-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Reset timer
        clearInterval(timerInterval);
        timeRemaining = 15 * 60;
        countdownTimer.textContent = formatTime(timeRemaining);
        timeLeft.textContent = formatTime(timeRemaining);
        countdownTimer.style.color = '#ff0000';
        countdownTimer.style.animation = 'timerBlink 1s infinite';
        startTimer();
    }

    // Handle restart button
    restartGame.addEventListener('click', () => {
        resultModal.style.display = 'none';
        resetGameState();
    });
});