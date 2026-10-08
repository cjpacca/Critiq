async function run() {
  const q = "The Witcher";
  const res = await fetch(`https://www.speedrun.com/api/v1/games?name=${encodeURIComponent(q)}&max=1`);
  const d = await res.json();
  console.log("GAME:", JSON.stringify(d.data.map(i => ({id: i.id, title: i.names?.international, type: 'game'}))));
}
run();
