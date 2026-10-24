// Short cooking time for trying the game without waiting minutes.
// On by default on the dev server; force it with ?test=1 or turn it off with ?test=0.
const param = new URLSearchParams(window.location.search).get('test');

export const TEST_MODE = param === null ? import.meta.env.DEV : param !== '0';
export const TEST_SECONDS = 30;
