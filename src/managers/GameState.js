export const GameState = {
  isRunning: true,
  isFinished: false,

  reset() {
    this.isRunning = true;
    this.isFinished = false;
  },

  finish() {
    this.isRunning = false;
    this.isFinished = true;
  },
};
