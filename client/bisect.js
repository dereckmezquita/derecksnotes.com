const fs = require('fs');
async function bisect(filepath) {
  const remarkMath = (await import('remark-math')).default;
  const remarkGfm = (await import('remark-gfm')).default;
  const rehypeMathJax = (await import('rehype-mathjax')).default;
  const { compileMDX } = require('next-mdx-remote/rsc');
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');

  let lo = 14,
    hi = lines.length;
  while (hi - lo > 3) {
    const mid = Math.floor((lo + hi) / 2);
    try {
      await compileMDX({
        source: lines.slice(0, mid).join('\n'),
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeMathJax]
          }
        }
      });
      lo = mid;
    } catch {
      hi = mid;
    }
  }
  console.log('File: ' + filepath);
  console.log('Fail at lines ' + lo + '-' + hi + ':');
  for (let i = Math.max(0, lo - 2); i < Math.min(lines.length, hi + 2); i++)
    console.log(i + 1 + ': ' + lines[i]);
  console.log('---');
}

const files = process.argv.slice(2);
(async () => {
  for (const f of files) await bisect(f);
})();
