const path = require("node:path");
const glob = require("node:glob");
const fs = require("fs-extra");

const copyOrMove = (action, pattern, base_dir, dest_dir, options) => {
  // expected pattern format: 'source_filepath detination_filepath'

  return new Promise(async (resolve, reject) => {
    // destination directory is considered as source directory if not set
    if (!dest_dir) {
      dest_dir = base_dir;
    }

    // transform into ['source_filepath', 'destination_filepath']
    const paths = pattern.trim().split(/\s/);

    const from_filepath = path.resolve(base_dir, paths[0]);
    const to_filepath = path.join(dest_dir, paths[1] || "");

    // from_filepath can be a pattern expression also be strong and detect that
    const from_filepaths = glob.sync(from_filepath);

    // copy each files found via glob pattern
    const files = [];
    for (let i = 0; i < from_filepaths.length; i++) {
      const filepath = from_filepaths[i];
      const parsed = path.parse(filepath);
      files.push(
        `Action ${action}: ${filepath} to ${path.join(
          to_filepath,
          parsed.base
        )}`
      );
      await fs[`${action}`](
        filepath,
        path.join(to_filepath, parsed.base),
        options
      );
    }

    return resolve({ files });
  });
};

const rename = (pattern, base_dir, dest_dir, options) => {
  // expected pattern format: 'source_filepath detination_filepath'

  return new Promise(async (resolve, reject) => {
    // destination directory is considered as source directory if not set
    if (!dest_dir) {
      dest_dir = base_dir;
    }

    // transform into ['source_filepath', 'destination_filepath']
    const paths = pattern.trim().split(/\s/);

    const from_filepath = path.resolve(base_dir, paths[0]);
    const to_filepath = path.join(dest_dir, paths[1] || "");

    // from_filepath can be a pattern expression also be strong and detect that
    const from_filepaths = glob.sync(from_filepath);

    // copy each files found via glob pattern
    const files = [];
    for (let i = 0; i < from_filepaths.length; i++) {
      const filepath = from_filepaths[i];
      files.push(`Action rename: ${filepath} to ${path.join(to_filepath)}`);
      await fs.move(filepath, path.join(to_filepath), options);
    }

    return resolve({ files });
  });
};

const deleteOrRemove = (pattern, base_dir, options) => {
  return new Promise(async (resolve, reject) => {
    const filepaths = glob.sync(path.resolve(base_dir, pattern));
    const files = [];

    for (let i = 0; i < filepaths.length; i++) {
      const filepath = filepaths[i];
      try {
        files.push(`Action delete: ${filepath}`);
        // trouble with await/async (throw ENOENT error) also delete synchronously
        await fs.remove(filepath);
      } catch (err) {
        return reject(err);
      }
    }

    return resolve({ files });
  });
};

module.exports.copy = (
  pattern = null,
  base_dir = null,
  dest_dir = null,
  options = {}
) => {
  return copyOrMove("copy", pattern, base_dir, dest_dir, options);
};

module.exports.move = (
  pattern = null,
  base_dir = null,
  dest_dir = null,
  options = {}
) => {
  return copyOrMove("move", pattern, base_dir, dest_dir, options);
};

module.exports.rename = (
  pattern = null,
  base_dir = null,
  dest_dir = null,
  options = {}
) => {
  return rename(pattern, base_dir, dest_dir, options);
};

module.exports.delete = (pattern = [], base_dir = null, options = {}) => {
  return deleteOrRemove(pattern, base_dir, options);
};

// alias for delete
module.exports.remove = (pattern = [], base_dir = null, options = {}) => {
  return deleteOrRemove(pattern, base_dir, options);
};
