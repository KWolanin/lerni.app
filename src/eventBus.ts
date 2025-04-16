import mitt from 'mitt'

type Events = {
  'refresh-dashboard': void
}

const emitter = mitt<Events>()

export default emitter
