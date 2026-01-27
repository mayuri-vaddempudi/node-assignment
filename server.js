const http = require("http");
const url = require("url");
const fs = require("fs");

// --------- Helper functions ----------
const header = title => `<header><h1>${title}</h1></header>`;
const footer = text => `<footer><p>${text}</p></footer>`;
const navigation = () => `
<nav>
  <a href="/">Home</a> 
  <a href="/about">About</a> 
  <a href="/contact">Contact</a> 
  <a href="/dogs">Dogs</a> 
  <a href="/dogs?type=working">Working Dogs</a> 
  <a href="/dogs?type=toy">Toy Dogs</a>
</nav>
`;

// --------- Data array ----------
const dogs = [
    { id: 1, type: "working", name: "Border Collie", job: "Herding" },
    { id: 2, type: "working", name: "German Shepherd", job: "Police" },
    { id: 3, type: "toy", name: "Chihuahua", job: "Lap warming" },
    { id: 4, type: "toy", name: "Pomeranian", job: "Looking cute" }
];

// --------- Server ----------
http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;


    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

    // ---------- HOME ----------
    if (path === "/") {
        res.write(navigation());
        res.write(header("Welcome to the Dog Server"));
        res.write(`
            <p>This site demonstrates a Node.js server using http, url, and fs.</p>
            <h3>How to navigate / test routes:</h3>
            <ul>
                <li>/about - content loaded from about.html</li>
                <li>/contact - content loaded from contact.txt</li>
                <li>/dogs - default route, asks you to use query parameters</li>
                <li>/dogs?type=working - shows all working dogs</li>
                <li>/dogs?type=toy - shows all toy dogs</li>
            </ul>
        `);
        res.write(footer("Home page footer"));
        res.end();

        // ---------- ABOUT (HTML FILE) ----------
    } else if (path === "/about") {
        res.write(navigation());
        fs.readFile("./content/about.html", "utf8", (err, data) => {
            if (err) {
                res.write("<h1>Error loading About page</h1>");
                res.end();
                return;
            }
            res.write(data);
            res.end();
        });

        // ---------- CONTACT (TEXT FILE) ----------
    } else if (path === "/contact") {
        res.write(navigation());
        fs.readFile("./content/contact.txt", "utf8", (err, data) => {
            if (err) {
                res.write("<p>Error loading contact info</p>");
                res.end();
                return;
            }
            res.write(header("Contact"));
            res.write(`<pre>${data}</pre>`);
            res.write(footer("Contact footer"));
            res.end();
        });

        // ---------- DOGS (QUERIES + DATA) ----------
    } else if (path === "/dogs") {
        res.write(navigation());
        res.write(header("Dogs"));

        if (query.type) {
            const filteredDogs = dogs.filter(d => d.type === query.type);
            if (filteredDogs.length === 0) {
                res.write(`<p>No dogs found for type: ${query.type}</p>`);
            } else {
                filteredDogs.forEach(dog => {
                    res.write(`<p><strong>${dog.name}</strong> ${dog.job}</p>`);
                });
            }
        } else {
            res.write("<p>Please choose a dog type using ?type=working or ?type=toy</p>");
        }

        res.write(footer("Dogs footer"));
        res.end();

        // ---------- 404 ----------
    } else {
        res.write("<h1>404 – Page not found</h1>");
        res.end();
    }

}).listen(3333, () => console.log("Server running on port 3333"));
