document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the filename from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postFilename = urlParams.get('post');

    if (!postFilename) {
        document.getElementById("article-body").innerHTML = "<p>Article not found.</p>";
        return;
    }

    // 2. Fetch the JSON List
    fetch("./posts.json")
        .then(res => res.json())
        .then(posts => {
            // Sort data Newest -> Oldest
            const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Find current article index
            const currentIndex = sortedPosts.findIndex(p => p.id === postFilename);

            if (currentIndex === -1) {
                console.error("Article not found in JSON list");
                return;
            }

            const currentPost = sortedPosts[currentIndex];

            // 3. Populate Metadata
            document.title = currentPost.title + " | Nanduri Bala Subrahmanyam"; 
            document.getElementById("article-title").textContent = currentPost.title;
            document.getElementById("article-img").src = currentPost.image;
            document.getElementById("article-genre").textContent = currentPost.genre;
            document.getElementById("article-time").textContent = currentPost.readTime;

            // 4. Setup NEXT / PREV Buttons
            // Note: Array is [Newest ... Oldest]
            // "Previous" usually means NEWER post (Index - 1)
            // "Next" usually means OLDER post (Index + 1)
            
            const prevIndex = currentIndex - 1; 
            const nextIndex = currentIndex + 1; 

            // PREVIOUS BUTTON (Left Side - Outlined)
            const prevLink = document.getElementById("prev-link");
            if (prevIndex >= 0) {
                const prevPost = sortedPosts[prevIndex];
                prevLink.href = `view-article.html?post=${prevPost.id}`;
                document.getElementById("prev-title").textContent = prevPost.title;
                
                // Add specific class
                prevLink.className = "nav-btn prev-btn"; 
                prevLink.classList.remove("hidden");
            } else {
                prevLink.classList.add("hidden");
            }

            // NEXT BUTTON (Right Side - Filled)
            const nextLink = document.getElementById("next-link");
            if (nextIndex < sortedPosts.length) {
                const nextPost = sortedPosts[nextIndex];
                nextLink.href = `view-article.html?post=${nextPost.id}`;
                document.getElementById("next-title").textContent = nextPost.title;
                
                // Add specific class
                nextLink.className = "nav-btn next-btn";
                nextLink.classList.remove("hidden");
            } else {
                nextLink.classList.add("hidden");
            }
            // 5. Fetch Content
            return fetch(`./posts/${postFilename}`);
        })
        .then(res => {
            if (!res.ok) throw new Error("Markdown file not found");
            return res.text();
        })
        .then(markdown => {
            // 6. Clean Frontmatter
            const contentStart = markdown.indexOf("---", 3); 
            let cleanContent = markdown;
            if (contentStart !== -1) {
                cleanContent = markdown.substring(contentStart + 3).trim();
            }
            
            // Clean artifacts
            cleanContent = cleanContent.replace(/StartFragment/gi, '').replace(/EndFragment/gi, '');
            
            // 7. Render Markdown
            document.getElementById("article-body").innerHTML = marked.parse(cleanContent);
        })
        .catch(err => {
            console.error(err);
            document.getElementById("article-body").innerHTML = "<p>Error loading content.</p>";
        });
});