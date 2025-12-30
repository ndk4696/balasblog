const fs = require('fs');
const path = require('path');

// Configuration
const postsDirectory = path.join(__dirname, 'posts');
const outputFile = path.join(__dirname, 'posts.json');

// Helper to parse the metadata between --- and ---
function parseFrontmatter(content) {
    const match = content.match(/^---([\s\S]*?)---/);
    if (!match) return null;

    const metadataBlock = match[1];
    const metadata = {};
    
    const lines = metadataBlock.split('\n');
    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            value = value.replace(/^"|"$/g, '');
            metadata[key] = value;
        }
    });

    return metadata;
}

// UPDATED CLEANER: Strict "After StartFragment" Logic
function getExcerpt(content, title) {
    // 1. Remove the frontmatter block
    let body = content.replace(/^---[\s\S]*?---/, '').trim();

    // 2. CHECK: Does "StartFragment" exist?
    // If yes, we strictly take everything AFTER it.
    if (body.includes("StartFragment")) {
        // Split by "StartFragment" and take the second part
        const parts = body.split("StartFragment");
        if (parts.length > 1) {
            // Join the rest back together (in case StartFragment appears twice)
            body = parts.slice(1).join(" ");
        }
    }

    // 3. Remove the immediate closing comment arrow "-->" if it exists
    // (Because usually StartFragment is inside )
    body = body.replace(/-->/g, '');

    // 4. Remove basic HTML tags (like <p>, <xml>) so they don't show up in text
    // We use new RegExp to be safe
    const tagRegex = new RegExp('<[^>]*>', 'g');
    body = body.replace(tagRegex, ' ');

    // 5. Remove leftover brackets just in case
    body = body.replace(/[<>]/g, '');

    // 6. Split into lines to remove duplicate title
    let lines = body.split('\n');
    lines = lines.filter(line => line.trim().length > 0);

    if (lines.length > 0 && title) {
        const firstLine = lines[0].trim().toLowerCase().replace(/^[#\s*]+/, '').replace(/[*]+$/, '');
        const cleanTitle = title.trim().toLowerCase();

        // If first line matches title, remove it
        if (firstLine === cleanTitle || firstLine.includes(cleanTitle)) {
            lines.shift();
        }
    }

    // 7. Rejoin and clean up Markdown symbols
    body = lines.join(' ').trim();
    body = body.replace(/[*_#]/g, ''); 

    // 8. Return first 150 characters
    return body.slice(0, 150).replace(/\s+/g, " ") + "...";
}

// Main Function
function generatePosts() {
    console.log("Reading posts from:", postsDirectory);
    
    if (!fs.existsSync(postsDirectory)) {
        console.error("Error: 'posts' directory not found.");
        return;
    }

    const files = fs.readdirSync(postsDirectory);
    const posts = [];

    files.forEach(filename => {
        if (filename.endsWith('.md')) {
            const filePath = path.join(postsDirectory, filename);
            const content = fs.readFileSync(filePath, 'utf-8');

            const metadata = parseFrontmatter(content);
            
            if (metadata) {
                const title = metadata.title || "No Title";
                
                posts.push({
                    id: filename, 
                    title: title,
                    date: metadata.date || new Date().toISOString(),
                    genre: metadata.genre || "General",
                    readTime: metadata.readTime || "1 min",
                    image: metadata.thumbnail || "/image/webicon.png", 
                    
                    // Call the cleaner function
                    excerpt: getExcerpt(content, title), 
                    
                    contentUrl: `view-article.html?post=${filename}` 
                });
            }
        }
    });

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
    console.log(`✅ Success! Generated posts.json with ${posts.length} articles.`);
}

generatePosts();