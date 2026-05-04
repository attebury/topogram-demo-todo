<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>Topogram Todo</title>
</svelte:head>

<div class="app-shell">
  <header class="app-nav">
    <a class="brand" href="/">Topogram Todo</a>
    <nav>
    <a href="/projects">Projects</a>
    <a href="/projects/new">Create Project</a>
    <a href="/users">Users</a>
    <a href="/users/new">Create User</a>
    <a href="/tasks">Tasks</a>
    <a href="/tasks/board">Task Board</a>
    <a href="/tasks/calendar">Task Calendar</a>
    <a href="/tasks/new">Create Task</a>
    </nav>
  </header>
  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    color: #182026;
    background: linear-gradient(180deg, #f5f7fb 0%, #edf2f7 100%);
  }
  :global(a) { color: #0f5cc0; text-decoration: none; }
  :global(a:hover) { text-decoration: underline; }
  .app-shell { min-height: 100vh; }
  .app-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(24, 32, 38, 0.08);
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
  }
  nav { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .brand { font-weight: 700; }
  @media (max-width: 640px) { .app-nav { flex-wrap: wrap; } }
</style>
