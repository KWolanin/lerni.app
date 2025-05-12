import { useAuthStore } from "src/stores/auth";
import { savePomoSession } from "./firebase";

const authStore = useAuthStore();

export function addPomoSession(sessions: number, workTime: number) {
  const session = {
    date: new Date(),
    sessions,
    workTime,
  };
  savePomoSession(authStore.uid, session)
    .catch((error) => {
      console.error('Error saving stat:', error);
    });
}
