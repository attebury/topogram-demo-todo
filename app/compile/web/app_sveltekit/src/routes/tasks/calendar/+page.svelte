<script lang="ts">
  export let data;
</script>

<main>
  <div class="stack">
    <section class="card">
      <div class="button-row" style="justify-content: space-between;">
        <div>
          <p class="muted">calendar</p>
          <h1>Task Calendar</h1>
          <p>This SvelteKit page was generated from <code>task_calendar</code>.</p>
        </div>
      </div>
    </section>

      <section class="stack" data-topogram-region="results">
        <div class="component-card component-calendar" data-topogram-component="component_ui_task_calendar">
          <div class="component-header">
            <div>
              <p class="component-eyebrow">Component</p>
              <h2>Task Calendar</h2>
            </div>
          </div>
          <div class="calendar-list">
            {#each data.result.items.filter((task: any) => task.due_at || task.dueAt) as task}
              <a href={'/tasks/' + task.id}>
                <span>{task.due_at ?? task.dueAt}</span>
                <strong>{task.title}</strong>
              </a>
            {/each}
          </div>
        </div>
      </section>
  </div>
</main>
