#!/usr/bin/env -S deno --quiet run --allow-read --allow-run --allow-write --check=typescript
import { Obj, Str } from '@/oidlib';
import * as semver from 'std/semver/mod.ts';

const releaseTypes: Set<semver.ReleaseType> = new Set([
  'pre',
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]);

Deno.exit(await main());

async function main(): Promise<number> {
  const supportedReleaseTypesMsg = `Release type must be one of ${
    [...releaseTypes].join(', ')
  }.`;
  const releaseType = Deno.args[0];
  if (releaseType == null) {
    console.error(`Missing release type argument. ${supportedReleaseTypesMsg}`);
    return 1;
  }

  if (!isReleaseType(releaseType)) {
    console.error(
      `Unsupported release type, "${releaseType}". ${supportedReleaseTypesMsg}`,
    );
    return 1;
  }

  const pkg = JSON.parse(await Deno.readTextFile('package.json'));
  if (!isPackage(pkg)) {
    console.error('package.json missing name or version properties.');
    return 1;
  }

  const nextVer = semver.inc(pkg.version, releaseType);
  if (nextVer == null) {
    console.error(
      `Cannot compute next ${releaseType} semantic version from ${pkg.version}.`,
    );
    return 1;
  }

  let result;
  result = await git('status -z');
  if (!result.ok || !Str.isBlank(result.text)) {
    prompt(
      'Uncommitted changes detected. <enter> to continue, <ctrl-c> to cancel:',
    );
  }

  result = await git('remote update');
  if (!result.ok) {
    console.error(
      'Unable to update from remote. Check connectivity and try again.',
    );
    return 1;
  }

  result = await git('rev-parse --abbrev-ref @');
  const branch = result.text.trim();
  if (!result.ok || branch == '') {
    console.error('The active branch cannot be identified.');
    return 1;
  }

  result = await git(`rev-list -n1 @..origin/${branch}`);
  if (!result.ok || !Str.isBlank(result.text)) {
    console.error(
      `The active branch is behind origin/${branch}. Pull and try again.`,
    );
    return 1;
  }

  prompt('Test the release. <enter> to continue, <ctrl-c> to cancel:');

  result = await git('tag --list --sort version:refname v*');
  if (!result.ok) {
    console.error('Failed to list tagged versions.');
    return 1;
  }

  const gitVers = result.text.trim().split(/\s+/);
  if (gitVers.some((ver) => `v${nextVer}` == ver)) {
    console.error(`Git tag v${nextVer} is unavailable.`);
    return 1;
  }

  pkg.version = nextVer;
  await Deno.writeTextFile('package.json', JSON.stringify(pkg));

  result = await deno('fmt package.json');
  if (!result.ok) {
    console.error('Cannot format package.json.');
    return 1;
  }

  result = await git('add package.json');
  if (!result.ok) {
    console.error('Cannot stage package.json.');
    return 1;
  }

  result = await git(`commit --message v${nextVer}`);
  if (!result.ok) {
    console.error('Cannot commit package.json.');
    return 1;
  }

  prompt(
    `Ready to publish v${nextVer}. Amend commit with any changes wanted ` +
      'before tagging. <enter> to continue, <ctrl-c> to cancel:',
  );

  result = await git(`tag v${nextVer}`);
  if (!result.ok) {
    console.error(`Cannot tag v${nextVer}.`);
    return 1;
  }

  // Push the active branch and tag.
  result = await git(`push origin ${branch} v${nextVer}`);
  if (!result.ok) {
    console.error(
      `Cannot publish ${branch} and v${nextVer}. Check connectivity and try ` +
        `\`git push origin '${branch}' 'v${nextVer}'\`.`,
    );
    return 1;
  }

  return 0;
}

async function git(args: string): Promise<{ ok: boolean; text: string }> {
  const process = Deno.run({
    cmd: ['git', ...args.split(' ')],
    stdout: 'piped',
  });
  const status = await process.status();
  const out = await process.output();
  return { ok: status.success, text: new TextDecoder().decode(out) };
}

// https://github.com/denoland/deno/issues/10731
async function deno(args: string): Promise<{ ok: boolean; text: string }> {
  const process = Deno.run({
    cmd: ['deno', ...args.split(' ')],
    stdout: 'piped',
  });
  const status = await process.status();
  const out = await process.output();
  return { ok: status.success, text: new TextDecoder().decode(out) };
}

function isReleaseType(str: string): str is semver.ReleaseType {
  return releaseTypes.has(str as semver.ReleaseType);
}

function isPackage(val: unknown): val is Package {
  if (!Obj.is(val)) return false;
  return typeof val.version == 'string' && typeof val.name == 'string';
}

interface Package {
  name: string;
  version: string;
}
