import MusicPlayer from 'src/widgets/MusicPlayer.vue'
import PomodoroItem from 'src/widgets/PomodoroItem.vue'
import StartTodo from 'src/widgets/StartTodo.vue'
import TimeSelector from 'src/widgets/TimeSelector.vue'
import UserNote from 'src/widgets/UserNote.vue'
import UserTodo from 'src/widgets/UserTodo.vue'
import KanbanTable from 'src/widgets/KanbanTable.vue'
import PomoStats from 'src/widgets/PomoStats.vue'
import type { App } from 'vue'

export default ({ app }: { app: App }) => {
  app.component('MusicPlayer', MusicPlayer)
  app.component('PomodoroItem', PomodoroItem)
  app.component('StartTodo', StartTodo)
  app.component('TimeSelector', TimeSelector)
  app.component('UserNote', UserNote)
  app.component('UserTodo', UserTodo)
  app.component('KanbanTable', KanbanTable)
  app.component('PomoStats', PomoStats)
}
