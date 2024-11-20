export async function getHighscores() {
  const response = await fetch('http://localhost:3000/api/highscores');
  const highscores = await response.json();
  console.log('Top 5 Highscores:', highscores);
  return highscores;
}
export async function saveHighscore(name, score) {
  const response = await fetch('http://localhost:3000/api/highscores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score }),
  });
  const result = await response.json();
  console.log(result.message);
}
