# get-the-feel Remote PC Deployment

This follows the shared remote-PC pattern in
`/Users/jaeyoungkang/mirror-mind/references/remote-pc-deploy/README.md`.
On the shared remote PC, this service uses the existing Cloudflare named tunnel
and adds one ingress hostname for `get-the-feel.artificialmind.kr`.

## Shape

- repo path on remote PC: `/root/.openclaw/workspace/repos/get-the-feel`
- public URL: `https://get-the-feel.artificialmind.kr/`
- app service: `get-the-feel.service`
- local port: `127.0.0.1:8772`
- Cloudflare tunnel service: shared `cloudflared-agent-arena.service`
- tunnel name: `agent-arena` (shared remote-PC tunnel)
- smoke check: `http://127.0.0.1:8772/`

The service is a static Next export served from `out/` with Python's built-in
HTTP server. GitHub Pages path checks remain in the product quality gate, but
the remote-PC deployment itself serves the app at the root of its tunnel
hostname unless `BASE_PATH` is set in `/etc/get-the-feel.env`.

## Required GitHub Secrets

- `GET_THE_FEEL_SSH_HOST`
- `GET_THE_FEEL_SSH_USER`
- `GET_THE_FEEL_SSH_KEY`

Optional:

- `GET_THE_FEEL_SSH_PORT`

## First-Time Remote Bootstrap

```bash
mkdir -p /root/.openclaw/workspace/repos
cd /root/.openclaw/workspace/repos
git clone git@github.com:jaeyoungkang/get-the-feel.git

# optional; only if the tunnel hostname should serve under a subpath
cat >/etc/get-the-feel.env <<'EOF'
# BASE_PATH=
PORT=8772
EOF

# On the shared remote PC, add this ingress before the final 404 rule in
# /root/.cloudflared/config.yml:
#
# - hostname: get-the-feel.artificialmind.kr
#   service: http://127.0.0.1:8772

bash /root/.openclaw/workspace/repos/get-the-feel/deploy/deploy.sh
```

After that, pushes to `main` run the same deploy script over SSH.

## Manual Operations

```bash
systemctl status get-the-feel.service
systemctl status cloudflared-agent-arena.service
journalctl -u get-the-feel.service -n 80
journalctl -u cloudflared-agent-arena.service -n 80
bash /root/.openclaw/workspace/repos/get-the-feel/deploy/deploy.sh
```
