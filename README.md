# Agent-Pilled

Company homepage for [agent-pilled.com](https://agent-pilled.com/), with a
separate GitHub Pages deployment from the product site.

- **AI Agents:** [agents.agent-pilled.com](https://agents.agent-pilled.com/).
  Open-source agents for tasks with independent review. In development; coding
  is the initial workflow. Microsoft Teams and non-code work are planned.
  The product source remains in [agent-pilled/ai-agents](https://github.com/agent-pilled/ai-agents).
- **Engineering Analytics:** a future product direction, not an available
  service. Its scope and implementation have not been established.

## Development

The site is plain HTML and CSS, with system fonts and no scripts or build step.
Use Node 24 and the pinned pnpm version:

```sh
pnpm install --frozen-lockfile
pnpm check
python3 -m http.server --directory site 8768
```

`pnpm check` validates the HTML and checks local assets, fragment links and the
custom 404 at nested missing addresses. CI runs it on each pull request. The
Pages workflow repeats those checks before publishing `site/` after a merge
to `main`.

GitHub Pages must be configured to use GitHub Actions with the custom domain
`agent-pilled.com`. Domain and HTTPS settings belong to the repository's Pages
configuration; a `CNAME` file is ignored with custom Actions deployments.
DNS must point the apex and `www` to GitHub Pages while preserving mail records.

## License

[Apache-2.0](LICENSE)
