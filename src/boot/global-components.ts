import MusicPlayer from 'src/components/MusicPlayer.vue'
import PomodoroItem from 'src/components/PomodoroItem.vue'
import StartTodo from 'src/components/StartTodo.vue'
import TimeSelector from 'src/components/TimeSelector.vue'
import UserNote from 'src/components/UserNote.vue'
import UserTodo from 'src/components/UserTodo.vue'
import UserNotes from 'src/components/UserNotes.vue'
import type { App } from 'vue'

export default ({ app }: { app: App }) => {
  app.component('MusicPlayer', MusicPlayer)
  app.component('PomodoroItem', PomodoroItem)
  app.component('StartTodo', StartTodo)
  app.component('TimeSelector', TimeSelector)
  app.component('UserNote', UserNote)
  app.component('UserTodo', UserTodo)
  app.component('UserNotes', UserNotes)
}
