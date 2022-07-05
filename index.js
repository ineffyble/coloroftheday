const fetch = require("node-fetch");
const cohost = require("cohost");

//#Source https://bit.ly/2neWfJ2 
const random_hex_color_code = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return n.slice(0, 6);
};

const get_random_named_color_near = async (color) => {
  let req = await fetch(`https://www.thecolorapi.com/id?format=json&hex=${color}`);
  let res = await req.json();
  return [res.name.value, res.name.closest_named_hex];
};

(async function() {
    let user = new cohost.User();
    await user.login(process.env.USERNAME, process.env.PASSWORD);

    let [ _, __, project ] = await user.getProjects();

    const randomColor = random_hex_color_code();
    const [colorName, colorValue] = await get_random_named_color_near(randomColor);

    await cohost.Post.create(project, {
        postState: 1,
        headline: colorName,
        adultContent: false,
        blocks: [{
          type: 'markdown',
          markdown: {
            content: `<div style="width: 100%; height: 200px; background: #${colorValue}" />`,
          },
        }],
        cws: [],
        tags: ["coloroftheday"],
    });

})();
