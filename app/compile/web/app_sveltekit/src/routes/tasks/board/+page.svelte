<script lang="ts">
  const items = [
  {
    "id": "sample-active",
    "title": "Task Board sample",
    "message": "Task Board sample",
    "description": "Generated from Topogram UI contract metadata.",
    "status": "active"
  },
  {
    "id": "sample-completed",
    "title": "Task Board completed sample",
    "message": "Task Board completed sample",
    "description": "Second generated row for rendering checks.",
    "status": "completed"
  }
];
</script>

<main>
  <div class="stack">
    <section class="card">
      <p class="muted">board</p>
      <h1>Task Board</h1>
      <p>This SvelteKit page was generated from <code>task_board</code>.</p>
    </section>

    <section class="card">
      <h2>Sample rows</h2>
      <ul class="resource-list">
        {#each items as item}
          <li>
            <div class="resource-meta">
              <strong>{item.title}</strong>
              <span class="muted">{item.description}</span>
            </div>
            <span class="badge">{item.status}</span>
          </li>
        {/each}
      </ul>
    </section>
  </div>
</main>

<style>
  main { max-width: 72rem; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
  .stack { display: grid; gap: 1rem; }
  .card { background: white; border-radius: 16px; padding: 1.25rem; box-shadow: 0 12px 30px rgba(24, 32, 38, 0.08); }
  .resource-list { list-style: none; padding: 0; margin: 1rem 0 0; display: grid; gap: 0.75rem; }
  .resource-list li { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: 1rem; border: 1px solid #e0e8f1; border-radius: 14px; background: #fbfcfe; }
  .resource-meta { display: grid; gap: 0.35rem; }
  .badge { display: inline-flex; align-items: center; padding: 0.25rem 0.6rem; border-radius: 999px; background: #eef4ff; color: #0f5cc0; font-size: 0.85rem; font-weight: 600; }
  .muted { color: #607284; }
</style>
