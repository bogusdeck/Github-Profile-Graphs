# GitHub Profile Graphs

Use these APIs to add dynamic, retro-styled graphs to your GitHub README.md file!

## 📊 Available Graphs

### 📈 GitHub Statistics
```markdown
![GitHub Stats](https://your-domain.com/api/readme/stats)
```

### 📊 Languages Used
```markdown
![Languages](https://your-domain.com/api/readme/languages)
```

### 🗂️ Repositories Per Language
```markdown
![Repos per Language](https://your-domain.com/api/readme/repos-per-language)
```

### 💻 Commits Per Repository
```markdown
![Commits per Repo](https://your-domain.com/api/readme/commits-per-repo)
```

### ⭐ Stars Per Repository
```markdown
![Stars per Repo](https://your-domain.com/api/readme/stars-per-repo)
```

## 🎨 Features

- **Retro 8-bit Style**: Pixel-perfect graphs with retro gaming aesthetics
- **Real-time Data**: Fetches live data from GitHub API
- **Optimized for README**: Compact sizes perfect for profile pages
- **Green Theme**: Consistent retro green color scheme
- **Caching**: 1-hour cache for fast loading
- **Error Handling**: Graceful fallbacks if API fails

## 🚀 Quick Setup

1. **Deploy this Next.js app** to Vercel, Netlify, or any platform
2. **Replace `your-domain.com`** with your actual domain
3. **Add to your README.md** file
4. **Set up GitHub Token** in environment variables:

```bash
GITHUB_TOKEN=your_github_personal_access_token
```

## 📝 Example README.md

```markdown
# 👋 Hello World!

## 📊 My GitHub Activity

![GitHub Stats](https://your-domain.com/api/readme/stats)
![Languages](https://your-domain.com/api/readme/languages)
![Repos per Language](https://your-domain.com/api/readme/repos-per-language)
![Commits per Repo](https://your-domain.com/api/readme/commits-per-repo)
![Stars per Repo](https://your-domain.com/api/readme/stars-per-repo)

---

📈 *These graphs update automatically with my latest GitHub activity!*
```

## 🔧 Customization

### Graph Colors
All graphs use a retro green theme:
- **Primary**: `#89c201` (light green)
- **Secondary**: `#a5d234` (lighter green)
- **Background**: `#28370d` (dark green)
- **Border**: `#000000` (black)

### Graph Sizes
- **Stats**: 500x200px
- **Bar Charts**: 480-500x280px
- **Optimized** for GitHub README display

## 🌟 Benefits

- **Dynamic**: Always shows your latest data
- **Professional**: Clean, consistent design
- **Fast**: Cached responses for quick loading
- **Reliable**: Error handling and fallbacks
- **Unique**: Stand out with retro gaming style

## 📱 Mobile Responsive

All graphs scale perfectly on mobile devices and maintain their pixelated aesthetic.

---