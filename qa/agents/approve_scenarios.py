#!/usr/bin/env python3
"""Promote a reviewed scenario set to approved with explicit reviewer metadata."""

import argparse
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--reviewed-by', required=True)
    args = parser.parse_args()

    with args.input.open(encoding='utf-8') as file:
        scenario_set = json.load(file)

    if scenario_set.get('review', {}).get('status') != 'needs-review':
        raise ValueError('only needs-review scenario sets can be approved')
    if not scenario_set.get('scenarios'):
        raise ValueError('cannot approve an empty scenario set')

    scenario_set['review']['status'] = 'approved'
    scenario_set['review']['reviewedBy'] = args.reviewed_by
    scenario_set['review']['notes'].append('Approved for automation after explicit human review.')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open('w', encoding='utf-8') as file:
        json.dump(scenario_set, file, indent=2)
        file.write('\n')

    print(f"Approved {len(scenario_set['scenarios'])} scenarios for {args.reviewed_by}")


if __name__ == '__main__':
    main()