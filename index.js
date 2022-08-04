const fs = require("fs");
const cohost = require("cohost");

const titleCase = (str) => {
  return str.toLowerCase().split(' ').map((word) => {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

const get_random_color = () => {
  const data = fs.readFileSync("color.names.txt", "utf-8");
  const colors = data.split("\n").filter(d => !d.startsWith("#"));
  const color = colors[Math.floor(Math.random()*colors.length)];
  let [_, name, __, r, g, b, ___, hex] = color.split(" ");
  const tags = color.split(" ").pop().split(":");
  if (!name.startsWith('PMS')) {
    name = titleCase(name.replace(/_/g, ' '));
  }
  return [name, hex, tags];
};

(async function() {
    let user = new cohost.User();
    await user.login(process.env.COHOST_USERNAME, process.env.COHOST_PASSWORD);

    let projects = await user.getProjects();
    let project = projects.find(p => p.handle === 'coloroftheday');

    const [colorName, colorValue, tags] = get_random_color();

    await cohost.Post.create(project, {
        postState: 1,
        headline: colorName,
        adultContent: false,
        blocks: [{
          type: 'markdown',
          markdown: {
            content: `<div style="width: 100%; height: 200px; background: ${colorValue}" />`,
          },
        }],
        cws: [],
        tags: ["coloroftheday", ...tags],
    });
})();
