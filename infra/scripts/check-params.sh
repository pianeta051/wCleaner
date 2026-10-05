#!/usr/bin/env bash
# Fails if the infra/params/*.json files don't all have the same keys, if a key
# isn't a parameter of infra/main.yaml, or if a file's Environment doesn't match
# its name. Needs no AWS credentials, so it can run on any PR.
set -euo pipefail

cd "$(dirname "$0")/../.."

# Parameter names of main.yaml: the 2-space-indented keys under the top-level
# "Parameters:" block. (Not a YAML parser, so CloudFormation tags like !Ref
# don't get in the way.)
template_keys=$(awk '
  /^[^ #]/ { in_params = ($0 ~ /^Parameters:/); next }
  in_params && /^  [A-Za-z0-9]+:/ { sub(/^  /, ""); sub(/:.*/, ""); print }
' infra/main.yaml | sort)

status=0
reference=""
reference_keys=""
for file in infra/params/*.json; do
  env=$(basename "$file" .json)
  if ! keys=$(jq -er 'map(.ParameterKey) | .[]' "$file" | sort); then
    echo "$file: not a [{\"ParameterKey\": ..., \"ParameterValue\": ...}] list" >&2
    status=1
    continue
  fi

  dupes=$(uniq -d <<<"$keys")
  if [ -n "$dupes" ]; then
    echo "$file: duplicated keys: $(echo $dupes)" >&2
    status=1
  fi

  unknown=$(comm -23 <(uniq <<<"$keys") <(echo "$template_keys"))
  if [ -n "$unknown" ]; then
    echo "$file: keys that aren't parameters of infra/main.yaml: $(echo $unknown)" >&2
    status=1
  fi

  if [ -z "$reference" ]; then
    reference=$file
    reference_keys=$keys
  elif [ "$keys" != "$reference_keys" ]; then
    echo "$file: keys differ from $reference" >&2
    diff <(echo "$reference_keys") <(echo "$keys") | sed 's/^/  /' >&2 || true
    status=1
  fi

  file_env=$(jq -r 'map(select(.ParameterKey == "Environment"))[0].ParameterValue // empty' "$file")
  if [ "$file_env" != "$env" ]; then
    echo "$file: Environment is \"$file_env\", expected \"$env\"" >&2
    status=1
  fi
done

if [ -z "$reference" ]; then
  echo "No infra/params/*.json files" >&2
  exit 1
fi
if [ $status -eq 0 ]; then
  echo "Params files OK"
fi
exit $status
