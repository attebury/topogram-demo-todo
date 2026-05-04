<script lang="ts">
  export let data;
</script>

<main>
  <div class="stack">
    <section class="card">
      <div class="button-row" style="justify-content: space-between;">
        <div>
          <p class="muted">board</p>
          <h1>Task Board</h1>
          <p>This SvelteKit page was generated from <code>task_board</code>.</p>
        </div>
      </div>
    </section>

      <section class="stack" data-topogram-region="results">
        <div class="component-card component-board" data-topogram-component="component_ui_task_board">
          <div class="component-header">
            <div>
              <p class="component-eyebrow">Component</p>
              <h2>Task Board</h2>
            </div>
          </div>
          <div class="board-grid">
            {#each ["draft", "active", "completed", "archived"] as status}
              <section class="board-column">
                <h3>{status}</h3>
                {#each data.result.items.filter((task: any) => task.status === status) as task}
                  <a class="board-card" href={'/tasks/' + task.id}>{task.title}</a>
                {/each}
              </section>
            {/each}
          </div>
        </div>
      </section>
  </div>
</main>
