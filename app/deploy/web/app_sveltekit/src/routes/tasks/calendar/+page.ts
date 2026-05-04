import type { PageLoad } from "./$types";
import { requestCapability } from "$lib/api/client";

export const load: PageLoad = async ({ fetch }) => {
  const result = await requestCapability(fetch, "cap_list_tasks");
  const resultObject = result && typeof result === "object" && !Array.isArray(result) ? result : {};
  return {
    screen: {
  "id": "task_calendar",
  "title": "Task Calendar",
  "collection": {
    "filters": [],
    "search": [],
    "pagination": null,
    "views": [],
    "refresh": "manual",
    "groupBy": [],
    "sort": []
  },
  "web": {
    "layout": "responsive_collection",
    "desktop_variant": "calendar",
    "mobile_variant": "list",
    "collection": "calendar"
  }
},
    result: Array.isArray(result) ? { items: result } : { items: resultObject.items ?? [], ...resultObject }
  };
};
