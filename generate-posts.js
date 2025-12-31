const fs = require('fs');
const path = require('path');

// Configuration
const postsDirectory = path.join(__dirname, 'posts');
const outputFile = path.join(__dirname, 'posts.json');

// --- THE FIX IS HERE ---
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
            
            // 1. Remove quotes
            value = value.replace(/^"|"$/g, '');
            
            // 2. CRITICAL FIX: Trim again to remove spaces that were inside the quotes
            value = value.trim(); 
            
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
    if (body.includes("StartFragment")) {
        const parts = body.split("StartFragment");
        if (parts.length > 1) {
            body = parts.slice(1).join(" ");
        }
    }

    // 3. Remove closing comment arrow
    body = body.replace(/-->/g, '');

    // 4. Remove basic HTML tags
    const tagRegex = new RegExp('<[^>]*>', 'g');
    body = body.replace(tagRegex, ' ');

    // 5. Remove leftover brackets
    body = body.replace(/[<>]/g, '');

    // 6. Split into lines to remove duplicate title
    let lines = body.split('\n');
    lines = lines.filter(line => line.trim().length > 0);

    if (lines.length > 0 && title) {
        const firstLine = lines[0].trim().toLowerCase().replace(/^[#\s*]+/, '').replace(/[*]+$/, '');
        const cleanTitle = title.trim().toLowerCase();

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