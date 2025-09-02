export const stylesTemplate = `

<style>
a[href="#internal-link"] { color: #6b6b6b; text-decoration: none !important; }
.frontmatter { border: 1px solid #e2e3e4; border-radius: 0.5rem; padding: 0.4rem; margin: 0.5rem 0; margin-bottom: 3rem; }
.frontmatter table { width: 100%; margin: 0; border: 0; }
.frontmatter table tr { border: none; background: none !important; }
.frontmatter table th, .frontmatter table td { text-align: left; padding: 0.4rem 0.9rem; border: 0; font-size: 0.825rem; color: #333; background: none; }
.frontmatter table th { color: #888; font-weight: normal; }
.frontmatter .tag { border: 1px solid #e2e3e4; border-radius: 2rem; padding: 0.2rem 0.45rem; }
.markdown-body h1:has( + .frontmatter) { border-bottom: none; margin-bottom: 0; }
</style>
<script src="https://unpkg.com/@popperjs/core@2"></script>
<script src="https://unpkg.com/tippy.js@6"></script>
<script>
const tooltips = document.querySelectorAll('.tooltipped');
tooltips.forEach((tooltip) => {
const content = tooltip.getAttribute('title');
tooltip.removeAttribute('title');
tippy(tooltip, { content, arrow: false, theme: 'dark' });
});
</script>
`;
