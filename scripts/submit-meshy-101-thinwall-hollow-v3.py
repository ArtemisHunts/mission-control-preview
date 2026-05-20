#!/usr/bin/env python3
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API_DIR = ROOT / 'assets' / 'meshy' / 'api'
BASE = 'https://api.meshy.ai/openapi/v2/text-to-3d'
SLUG = '102-thinwall-open-front-hollow-asteroid-v3'
NAME = 'Mission Control thin-wall open-front hollow asteroid v3'
PURPOSE = (
    'Meshy-first retry after hollow v2 rejection: thinner shell walls, deeper irregular cavity, '
    'less slab/boolean floor read, preserved open-front asteroid silhouette.'
)
PROMPT = (
    'High-fidelity hollow asteroid base for a sci-fi command facility, open-front cutaway shell, thin rock walls, '
    'deep irregular interior cavity, fractured geological layering, asymmetrical broken rock shelves, believable stone mass, '
    'strong macro silhouette, clear interior volume for embedded structures, rugged natural asteroid exterior, '
    'production-quality hard-surface plus geology blend, no flat slab floor, no boolean-looking cut planes, '
    'no toy-like symmetry, no buildings, no ships, no characters'
)
PAYLOAD = {
    'mode': 'preview',
    'prompt': PROMPT,
    'ai_model': 'meshy-6',
    'model_type': 'standard',
    'should_remesh': False,
    'target_formats': ['glb'],
    'auto_size': False,
}


def request_json(method, url, key, payload=None):
    data = None
    headers = {'Authorization': f'Bearer {key}'}
    if payload is not None:
        data = json.dumps(payload).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', 'replace')
        raise RuntimeError(f'HTTP {e.code} {url}: {body[:1200]}')


def download(url, out):
    req = urllib.request.Request(url, headers={'User-Agent': 'mission-control-meshy-thinwall/1.0'})
    with urllib.request.urlopen(req, timeout=300) as resp:
        out.write_bytes(resp.read())


def write_create_spec():
    API_DIR.mkdir(parents=True, exist_ok=True)
    spec = {
        **PAYLOAD,
        'name': NAME,
        'purpose': PURPOSE,
    }
    out = API_DIR / f'{SLUG}.create-spec.json'
    out.write_text(json.dumps(spec, indent=2) + '\n')
    return out


def main():
    parser = argparse.ArgumentParser(description='Prepare or submit the next Meshy thin-wall hollow asteroid candidate.')
    parser.add_argument('--submit', action='store_true', help='Actually submit the Meshy task and poll for results.')
    parser.add_argument('--poll-seconds', type=int, default=900, help='Max seconds to poll after submission.')
    args = parser.parse_args()

    spec_path = write_create_spec()
    if not args.submit:
        print(json.dumps({
            'status': 'dry-run',
            'message': 'Create spec written. Re-run with --submit after confirming budget/intent.',
            'createSpec': str(spec_path.relative_to(ROOT)),
            'slug': SLUG,
        }, indent=2))
        return 0

    key = os.environ.get('MESHY_API_KEY')
    if not key:
        print('MESHY_API_KEY missing; source ~/.config/meshy/api.env first', file=sys.stderr)
        return 2

    res = request_json('POST', BASE, key, PAYLOAD)
    (API_DIR / f'{SLUG}.create-response.json').write_text(json.dumps(res, indent=2) + '\n')
    task_id = res.get('result') or res.get('id')
    if not task_id:
        raise RuntimeError(f'No task id in create response: {res}')
    print(f'created {SLUG} {task_id}', flush=True)

    deadline = time.time() + args.poll_seconds
    while time.time() < deadline:
        task = request_json('GET', f'{BASE}/{task_id}', key)
        (API_DIR / f'{SLUG}.task.json').write_text(json.dumps(task, indent=2) + '\n')
        print(f'poll {SLUG} {task.get("status")} {task.get("progress")} credits={task.get("consumed_credits")}', flush=True)
        if task.get('status') == 'SUCCEEDED':
            urls = task.get('model_urls') or {}
            glb = urls.get('glb') or task.get('model_url')
            if glb:
                download(glb, API_DIR / f'{SLUG}.meshy.glb')
            thumb = task.get('thumbnail_url')
            if thumb:
                download(thumb, API_DIR / f'{SLUG}.thumbnail.png')
            return 0
        if task.get('status') in ('FAILED', 'EXPIRED', 'CANCELED'):
            return 1
        time.sleep(15)

    print('timeout waiting for task', file=sys.stderr)
    return 1


if __name__ == '__main__':
    raise SystemExit(main())
