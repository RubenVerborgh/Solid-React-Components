/**
 * Returns an object with only the given keys from the source.
 */
export function pick(source, keys) {
  const destination = {};
  for (const key of keys)
    destination[key] = source[key];
  return destination;
}

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
 * Creates a higher-order component with the given name.
 */
export function higherOrderComponent(name, createWrapper) {
  return Component => {
    const Wrapper = createWrapper(Component);
    Wrapper.displayName = `${name}(${getDisplayName(Component)})`;
    return Wrapper;
  };
}

/**
 * Creates a task queue that enforces a minimum time between tasks.
 * Optionally, new tasks can cause any old ones to be dropped.
 */
export function createTaskQueue({
  drop = false,
  timeBetween = 10,
  concurrent = drop ? 1 : 4,
} = {}) {
  let queue = [], scheduler = 0;

  // Runs all queued tasks, with the required minimum time in between
  function runQueuedTasks() {
    scheduler = queue.length && setTimeout(runQueuedTasks, timeBetween);
    queue.splice(0, concurrent).forEach(async ({ run, resolve, reject }) => {
      try {
        resolve(await run());
      }
      catch (error) {
        reject(error);
      }
    });
  }

  return {
    /** Schedules the given task(s) */
    schedule: function schedule(functions, group = null) {
      // Schedule a single task
      if (!Array.isArray(functions))
        return schedule([functions])[0];

      // Create the tasks and their result promises
      const tasks = [];
      const results = functions.map(run =>
        new Promise((resolve, reject) =>
          tasks.push({ run, resolve, reject, group })));

      // Schedule the tasks
      if (drop)
        queue = tasks;
      else
        queue.push(...tasks);
      if (!scheduler)
        runQueuedTasks();
      return results;
    },

    /** Forgets pending tasks (optionally only those in a given group).
        Returns a boolean indicating whether there were any. */
    clear: function (group) {
      const hadPendingTasks = queue.length > 0;
      queue = queue.filter(task => group !== undefined && task.group !== group);
      return hadPendingTasks;
    },
  };
}
