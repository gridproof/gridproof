#!/usr/bin/env bash
#
# Pre-push author guard for the gridproof repo.
#
# Aborts the push unless BOTH:
#   1. every commit being pushed is authored by gridproofdev@gmail.com, AND
#   2. the ACTIVE gh account is `gridproof`.
#
# Why: the machine has multiple gh accounts and the active one keeps drifting to
# a personal account between sessions. A wrong-account push to this private repo
# either fails outright or lands under the wrong identity. This makes that
# impossible rather than caught-by-luck.
#
# Installed as .git/hooks/pre-push (see README "Development" section). git invokes
# it with: argv = <remote-name> <remote-url>, and one line per ref on stdin:
#   <local-ref> <local-sha> <remote-ref> <remote-sha>

REQUIRED_EMAIL="gridproofdev@gmail.com"
REQUIRED_GH="gridproof"
ZERO="0000000000000000000000000000000000000000"

fail() {
  echo "" >&2
  echo "❌ pre-push guard blocked this push: $1" >&2
  echo "   Expected commit author: ${REQUIRED_EMAIL}" >&2
  echo "   Expected active gh account: ${REQUIRED_GH}" >&2
  echo "   Fix: run  gh auth switch -u ${REQUIRED_GH}   (then retry the push)" >&2
  echo "" >&2
  exit 1
}

# --- 1. active gh account -------------------------------------------------
if ! command -v gh >/dev/null 2>&1; then
  fail "gh CLI not found; cannot verify the active account"
fi

# The "- Active account: true" line immediately follows the active account's
# "Logged in to github.com account <name>" line. Portable (BSD/GNU) parse.
active_gh="$(gh auth status 2>&1 \
  | grep -B1 -- "- Active account: true" \
  | grep -oE "account [A-Za-z0-9_-]+" \
  | awk '{print $2}' \
  | head -n1)"

if [ "$active_gh" != "$REQUIRED_GH" ]; then
  fail "active gh account is '${active_gh:-unknown}', not '${REQUIRED_GH}'"
fi

# --- 2. author email of every commit being pushed -------------------------
while read -r local_ref local_sha remote_ref remote_sha; do
  [ -z "$local_sha" ] && continue
  [ "$local_sha" = "$ZERO" ] && continue   # deleting a ref → nothing to check

  if [ "$remote_sha" = "$ZERO" ]; then
    # New ref: check commits not already on any remote.
    range="$local_sha --not --remotes"
  else
    range="$remote_sha..$local_sha"
  fi

  # Any author email that is NOT the required one → block.
  bad="$(git log --format='%ae' $range 2>/dev/null | grep -v -x -- "$REQUIRED_EMAIL" | sort -u)"
  if [ -n "$bad" ]; then
    fail "commit(s) authored by: $(echo "$bad" | tr '\n' ' ')"
  fi
done

exit 0
