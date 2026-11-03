# Decisions

- **2026-11-02: blog posts come from the free Hashnode RSS feed, fetched at build time,** because Hashnode's GraphQL API became paid (Pro) on 2026-05-13 and the feed has no CORS headers, so the browser cannot read it. The build keeps the previous file if the download fails.
- **2026-11-02: contact email and GitHub links moved to the new account** (`Haruru0-0`); Malware Classifier added as a project and to the terminal.
- **Mirrored to GitLab** by a workflow on every push and nightly (script lives in the dev-tools repo).
- **PortaGen** is a separate project that generalises this site for other people; changes here may be ported there.
