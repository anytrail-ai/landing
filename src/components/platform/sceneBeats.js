// Timing for the module scenes (SceneViews.jsx). A scene is one screen that
// changes in small beats; `beats` is how long each beat is held, in ms, and
// `steps` is the beat each of the three step pills starts at. What a beat
// shows is decided in the scene's view, purely from the beat number, so a
// pill can jump anywhere and the screen is always in a consistent state.
export const SCENE_BEATS = {
  crm: {
    beats: [900, 900, 1300, 1300, 800, 600, 600, 1400, 1100, 1300, 2800],
    steps: [0, 4, 8],
  },
  sourcing: {
    beats: [1100, 900, 700, 600, 600, 900, 1300, 1200, 1000, 2800],
    steps: [0, 2, 7],
  },
  inventory: {
    beats: [800, 600, 600, 600, 1000, 1500, 1700, 800, 800, 1200, 2800],
    steps: [0, 5, 7],
  },
  ar: {
    beats: [1000, 900, 1000, 1000, 1100, 1100, 1500, 2800],
    steps: [0, 2, 6],
  },
}
