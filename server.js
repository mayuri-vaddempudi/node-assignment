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
const dogs = require("./data/dogs");


// --------- Server ----------
http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;


    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

    // ---------- HOME ----------
    if (path === "/") {
        const workingCount = dogs.filter(d => d.type === "working").length;
        const toyCount = dogs.filter(d => d.type === "toy").length;
        res.write(navigation());
        res.write(header("Welcome to the Dog Server"));
        res.write(`
            <p>This site demonstrates a Node.js server using http, url, and fs.</p>
            <h3>How to navigate / test routes:</h3>
            <ul>
                <li>/about - content loaded from about.html(http://localhost:3333/about / http://127.0.0.1:3333/about)</li>
                <li>/contact - content loaded from contact.txt(http://localhost:3333/contact / http://127.0.0.1:3333/contact)</li>
                <li>/dogs - default route, asks you to use query parameters(http://localhost:3333/dogs / http://127.0.0.1:3333/dogs)</li>
                <li>/dogs?type=working - shows all working dogs(http://localhost:3333/dogs?type=working / http://127.0.0.1:3333/dogs?type=working)</li>
                <li>/dogs?type=toy - shows all toy dogs(http://localhost:3333/dogs?type=toy / http://127.0.0.1:3333/dogs?type=toy)</li>
            </ul>
        `);

        res.write(`
            <section>
                <h2>About This Site</h2>
                <p>
                    This is a simple Node.js HTTP server built without Express.
                    It demonstrates routing, query parameters, and file reading.
                </p>
            </section>
        
            <section>
                <h2>Dog Statistics</h2>
                <ul>
                    <li>Total dogs: ${dogs.length}</li>
                    <li>Working dogs: ${workingCount}</li>
                    <li>Toy dogs: ${toyCount}</li>
                </ul>
            </section>
        `);

        res.write(`
            <section>
                <h2>Featured Dogs ⭐</h2>
                <p><strong>${dogs[0].name}</strong> – ${dogs[0].job}</p>
                <p><strong>${dogs[1].name}</strong> – ${dogs[1].job}</p>
            </section>
        `);
        res.write(`
            <section>
                <h2>Server Info</h2>
                <ul>
                    <li>Node version: ${process.version}</li>
                    <li>Server port: 3333</li>
                    
                </ul>
            </section>
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
        res.write(header("All Dogs"));

        // Hint message (shown only when no filter is used)
        if (!query.type && !query.limit) {
            res.write("<p>Please choose a dog type using ?type=working or ?type=toy</p>");
        }

        // FILTER LOGIC GOES HERE
        let dogsToShow = dogs;

        if (query.type) {
            dogsToShow = dogsToShow.filter(d => d.type === query.type);
            res.write(`<h3>Type: ${query.type}</h3>`);
        }

        // Render results
        if (dogsToShow.length === 0) {
            res.write("<p>No dogs found.</p>");
        } else {
            dogsToShow.forEach(dog => {
                res.write(`
                    <div style="margin-bottom: 10px;">
                        <strong>${dog.name}</strong><br>
                        Type: ${dog.type}<br>
                        Job: ${dog.job}<br>
                        Origin: ${dog.origin}<br>
                        Lifespan: ${dog.lifespan}<br>
                        Description: ${dog.description}
                    </div>
                `);
            });
        }

        res.write(footer("Dogs footer"));
        res.end();


        // ---------- 404 ----------
    } else {
        res.write("<h1>404 – Page not found</h1>");
        res.end();
    }

}).listen(3333, () => console.log("Server running on port 3333"));
