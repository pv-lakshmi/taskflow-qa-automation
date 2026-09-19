#!/usr/bin/env python3
"""Select QA scenarios using changed files and explicit risk rules."""

import argparse
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--scenarios', default='qa/scenarios/approved/SCRUM-6.json', type=Path)
    parser.add_argument('--changed-file', action='append', default=[])
    args = parser.parse_args()
    scenario_set = json.loads(args.scenarios.read_text(encoding='utf-8'))
    changed = ' '.join(args.changed_file)

    if any(token in changed for token in ('controller', 'service', 'model', 'repository', 'application.properties')):
        selected = scenario_set['scenarios']
        reason = 'application behavior or persistence changed; run all approved API scenarios'
    else:
        selected = [item for item in scenario_set['scenarios'] if 'smoke' in item['tags'] or 'validation' in item['tags']]
        reason = 'no direct application-layer change detected; run smoke and validation coverage'

    print(json.dumps({
        'schemaVersion': '1.0',
        'sourceRequirement': scenario_set['sourceRequirement'],
        'reason': reason,
        'scenarioIds': [item['scenarioId'] for item in selected],
        'tags': sorted({tag for item in selected for tag in item['tags']})
    }, indent=2))


if __name__ == '__main__':
    main()