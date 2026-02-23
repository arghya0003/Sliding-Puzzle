/**
 * Sound effects using Howler.js
 */
import { Howl } from 'howler';

// Generate click sound via AudioContext (no file needed)
function createClickSound() {
    return {
        play() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.25, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
            } catch (e) {
                // Silently fail if audio not available
            }
        },
    };
}

function createVictorySound() {
    return {
        play() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    const t = ctx.currentTime + i * 0.18;
                    osc.frequency.setValueAtTime(freq, t);
                    gain.gain.setValueAtTime(0.3, t);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
                    osc.start(t);
                    osc.stop(t + 0.35);
                });
            } catch (e) {
                // Silently fail
            }
        },
    };
}

export const clickSound = createClickSound();
export const victorySound = createVictorySound();
