import mitt from 'mitt'

type Events = {
  'refresh-dashboard': void,
  'refresh-easy': void,
}

const emitter = mitt<Events>()

export default emitter
