# Bear Blog Plugins

Some plugins to enhance [bearblog.dev](https://bearblog.dev)

## Plugins

### Paste URL as Markdown link

Turns a pasted URL in the Bear dashboard editor into a Markdown link with the page title.

Example:

`https://example.com` becomes:

`[Page Title](https://example.com)`

If the page title cannot be fetched (common with CORS restrictions), it falls back to the site hostname.

- View source file: [`paste-url-as-markdown-link.js`](https://github.com/saugatkhadka/bearblog-plugins/blob/main/plugins/paste-url-as-markdown-link.js)
- Script tag (for https://bearblog.dev/dashboard/customise/):

```html
<script src="https://cdn.jsdelivr.net/gh/saugatkhadka/bearblog-plugins@main/plugins/paste-url-as-markdown-link.js"></script>
```

## Install in Bear Blog

1. Open `https://bearblog.dev/dashboard/customise/`.
2. Copy the script tag from above.
3. In **Footer** (Dashboard → Settings → Custom dashboard), paste it as a script tag, for example:

```html
<script src="https://cdn.jsdelivr.net/gh/saugatkhadka/bearblog-plugins@main/plugins/paste-url-as-markdown-link.js"></script>
```

4. Save.

## Bear script locations

- Dashboard/editor plugin: it runs inside your Bear dashboard/editor while you write. 
    
    Example: URL paste helpers. Add it at `https://bearblog.dev/dashboard/customise/` (Footer).
- Blog-rendered plugin (premium): it runs inside your public blog pages for visitors. 
    
    Example: blog search, reading time, code copy button. Add it at `https://bearblog.dev/<your-blog>/dashboard/directives/`.
