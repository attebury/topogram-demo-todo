import type { PageLoad } from "./$types";
import { listLookupOptions } from "$lib/api/lookups";

export const load: PageLoad = async ({ fetch }) => {
  const [projectOptions, ownerOptions] = await Promise.all([
    listLookupOptions(fetch, "/lookups/project"),
    listLookupOptions(fetch, "/lookups/user")
  ]);

  return {
    lookups: {
      project_id: projectOptions,
      owner_id: ownerOptions
    }
  };
};
