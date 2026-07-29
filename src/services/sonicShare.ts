/**
 * Sonic Share Service: Transmits & receives stash location payloads via Web Audio acoustic tones.
 */

// Frequency constants for FSK audio transmission
const PREAMBLE_FREQ = 1850; // Hz - Start burst signal
const BASE_DATA_FREQ = 1000; // Hz - Base offset for characters
const FREQ_STEP = 30; // Hz per char code offset
const POSTAMBLE_FREQ = 2500; // Hz - End burst signal
const TONE_DURATION_MS = 140; // Duration per character tone

export class SonicShareService {
  private audioCtx: AudioContext | null = null;
  private listening = false;
  private micStream: MediaStream | null = null;

  private initCtx() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Transmits a location code as acoustic frequency tones through the device speaker.
   */
  async transmitCode(code: string, onProgress?: (percent: number) => void): Promise<void> {
    this.initCtx();
    if (!this.audioCtx) return;

    const cleanStr = code.toLowerCase().trim();
    const totalSteps = cleanStr.length + 2; // Preamble + chars + postamble

    const playFreqTone = (freq: number, durationMs: number): Promise<void> => {
      return new Promise((resolve) => {
        if (!this.audioCtx) return resolve();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (durationMs / 1000) - 0.01);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + (durationMs / 1000));

        setTimeout(resolve, durationMs);
      });
    };

    // 1. Preamble Burst
    if (onProgress) onProgress(0);
    await playFreqTone(PREAMBLE_FREQ, 220);

    // 2. Data Tones
    for (let i = 0; i < cleanStr.length; i++) {
      const charCode = cleanStr.charCodeAt(i);
      const freq = BASE_DATA_FREQ + charCode * FREQ_STEP;
      if (onProgress) onProgress(Math.round(((i + 1) / totalSteps) * 100));
      await playFreqTone(freq, TONE_DURATION_MS);
    }

    // 3. Postamble Burst
    if (onProgress) onProgress(100);
    await playFreqTone(POSTAMBLE_FREQ, 220);
  }

  /**
   * Starts listening through microphone for incoming acoustic tone signals.
   */
  async startListening(onDetectedCode: (code: string) => void): Promise<void> {
    if (this.listening) return;

    try {
      this.initCtx();
      if (!this.audioCtx) return;

      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioCtx.createMediaStreamSource(this.micStream);
      const analyser = this.audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      this.listening = true;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const sampleRate = this.audioCtx.sampleRate;

      let receivingState: 'IDLE' | 'READING' = 'IDLE';
      let decodedChars: string[] = [];
      let lastCharTime = 0;

      const checkSpectrum = () => {
        if (!this.listening) return;

        analyser.getByteFrequencyData(dataArray);

        // Find peak frequency
        let maxVal = 0;
        let maxBinIndex = 0;
        for (let i = 0; i < bufferLength; i++) {
          if (dataArray[i] > maxVal) {
            maxVal = dataArray[i];
            maxBinIndex = i;
          }
        }

        const peakFreq = (maxBinIndex * sampleRate) / analyser.fftSize;
        const now = Date.now();

        // Threshold check for clear tone detection
        if (maxVal > 140) {
          // Check for preamble signal
          if (Math.abs(peakFreq - PREAMBLE_FREQ) < 50) {
            receivingState = 'READING';
            decodedChars = [];
            lastCharTime = now;
          } else if (receivingState === 'READING') {
            // Check for postamble signal
            if (Math.abs(peakFreq - POSTAMBLE_FREQ) < 50) {
              receivingState = 'IDLE';
              const result = decodedChars.join('');
              if (result.length > 0) {
                onDetectedCode(result);
              }
              decodedChars = [];
            } else if (now - lastCharTime > 100) {
              // Decode character tone
              const charCode = Math.round((peakFreq - BASE_DATA_FREQ) / FREQ_STEP);
              if (charCode >= 32 && charCode <= 126) {
                const char = String.fromCharCode(charCode);
                // Avoid rapid duplicates
                if (decodedChars[decodedChars.length - 1] !== char || now - lastCharTime > 250) {
                  decodedChars.push(char);
                  lastCharTime = now;
                }
              }
            }
          }
        }

        if (this.listening) {
          requestAnimationFrame(checkSpectrum);
        }
      };

      requestAnimationFrame(checkSpectrum);
    } catch (err) {
      console.error('Sonic listener error:', err);
      throw err;
    }
  }

  /**
   * Stops microphone listening.
   */
  stopListening() {
    this.listening = false;
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
  }
}

export const sonicShare = new SonicShareService();
