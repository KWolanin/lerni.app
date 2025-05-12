import { startersTask } from "src/starters";
import type { EasyTask } from "src/types";


export const getStartersByLang = (lang: string) : EasyTask[] => {
  const tasks : EasyTask[] = [];
  startersTask[lang]?.map((starter) => {
    tasks.push({ label: starter, checked: false });
  });
  return tasks;
};
