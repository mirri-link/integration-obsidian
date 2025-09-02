export const stylesTemplate = `

<style>
a[href="#internal-link"] { color: #6b6b6b; text-decoration: none !important; }
.frontmatter { border: 1px solid #e2e3e4; border-radius: 0.5rem; padding: 0.4rem; margin: 0.5rem 0; margin-bottom: 3rem; }
.frontmatter table { width: 100%; margin: 0; border: 0; }
.frontmatter table tr { border: none; background: none !important; }
.frontmatter table th, .frontmatter table td { text-align: left; padding: 0.4rem 0.9rem; border: 0; font-size: 0.825rem; color: #333; background: none; }
.frontmatter table th { color: #888; font-weight: normal; }
.frontmatter .tag { border: 1px solid #e2e3e4; border-radius: 2rem; padding: 0.2rem 0.45rem; }
.markdown-body mark { padding: 2px 4px; border-radius: 3px; background: #fff0a2; }
.markdown-body h1:has( + .frontmatter) { border-bottom: none; margin-bottom: 0; }
.markdown-body img { box-shadow: 0 0 2px rgba(0, 0, 0, 0.05); }
input[type="checkbox"] { width: 14px; height: 14px; position: relative; appearance: none; }
input[type="checkbox"]:before { position: absolute; left: 0; top: 0; content:""; width: 14px; height: 14px; display:block; border-radius: 4px; background: #fff; border: 1px solid #bbb; }
input[type="checkbox"]:checked:before { background: #3e80f0; border: 1px solid #3e80f0; }
input[type="checkbox"]:checked:after { content: "✓"; position: absolute; left: 0; top: 0; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; line-height: 1; font-weight: 600; }
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
