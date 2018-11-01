/**
 * Filters component properties that are safe to use in the DOM.
 */
export function domProps(props = {}) {
  const safe = {};
  for (const name in props) {
    // Skip properties with uppercase letters (except for className)
    if (!/^([a-z-]+|className)$/.test(name))
      continue;
    // Skip non-string values
    const value = props[name];
    if (typeof value !== 'string')
      continue;
    // Keep all others
    safe[name] = value;
  }
  return safe;
}

/**
 * Determines the display name of a component
 * https://reactjs.org/docs/higher-order-components.html
 */
export function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

/**
 * Creates a task queue that enforces a minimum time between tasks.
 * Optionally, new tasks can cause any old ones to be dropped.
 */
export function createTaskQueue({ timeBetween = 0, drop = false } = {}) {
  let queue = [], scheduler = 0;

  // Runs all queued tasks, with the required minimum time in between
  async function runQueuedTasks() {
    if (queue.length === 0) {
      scheduler = 0;
    }
    else {
      scheduler = setTimeout(runQueuedTasks, timeBetween);
      const { run, resolve, reject } = queue.shift();
      try {
        resolve(await run());
      }
      catch (error) {
        reject(error);
      }
    }
  }

  return {
    /** Schedules the given task(s) */
    schedule: function schedule(functions) {
      // Schedule a single task
      if (!Array.isArray(functions))
        return schedule([functions])[0];

      // Create the tasks and their result promises
      const tasks = [];
      const results = functions.map(run =>
        new Promise((resolve, reject) =>
          tasks.push({ run, resolve, reject })));

      // Schedule the tasks
      if (drop)
        queue = tasks;
      else
        queue.push(...tasks);
      if (!scheduler)
        runQueuedTasks();
      return results;
    },

    /** Forgets pending tasks.
        Returns a boolean indicating whether there were any. */
    clear: function () {
      const hadPendingTasks = queue.length > 0;
      queue = [];
      return hadPendingTasks;
    },
  };
}
